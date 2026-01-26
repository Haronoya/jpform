/**
 * 全角英数字を半角に変換するマッピング
 */
const ZENKAKU_TO_HANKAKU_MAP: Record<string, string> = {
  // 数字
  '０': '0',
  '１': '1',
  '２': '2',
  '３': '3',
  '４': '4',
  '５': '5',
  '６': '6',
  '７': '7',
  '８': '8',
  '９': '9',
  // 大文字アルファベット
  Ａ: 'A',
  Ｂ: 'B',
  Ｃ: 'C',
  Ｄ: 'D',
  Ｅ: 'E',
  Ｆ: 'F',
  Ｇ: 'G',
  Ｈ: 'H',
  Ｉ: 'I',
  Ｊ: 'J',
  Ｋ: 'K',
  Ｌ: 'L',
  Ｍ: 'M',
  Ｎ: 'N',
  Ｏ: 'O',
  Ｐ: 'P',
  Ｑ: 'Q',
  Ｒ: 'R',
  Ｓ: 'S',
  Ｔ: 'T',
  Ｕ: 'U',
  Ｖ: 'V',
  Ｗ: 'W',
  Ｘ: 'X',
  Ｙ: 'Y',
  Ｚ: 'Z',
  // 小文字アルファベット
  ａ: 'a',
  ｂ: 'b',
  ｃ: 'c',
  ｄ: 'd',
  ｅ: 'e',
  ｆ: 'f',
  ｇ: 'g',
  ｈ: 'h',
  ｉ: 'i',
  ｊ: 'j',
  ｋ: 'k',
  ｌ: 'l',
  ｍ: 'm',
  ｎ: 'n',
  ｏ: 'o',
  ｐ: 'p',
  ｑ: 'q',
  ｒ: 'r',
  ｓ: 's',
  ｔ: 't',
  ｕ: 'u',
  ｖ: 'v',
  ｗ: 'w',
  ｘ: 'x',
  ｙ: 'y',
  ｚ: 'z',
  // 記号
  '　': ' ',
  '！': '!',
  '"': '"',
  '＃': '#',
  '＄': '$',
  '％': '%',
  '＆': '&',
  '\u2019': "'",
  '（': '(',
  '）': ')',
  '＊': '*',
  '＋': '+',
  '，': ',',
  '－': '-',
  '\u2212': '-',
  '．': '.',
  '／': '/',
  '：': ':',
  '；': ';',
  '＜': '<',
  '＝': '=',
  '＞': '>',
  '？': '?',
  '＠': '@',
  '［': '[',
  '＼': '\\',
  '］': ']',
  '＾': '^',
  '＿': '_',
  '\u2018': '`',
  '｛': '{',
  '｜': '|',
  '｝': '}',
  '～': '~',
}

/**
 * 全角文字を半角に変換
 *
 * @param value - 変換対象の文字列
 * @returns 半角に変換された文字列
 *
 * @example
 * ```ts
 * toHankaku('１２３ＡＢＣ') // '123ABC'
 * toHankaku('東京都') // '東京都' (変換対象外はそのまま)
 * ```
 */
export function toHankaku(value: string): string {
  return value
    .split('')
    .map((char) => ZENKAKU_TO_HANKAKU_MAP[char] ?? char)
    .join('')
}

/**
 * 全角数字のみを半角に変換
 */
export function toHankakuNumber(value: string): string {
  return value.replace(/[０-９]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  })
}

/**
 * 全角英字のみを半角に変換
 */
export function toHankakuAlpha(value: string): string {
  return value.replace(/[Ａ-Ｚａ-ｚ]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) - 0xfee0)
  })
}
