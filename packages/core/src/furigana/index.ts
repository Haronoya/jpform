/**
 * ふりがな生成ユーティリティ
 *
 * 漢字からふりがな（カタカナ/ひらがな）を推測する機能を提供します。
 * 注意: 完全な精度を保証するものではありません。
 */

import { toHiragana, toKatakana } from '../converters/kana.js'

// 一般的な日本の姓（上位200件程度）
const LAST_NAME_READINGS: Record<string, string> = {
  佐藤: 'サトウ',
  鈴木: 'スズキ',
  高橋: 'タカハシ',
  田中: 'タナカ',
  伊藤: 'イトウ',
  渡辺: 'ワタナベ',
  山本: 'ヤマモト',
  中村: 'ナカムラ',
  小林: 'コバヤシ',
  加藤: 'カトウ',
  吉田: 'ヨシダ',
  山田: 'ヤマダ',
  佐々木: 'ササキ',
  山口: 'ヤマグチ',
  松本: 'マツモト',
  井上: 'イノウエ',
  木村: 'キムラ',
  林: 'ハヤシ',
  斎藤: 'サイトウ',
  斉藤: 'サイトウ',
  齋藤: 'サイトウ',
  齊藤: 'サイトウ',
  清水: 'シミズ',
  山崎: 'ヤマザキ',
  森: 'モリ',
  池田: 'イケダ',
  橋本: 'ハシモト',
  阿部: 'アベ',
  石川: 'イシカワ',
  山下: 'ヤマシタ',
  中島: 'ナカジマ',
  石井: 'イシイ',
  小川: 'オガワ',
  前田: 'マエダ',
  岡田: 'オカダ',
  長谷川: 'ハセガワ',
  藤田: 'フジタ',
  後藤: 'ゴトウ',
  近藤: 'コンドウ',
  村上: 'ムラカミ',
  遠藤: 'エンドウ',
  青木: 'アオキ',
  坂本: 'サカモト',
  藤井: 'フジイ',
  西村: 'ニシムラ',
  福田: 'フクダ',
  太田: 'オオタ',
  三浦: 'ミウラ',
  岡本: 'オカモト',
  松田: 'マツダ',
  中川: 'ナカガワ',
  中野: 'ナカノ',
  原田: 'ハラダ',
  小野: 'オノ',
  田村: 'タムラ',
  竹内: 'タケウチ',
  金子: 'カネコ',
  和田: 'ワダ',
  中山: 'ナカヤマ',
  石田: 'イシダ',
  上田: 'ウエダ',
  森田: 'モリタ',
  原: 'ハラ',
  柴田: 'シバタ',
  酒井: 'サカイ',
  工藤: 'クドウ',
  横山: 'ヨコヤマ',
  宮崎: 'ミヤザキ',
  宮本: 'ミヤモト',
  内田: 'ウチダ',
  高木: 'タカギ',
  安藤: 'アンドウ',
  谷口: 'タニグチ',
  大野: 'オオノ',
  丸山: 'マルヤマ',
  今井: 'イマイ',
  河野: 'コウノ',
  藤原: 'フジワラ',
  小島: 'コジマ',
  村田: 'ムラタ',
  永井: 'ナガイ',
  杉山: 'スギヤマ',
  平野: 'ヒラノ',
  武田: 'タケダ',
  上野: 'ウエノ',
  杉本: 'スギモト',
  新井: 'アライ',
  増田: 'マスダ',
  小山: 'コヤマ',
  大塚: 'オオツカ',
  平田: 'ヒラタ',
  千葉: 'チバ',
  久保: 'クボ',
  松井: 'マツイ',
  松尾: 'マツオ',
  岩崎: 'イワサキ',
  木下: 'キノシタ',
  野口: 'ノグチ',
  菊池: 'キクチ',
  佐野: 'サノ',
  野村: 'ノムラ',
  渡部: 'ワタナベ',
  渡邊: 'ワタナベ',
  渡邉: 'ワタナベ',
}

// 一般的な日本の名前（上位100件程度）
const FIRST_NAME_READINGS: Record<string, string> = {
  // 男性名
  大輔: 'ダイスケ',
  健太: 'ケンタ',
  拓也: 'タクヤ',
  翔太: 'ショウタ',
  翔: 'ショウ',
  蓮: 'レン',
  大翔: 'ヒロト',
  悠真: 'ユウマ',
  陽翔: 'ハルト',
  湊: 'ミナト',
  悠斗: 'ユウト',
  樹: 'イツキ',
  颯太: 'ソウタ',
  一郎: 'イチロウ',
  太郎: 'タロウ',
  次郎: 'ジロウ',
  三郎: 'サブロウ',
  健一: 'ケンイチ',
  雄一: 'ユウイチ',
  正人: 'マサト',
  和也: 'カズヤ',
  直樹: 'ナオキ',
  隆: 'タカシ',
  誠: 'マコト',
  剛: 'ツヨシ',
  浩: 'ヒロシ',
  豊: 'ユタカ',
  修: 'オサム',
  学: 'マナブ',
  進: 'ススム',
  亮: 'リョウ',
  淳: 'ジュン',
  徹: 'トオル',
  哲也: 'テツヤ',
  達也: 'タツヤ',
  雅人: 'マサト',
  秀樹: 'ヒデキ',
  康弘: 'ヤスヒロ',
  // 女性名
  陽菜: 'ヒナ',
  結衣: 'ユイ',
  葵: 'アオイ',
  凛: 'リン',
  紬: 'ツムギ',
  陽葵: 'ヒマリ',
  芽依: 'メイ',
  結菜: 'ユイナ',
  咲良: 'サクラ',
  美咲: 'ミサキ',
  優子: 'ユウコ',
  恵子: 'ケイコ',
  和子: 'カズコ',
  幸子: 'サチコ',
  洋子: 'ヨウコ',
  裕子: 'ユウコ',
  真由美: 'マユミ',
  由美子: 'ユミコ',
  久美子: 'クミコ',
  智子: 'トモコ',
  直美: 'ナオミ',
  美穂: 'ミホ',
  愛: 'アイ',
  彩: 'アヤ',
  舞: 'マイ',
  麻衣: 'マイ',
  美香: 'ミカ',
  千尋: 'チヒロ',
  美紀: 'ミキ',
  真紀: 'マキ',
  綾: 'アヤ',
  綾子: 'アヤコ',
  瞳: 'ヒトミ',
  さくら: 'サクラ',
  桜: 'サクラ',
  花: 'ハナ',
  花子: 'ハナコ',
}

export type FuriganaFormat = 'katakana' | 'hiragana'

export interface FuriganaOptions {
  /** 出力形式（デフォルト: katakana） */
  format?: FuriganaFormat
}

/**
 * 姓からふりがなを推測
 *
 * @param lastName - 姓（漢字）
 * @param options - オプション
 * @returns ふりがな、見つからない場合は undefined
 *
 * @example
 * ```ts
 * getLastNameFurigana('山田') // 'ヤマダ'
 * getLastNameFurigana('山田', { format: 'hiragana' }) // 'やまだ'
 * getLastNameFurigana('未登録姓') // undefined
 * ```
 */
export function getLastNameFurigana(
  lastName: string,
  options: FuriganaOptions = {}
): string | undefined {
  const { format = 'katakana' } = options
  const reading = LAST_NAME_READINGS[lastName]

  if (!reading) {
    return undefined
  }

  return format === 'hiragana' ? toHiragana(reading) : reading
}

/**
 * 名からふりがなを推測
 *
 * @param firstName - 名（漢字）
 * @param options - オプション
 * @returns ふりがな、見つからない場合は undefined
 *
 * @example
 * ```ts
 * getFirstNameFurigana('太郎') // 'タロウ'
 * getFirstNameFurigana('太郎', { format: 'hiragana' }) // 'たろう'
 * getFirstNameFurigana('未登録名') // undefined
 * ```
 */
export function getFirstNameFurigana(
  firstName: string,
  options: FuriganaOptions = {}
): string | undefined {
  const { format = 'katakana' } = options
  const reading = FIRST_NAME_READINGS[firstName]

  if (!reading) {
    return undefined
  }

  return format === 'hiragana' ? toHiragana(reading) : reading
}

/**
 * 姓名からふりがなを推測
 *
 * @param fullName - フルネーム（姓 名 または 姓名）
 * @param options - オプション
 * @returns ふりがな（姓名両方が見つかった場合のみ）
 *
 * @example
 * ```ts
 * getFullNameFurigana('山田 太郎') // 'ヤマダ タロウ'
 * getFullNameFurigana('山田太郎') // undefined (区切りがないため)
 * ```
 */
export function getFullNameFurigana(
  fullName: string,
  options: FuriganaOptions = {}
): string | undefined {
  // スペースで区切られているか確認（半角・全角スペース）
  const parts = fullName.split(/[\s\u3000]+/)

  if (parts.length !== 2) {
    return undefined
  }

  const [lastName, firstName] = parts
  const lastNameReading = getLastNameFurigana(lastName ?? '', options)
  const firstNameReading = getFirstNameFurigana(firstName ?? '', options)

  if (!lastNameReading || !firstNameReading) {
    return undefined
  }

  return `${lastNameReading} ${firstNameReading}`
}

/**
 * 辞書に姓を追加
 *
 * @param lastName - 姓（漢字）
 * @param reading - 読み（カタカナ）
 */
export function addLastNameReading(lastName: string, reading: string): void {
  LAST_NAME_READINGS[lastName] = toKatakana(reading)
}

/**
 * 辞書に名を追加
 *
 * @param firstName - 名（漢字）
 * @param reading - 読み（カタカナ）
 */
export function addFirstNameReading(firstName: string, reading: string): void {
  FIRST_NAME_READINGS[firstName] = toKatakana(reading)
}
