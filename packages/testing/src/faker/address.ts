import type { JPAddress, Prefecture } from '@haro/jpform-core'
import { PREFECTURES, getPrefectureCode } from '@haro/jpform-core'

/**
 * 住所生成オプション
 */
export type FakeAddressOptions = {
  /** 都道府県を固定 */
  prefecture?: Prefecture
  /** 郵便番号を固定 */
  postalCode?: string
  /** カナ情報を含めるか（デフォルト: false） */
  includeKana?: boolean
}

/**
 * サンプル住所データ
 */
const SAMPLE_ADDRESSES: Omit<JPAddress, 'postalCode'>[] = [
  {
    prefecture: '東京都',
    prefectureCode: '13',
    city: '千代田区',
    town: '丸の内',
    prefectureKana: 'トウキョウト',
    cityKana: 'チヨダク',
    townKana: 'マルノウチ',
  },
  {
    prefecture: '東京都',
    prefectureCode: '13',
    city: '新宿区',
    town: '西新宿',
    prefectureKana: 'トウキョウト',
    cityKana: 'シンジュクク',
    townKana: 'ニシシンジュク',
  },
  {
    prefecture: '東京都',
    prefectureCode: '13',
    city: '渋谷区',
    town: '渋谷',
    prefectureKana: 'トウキョウト',
    cityKana: 'シブヤク',
    townKana: 'シブヤ',
  },
  {
    prefecture: '大阪府',
    prefectureCode: '27',
    city: '大阪市北区',
    town: '梅田',
    prefectureKana: 'オオサカフ',
    cityKana: 'オオサカシキタク',
    townKana: 'ウメダ',
  },
  {
    prefecture: '大阪府',
    prefectureCode: '27',
    city: '大阪市中央区',
    town: '難波',
    prefectureKana: 'オオサカフ',
    cityKana: 'オオサカシチュウオウク',
    townKana: 'ナンバ',
  },
  {
    prefecture: '神奈川県',
    prefectureCode: '14',
    city: '横浜市西区',
    town: 'みなとみらい',
    prefectureKana: 'カナガワケン',
    cityKana: 'ヨコハマシニシク',
    townKana: 'ミナトミライ',
  },
  {
    prefecture: '愛知県',
    prefectureCode: '23',
    city: '名古屋市中区',
    town: '栄',
    prefectureKana: 'アイチケン',
    cityKana: 'ナゴヤシナカク',
    townKana: 'サカエ',
  },
  {
    prefecture: '北海道',
    prefectureCode: '01',
    city: '札幌市中央区',
    town: '大通',
    prefectureKana: 'ホッカイドウ',
    cityKana: 'サッポロシチュウオウク',
    townKana: 'オオドオリ',
  },
  {
    prefecture: '福岡県',
    prefectureCode: '40',
    city: '福岡市博多区',
    town: '博多駅前',
    prefectureKana: 'フクオカケン',
    cityKana: 'フクオカシハカタク',
    townKana: 'ハカタエキマエ',
  },
  {
    prefecture: '京都府',
    prefectureCode: '26',
    city: '京都市中京区',
    town: '烏丸',
    prefectureKana: 'キョウトフ',
    cityKana: 'キョウトシナカギョウク',
    townKana: 'カラスマ',
  },
]

/**
 * サンプル郵便番号
 */
const SAMPLE_POSTAL_CODES = [
  '1000001', '1600023', '1500001', '5300001', '5420076',
  '2200012', '4600008', '0600042', '8120011', '6048156',
]

/**
 * ランダムな配列要素を取得
 */
function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T
}

/**
 * ランダムな数字文字列を生成
 */
function randomDigits(length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

/**
 * ランダムな郵便番号を生成
 */
export function fakePostalCode(): string {
  // 80%の確率でサンプルから選択、20%でランダム生成
  if (Math.random() < 0.8) {
    return randomItem(SAMPLE_POSTAL_CODES)
  }
  return randomDigits(7)
}

/**
 * ランダムな都道府県を生成
 */
export function fakePrefecture(): Prefecture {
  return randomItem(PREFECTURES)
}

/**
 * ランダムな住所を生成
 *
 * @param options - オプション
 * @returns ランダムな住所
 *
 * @example
 * ```ts
 * const address = fakeAddress()
 * // { postalCode: '1000001', prefecture: '東京都', city: '千代田区', ... }
 *
 * const tokyoAddress = fakeAddress({ prefecture: '東京都' })
 * // 東京都内の住所
 * ```
 */
export function fakeAddress(options: FakeAddressOptions = {}): JPAddress {
  const { prefecture, postalCode, includeKana = false } = options

  // 都道府県でフィルタリング
  let candidates = SAMPLE_ADDRESSES
  if (prefecture) {
    candidates = SAMPLE_ADDRESSES.filter((a) => a.prefecture === prefecture)
    if (candidates.length === 0) {
      // 該当する都道府県がない場合はダミーデータを生成
      candidates = [
        {
          prefecture,
          prefectureCode: getPrefectureCode(prefecture),
          city: '○○市',
          town: '△△',
          prefectureKana: undefined,
          cityKana: undefined,
          townKana: undefined,
        },
      ]
    }
  }

  const base = randomItem(candidates)

  const result: JPAddress = {
    postalCode: postalCode ?? fakePostalCode(),
    prefecture: base.prefecture,
    prefectureCode: base.prefectureCode,
    city: base.city,
    town: base.town,
  }

  if (includeKana) {
    result.prefectureKana = base.prefectureKana
    result.cityKana = base.cityKana
    result.townKana = base.townKana
  }

  return result
}

/**
 * 複数のランダムな住所を生成
 *
 * @param count - 生成する件数
 * @param options - オプション
 * @returns ランダムな住所の配列
 */
export function fakeAddresses(count: number, options: FakeAddressOptions = {}): JPAddress[] {
  return Array.from({ length: count }, () => fakeAddress(options))
}
