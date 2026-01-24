/**
 * 半角カタカナ → 全角カタカナ変換マップ
 */
const HANKAKU_KANA_MAP: Record<string, string> = {
  ｦ: 'ヲ',
  ｧ: 'ァ',
  ｨ: 'ィ',
  ｩ: 'ゥ',
  ｪ: 'ェ',
  ｫ: 'ォ',
  ｬ: 'ャ',
  ｭ: 'ュ',
  ｮ: 'ョ',
  ｯ: 'ッ',
  ｰ: 'ー',
  ｱ: 'ア',
  ｲ: 'イ',
  ｳ: 'ウ',
  ｴ: 'エ',
  ｵ: 'オ',
  ｶ: 'カ',
  ｷ: 'キ',
  ｸ: 'ク',
  ｹ: 'ケ',
  ｺ: 'コ',
  ｻ: 'サ',
  ｼ: 'シ',
  ｽ: 'ス',
  ｾ: 'セ',
  ｿ: 'ソ',
  ﾀ: 'タ',
  ﾁ: 'チ',
  ﾂ: 'ツ',
  ﾃ: 'テ',
  ﾄ: 'ト',
  ﾅ: 'ナ',
  ﾆ: 'ニ',
  ﾇ: 'ヌ',
  ﾈ: 'ネ',
  ﾉ: 'ノ',
  ﾊ: 'ハ',
  ﾋ: 'ヒ',
  ﾌ: 'フ',
  ﾍ: 'ヘ',
  ﾎ: 'ホ',
  ﾏ: 'マ',
  ﾐ: 'ミ',
  ﾑ: 'ム',
  ﾒ: 'メ',
  ﾓ: 'モ',
  ﾔ: 'ヤ',
  ﾕ: 'ユ',
  ﾖ: 'ヨ',
  ﾗ: 'ラ',
  ﾘ: 'リ',
  ﾙ: 'ル',
  ﾚ: 'レ',
  ﾛ: 'ロ',
  ﾜ: 'ワ',
  ﾝ: 'ン',
  ﾞ: '゛',
  ﾟ: '゜',
}

/**
 * 濁点・半濁点の結合マップ
 */
const DAKUTEN_MAP: Record<string, string> = {
  カ: 'ガ',
  キ: 'ギ',
  ク: 'グ',
  ケ: 'ゲ',
  コ: 'ゴ',
  サ: 'ザ',
  シ: 'ジ',
  ス: 'ズ',
  セ: 'ゼ',
  ソ: 'ゾ',
  タ: 'ダ',
  チ: 'ヂ',
  ツ: 'ヅ',
  テ: 'デ',
  ト: 'ド',
  ハ: 'バ',
  ヒ: 'ビ',
  フ: 'ブ',
  ヘ: 'ベ',
  ホ: 'ボ',
  ウ: 'ヴ',
}

const HANDAKUTEN_MAP: Record<string, string> = {
  ハ: 'パ',
  ヒ: 'ピ',
  フ: 'プ',
  ヘ: 'ペ',
  ホ: 'ポ',
}

/**
 * 半角カタカナを全角カタカナに変換
 *
 * @param value - 変換対象の文字列
 * @returns 全角カタカナに変換された文字列
 *
 * @example
 * ```ts
 * toZenkakuKana('ｶﾀｶﾅ') // 'カタカナ'
 * toZenkakuKana('ｶﾞｷﾞｸﾞ') // 'ガギグ'
 * ```
 */
export function toZenkakuKana(value: string): string {
  let result = ''
  for (let i = 0; i < value.length; i++) {
    const char = value[i]!
    const nextChar = value[i + 1]

    // 半角カタカナを全角に変換
    const zenkaku = HANKAKU_KANA_MAP[char]
    if (zenkaku) {
      // 次の文字が濁点・半濁点かチェック
      if (nextChar === 'ﾞ' && DAKUTEN_MAP[zenkaku]) {
        result += DAKUTEN_MAP[zenkaku]
        i++ // 濁点をスキップ
      } else if (nextChar === 'ﾟ' && HANDAKUTEN_MAP[zenkaku]) {
        result += HANDAKUTEN_MAP[zenkaku]
        i++ // 半濁点をスキップ
      } else {
        result += zenkaku
      }
    } else {
      result += char
    }
  }
  return result
}

/**
 * ひらがなをカタカナに変換
 *
 * @param value - 変換対象の文字列
 * @returns カタカナに変換された文字列
 *
 * @example
 * ```ts
 * toKatakana('ひらがな') // 'ヒラガナ'
 * ```
 */
export function toKatakana(value: string): string {
  return value.replace(/[\u3041-\u3096]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) + 0x60)
  })
}

/**
 * カタカナをひらがなに変換
 *
 * @param value - 変換対象の文字列
 * @returns ひらがなに変換された文字列
 *
 * @example
 * ```ts
 * toHiragana('カタカナ') // 'かたかな'
 * ```
 */
export function toHiragana(value: string): string {
  return value.replace(/[\u30A1-\u30F6]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0x60)
  })
}
