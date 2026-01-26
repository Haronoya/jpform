import {
  normalizePostalCode,
  type JPAddress,
  type Prefecture,
  type PrefectureCode,
} from '@haro/jpform-core'
import type { PostalData, PostalResolver } from './types.js'

// 同梱データをインポート（ビルド時に生成される）
import postalData from '../../data/postal.json' with { type: 'json' }

const data = postalData as unknown as PostalData

/**
 * 同梱データを使用する郵便番号Resolver
 */
export class BundledResolver implements PostalResolver {
  async resolve(postalCode: string): Promise<JPAddress[]> {
    const normalized = normalizePostalCode(postalCode)

    if (normalized.length !== 7) {
      return []
    }

    const entries = data.data[normalized]
    if (!entries) {
      return []
    }

    return entries.map((entry) => {
      const [prefIndex, cityIndex, town, townKana] = entry
      const prefCode = String(prefIndex + 1).padStart(2, '0') as PrefectureCode
      const prefecture = data.prefs[prefIndex] as Prefecture
      const prefectureKana = data.prefsKana[prefIndex]
      const cities = data.cities[prefCode]
      const citiesKana = data.citiesKana[prefCode]
      const city = cities?.[cityIndex] ?? ''
      const cityKana = citiesKana?.[cityIndex]

      return {
        postalCode: normalized,
        prefecture,
        prefectureCode: prefCode,
        city,
        town,
        prefectureKana,
        cityKana,
        townKana,
      }
    })
  }
}

/**
 * デフォルトのBundledResolverインスタンス
 */
export const bundledResolver = new BundledResolver()
