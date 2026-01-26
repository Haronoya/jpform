/**
 * 氏名生成オプション
 */
export type FakePersonOptions = {
  /** 性別 */
  gender?: 'male' | 'female' | undefined
  /** カナ情報を含めるか（デフォルト: true） */
  includeKana?: boolean | undefined
  /** ひらがなカナを含めるか（デフォルト: false） */
  includeHiragana?: boolean | undefined
}

/**
 * 氏名データ
 */
export type FakePerson = {
  /** 姓 */
  lastName: string
  /** 名 */
  firstName: string
  /** 姓（カタカナ） */
  lastNameKana?: string
  /** 名（カタカナ） */
  firstNameKana?: string
  /** 姓（ひらがな） */
  lastNameHiragana?: string
  /** 名（ひらがな） */
  firstNameHiragana?: string
  /** フルネーム */
  fullName: string
  /** フルネーム（カタカナ） */
  fullNameKana?: string
  /** フルネーム（ひらがな） */
  fullNameHiragana?: string
}

type NameData = {
  kanji: string
  kana: string
  hiragana: string
}

const LAST_NAMES: NameData[] = [
  { kanji: '佐藤', kana: 'サトウ', hiragana: 'さとう' },
  { kanji: '鈴木', kana: 'スズキ', hiragana: 'すずき' },
  { kanji: '高橋', kana: 'タカハシ', hiragana: 'たかはし' },
  { kanji: '田中', kana: 'タナカ', hiragana: 'たなか' },
  { kanji: '伊藤', kana: 'イトウ', hiragana: 'いとう' },
  { kanji: '渡辺', kana: 'ワタナベ', hiragana: 'わたなべ' },
  { kanji: '山本', kana: 'ヤマモト', hiragana: 'やまもと' },
  { kanji: '中村', kana: 'ナカムラ', hiragana: 'なかむら' },
  { kanji: '小林', kana: 'コバヤシ', hiragana: 'こばやし' },
  { kanji: '加藤', kana: 'カトウ', hiragana: 'かとう' },
  { kanji: '吉田', kana: 'ヨシダ', hiragana: 'よしだ' },
  { kanji: '山田', kana: 'ヤマダ', hiragana: 'やまだ' },
  { kanji: '佐々木', kana: 'ササキ', hiragana: 'ささき' },
  { kanji: '山口', kana: 'ヤマグチ', hiragana: 'やまぐち' },
  { kanji: '松本', kana: 'マツモト', hiragana: 'まつもと' },
  { kanji: '井上', kana: 'イノウエ', hiragana: 'いのうえ' },
  { kanji: '木村', kana: 'キムラ', hiragana: 'きむら' },
  { kanji: '林', kana: 'ハヤシ', hiragana: 'はやし' },
  { kanji: '斎藤', kana: 'サイトウ', hiragana: 'さいとう' },
  { kanji: '清水', kana: 'シミズ', hiragana: 'しみず' },
]

const MALE_FIRST_NAMES: NameData[] = [
  { kanji: '大翔', kana: 'ヒロト', hiragana: 'ひろと' },
  { kanji: '蓮', kana: 'レン', hiragana: 'れん' },
  { kanji: '悠真', kana: 'ユウマ', hiragana: 'ゆうま' },
  { kanji: '陽翔', kana: 'ハルト', hiragana: 'はると' },
  { kanji: '湊', kana: 'ミナト', hiragana: 'みなと' },
  { kanji: '樹', kana: 'イツキ', hiragana: 'いつき' },
  { kanji: '悠人', kana: 'ユウト', hiragana: 'ゆうと' },
  { kanji: '朝陽', kana: 'アサヒ', hiragana: 'あさひ' },
  { kanji: '翔太', kana: 'ショウタ', hiragana: 'しょうた' },
  { kanji: '健太', kana: 'ケンタ', hiragana: 'けんた' },
  { kanji: '太郎', kana: 'タロウ', hiragana: 'たろう' },
  { kanji: '一郎', kana: 'イチロウ', hiragana: 'いちろう' },
  { kanji: '誠', kana: 'マコト', hiragana: 'まこと' },
  { kanji: '健', kana: 'ケン', hiragana: 'けん' },
  { kanji: '翔', kana: 'ショウ', hiragana: 'しょう' },
]

const FEMALE_FIRST_NAMES: NameData[] = [
  { kanji: '陽葵', kana: 'ヒマリ', hiragana: 'ひまり' },
  { kanji: '芽依', kana: 'メイ', hiragana: 'めい' },
  { kanji: '凛', kana: 'リン', hiragana: 'りん' },
  { kanji: '結菜', kana: 'ユイナ', hiragana: 'ゆいな' },
  { kanji: '咲良', kana: 'サクラ', hiragana: 'さくら' },
  { kanji: '莉子', kana: 'リコ', hiragana: 'りこ' },
  { kanji: '美咲', kana: 'ミサキ', hiragana: 'みさき' },
  { kanji: '優花', kana: 'ユウカ', hiragana: 'ゆうか' },
  { kanji: '花子', kana: 'ハナコ', hiragana: 'はなこ' },
  { kanji: '愛', kana: 'アイ', hiragana: 'あい' },
  { kanji: '美和', kana: 'ミワ', hiragana: 'みわ' },
  { kanji: '由美', kana: 'ユミ', hiragana: 'ゆみ' },
  { kanji: '真由', kana: 'マユ', hiragana: 'まゆ' },
  { kanji: '恵', kana: 'メグミ', hiragana: 'めぐみ' },
  { kanji: '彩', kana: 'アヤ', hiragana: 'あや' },
]

/**
 * ランダムな配列要素を取得
 */
function randomItem<T>(array: readonly T[]): T {
  return array[Math.floor(Math.random() * array.length)] as T
}

/**
 * ランダムな氏名を生成
 *
 * @param options - オプション
 * @returns ランダムな氏名
 *
 * @example
 * ```ts
 * const person = fakePerson()
 * // {
 * //   lastName: '田中',
 * //   firstName: '太郎',
 * //   lastNameKana: 'タナカ',
 * //   firstNameKana: 'タロウ',
 * //   fullName: '田中 太郎',
 * //   fullNameKana: 'タナカ タロウ'
 * // }
 *
 * const female = fakePerson({ gender: 'female' })
 * // 女性名のみ
 * ```
 */
export function fakePerson(options: FakePersonOptions = {}): FakePerson {
  const { gender, includeKana = true, includeHiragana = false } = options

  const lastName = randomItem(LAST_NAMES)

  // 性別が指定されていない場合は50%の確率で選択
  const isMale = gender ? gender === 'male' : Math.random() < 0.5
  const firstNameList = isMale ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES
  const firstName = randomItem(firstNameList)

  const result: FakePerson = {
    lastName: lastName.kanji,
    firstName: firstName.kanji,
    fullName: `${lastName.kanji} ${firstName.kanji}`,
  }

  if (includeKana) {
    result.lastNameKana = lastName.kana
    result.firstNameKana = firstName.kana
    result.fullNameKana = `${lastName.kana} ${firstName.kana}`
  }

  if (includeHiragana) {
    result.lastNameHiragana = lastName.hiragana
    result.firstNameHiragana = firstName.hiragana
    result.fullNameHiragana = `${lastName.hiragana} ${firstName.hiragana}`
  }

  return result
}

/**
 * ランダムな姓を生成
 *
 * @returns ランダムな姓
 */
export function fakeLastName(): string {
  return randomItem(LAST_NAMES).kanji
}

/**
 * ランダムな名を生成
 *
 * @param gender - 性別
 * @returns ランダムな名
 */
export function fakeFirstName(gender?: 'male' | 'female'): string {
  const isMale = gender ? gender === 'male' : Math.random() < 0.5
  const list = isMale ? MALE_FIRST_NAMES : FEMALE_FIRST_NAMES
  return randomItem(list).kanji
}

/**
 * ランダムなフルネームを生成
 *
 * @param gender - 性別
 * @returns ランダムなフルネーム
 */
export function fakeFullName(gender?: 'male' | 'female'): string {
  return fakePerson({ gender, includeKana: false }).fullName
}

/**
 * 複数のランダムな氏名を生成
 *
 * @param count - 生成する件数
 * @param options - オプション
 * @returns ランダムな氏名の配列
 */
export function fakePersons(count: number, options: FakePersonOptions = {}): FakePerson[] {
  return Array.from({ length: count }, () => fakePerson(options))
}
