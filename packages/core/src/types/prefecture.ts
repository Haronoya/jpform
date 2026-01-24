/**
 * 47都道府県の定数配列
 * JISコード順（01: 北海道 〜 47: 沖縄県）
 */
export const PREFECTURES = [
  '北海道',
  '青森県',
  '岩手県',
  '宮城県',
  '秋田県',
  '山形県',
  '福島県',
  '茨城県',
  '栃木県',
  '群馬県',
  '埼玉県',
  '千葉県',
  '東京都',
  '神奈川県',
  '新潟県',
  '富山県',
  '石川県',
  '福井県',
  '山梨県',
  '長野県',
  '岐阜県',
  '静岡県',
  '愛知県',
  '三重県',
  '滋賀県',
  '京都府',
  '大阪府',
  '兵庫県',
  '奈良県',
  '和歌山県',
  '鳥取県',
  '島根県',
  '岡山県',
  '広島県',
  '山口県',
  '徳島県',
  '香川県',
  '愛媛県',
  '高知県',
  '福岡県',
  '佐賀県',
  '長崎県',
  '熊本県',
  '大分県',
  '宮崎県',
  '鹿児島県',
  '沖縄県',
] as const

/**
 * 都道府県名の型
 */
export type Prefecture = (typeof PREFECTURES)[number]

/**
 * 都道府県コード（JISコード）
 * 01: 北海道 〜 47: 沖縄県
 */
export type PrefectureCode =
  | '01'
  | '02'
  | '03'
  | '04'
  | '05'
  | '06'
  | '07'
  | '08'
  | '09'
  | '10'
  | '11'
  | '12'
  | '13'
  | '14'
  | '15'
  | '16'
  | '17'
  | '18'
  | '19'
  | '20'
  | '21'
  | '22'
  | '23'
  | '24'
  | '25'
  | '26'
  | '27'
  | '28'
  | '29'
  | '30'
  | '31'
  | '32'
  | '33'
  | '34'
  | '35'
  | '36'
  | '37'
  | '38'
  | '39'
  | '40'
  | '41'
  | '42'
  | '43'
  | '44'
  | '45'
  | '46'
  | '47'

/**
 * 都道府県名からコードを取得
 */
export function getPrefectureCode(prefecture: Prefecture): PrefectureCode {
  const index = PREFECTURES.indexOf(prefecture)
  return String(index + 1).padStart(2, '0') as PrefectureCode
}

/**
 * コードから都道府県名を取得
 */
export function getPrefectureName(code: PrefectureCode): Prefecture {
  const index = parseInt(code, 10) - 1
  const prefecture = PREFECTURES[index]
  if (!prefecture) {
    throw new Error(`Invalid prefecture code: ${code}`)
  }
  return prefecture
}

/**
 * 都道府県名かどうかを判定
 */
export function isPrefecture(value: string): value is Prefecture {
  return PREFECTURES.includes(value as Prefecture)
}
