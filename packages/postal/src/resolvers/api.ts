import {
  normalizePostalCode,
  type JPAddress,
  type Prefecture,
  type PrefectureCode,
  getPrefectureCode,
  isPrefecture,
} from '@haro/jpform-core'
import type { PostalResolver } from './types.js'

/**
 * API Resolverの設定
 */
export type ApiResolverOptions = {
  /** APIエンドポイントURL */
  endpoint?: string
  /** タイムアウト（ミリ秒） */
  timeout?: number
}

/**
 * zipcloud APIのレスポンス型
 */
type ZipcloudResponse = {
  status: number
  message: string | null
  results:
    | Array<{
        zipcode: string
        prefcode: string
        address1: string
        address2: string
        address3: string
        kana1: string
        kana2: string
        kana3: string
      }>
    | null
}

/**
 * 外部APIを使用する郵便番号Resolver
 *
 * デフォルトはzipcloud APIを使用
 * @see https://zipcloud.ibsnet.co.jp/doc/api
 */
export class ApiResolver implements PostalResolver {
  private readonly endpoint: string
  private readonly timeout: number

  constructor(options: ApiResolverOptions = {}) {
    this.endpoint = options.endpoint ?? 'https://zipcloud.ibsnet.co.jp/api/search'
    this.timeout = options.timeout ?? 10000
  }

  async resolve(postalCode: string): Promise<JPAddress[]> {
    const normalized = normalizePostalCode(postalCode)

    if (normalized.length !== 7) {
      return []
    }

    const url = `${this.endpoint}?zipcode=${normalized}`

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), this.timeout)

    try {
      const response = await fetch(url, {
        signal: controller.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`)
      }

      const data = (await response.json()) as ZipcloudResponse

      if (data.status !== 200 || !data.results) {
        return []
      }

      return data.results.map((result) => {
        const prefecture = result.address1 as Prefecture
        const prefectureCode = isPrefecture(prefecture)
          ? getPrefectureCode(prefecture)
          : (result.prefcode.padStart(2, '0') as PrefectureCode)

        return {
          postalCode: normalized,
          prefecture,
          prefectureCode,
          city: result.address2,
          town: result.address3,
          prefectureKana: result.kana1,
          cityKana: result.kana2,
          townKana: result.kana3,
        }
      })
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout')
      }
      throw error
    } finally {
      clearTimeout(timeoutId)
    }
  }
}

/**
 * API Resolverを作成
 */
export function createApiResolver(options?: ApiResolverOptions): ApiResolver {
  return new ApiResolver(options)
}
