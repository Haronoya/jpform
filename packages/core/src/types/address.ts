import type { Prefecture, PrefectureCode } from './prefecture.js'

/**
 * 日本の住所を表す型
 */
export type JPAddress = {
  /** 郵便番号（ハイフンなし7桁） */
  postalCode: string
  /** 都道府県名 */
  prefecture: Prefecture
  /** 都道府県コード（JISコード） */
  prefectureCode: PrefectureCode
  /** 市区町村名 */
  city: string
  /** 町域名 */
  town: string
  /** 都道府県名カナ */
  prefectureKana?: string | undefined
  /** 市区町村名カナ */
  cityKana?: string | undefined
  /** 町域名カナ */
  townKana?: string | undefined
}
