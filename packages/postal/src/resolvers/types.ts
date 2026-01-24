import type { JPAddress } from '@haro/jpform-core'

/**
 * 郵便番号解決のインターフェース
 */
export interface PostalResolver {
  /**
   * 郵便番号から住所を解決
   *
   * @param postalCode - 郵便番号（7桁の数字）
   * @returns 住所の配列（1つの郵便番号に複数の住所がある場合がある）
   */
  resolve(postalCode: string): Promise<JPAddress[]>
}

/**
 * 同梱データの圧縮形式
 */
export type PostalData = {
  /** 都道府県辞書 (index = prefCode - 1) */
  prefs: string[]
  /** 都道府県カナ辞書 */
  prefsKana: string[]
  /** 市区町村辞書 (prefCode -> cities) */
  cities: Record<string, string[]>
  /** 市区町村カナ辞書 (prefCode -> cities kana) */
  citiesKana: Record<string, string[]>
  /** 郵便番号データ (postalCode -> [[prefIndex, cityIndex, town, townKana?], ...]) */
  data: Record<string, Array<[number, number, string, string?]>>
}
