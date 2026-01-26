/**
 * 半角英数字を全角に変換するマッピング
 */
const HANKAKU_TO_ZENKAKU_MAP: Record<string, string> = {
  // 数字
  '0': '０',
  '1': '１',
  '2': '２',
  '3': '３',
  '4': '４',
  '5': '５',
  '6': '６',
  '7': '７',
  '8': '８',
  '9': '９',
  // 大文字アルファベット
  A: 'Ａ',
  B: 'Ｂ',
  C: 'Ｃ',
  D: 'Ｄ',
  E: 'Ｅ',
  F: 'Ｆ',
  G: 'Ｇ',
  H: 'Ｈ',
  I: 'Ｉ',
  J: 'Ｊ',
  K: 'Ｋ',
  L: 'Ｌ',
  M: 'Ｍ',
  N: 'Ｎ',
  O: 'Ｏ',
  P: 'Ｐ',
  Q: 'Ｑ',
  R: 'Ｒ',
  S: 'Ｓ',
  T: 'Ｔ',
  U: 'Ｕ',
  V: 'Ｖ',
  W: 'Ｗ',
  X: 'Ｘ',
  Y: 'Ｙ',
  Z: 'Ｚ',
  // 小文字アルファベット
  a: 'ａ',
  b: 'ｂ',
  c: 'ｃ',
  d: 'ｄ',
  e: 'ｅ',
  f: 'ｆ',
  g: 'ｇ',
  h: 'ｈ',
  i: 'ｉ',
  j: 'ｊ',
  k: 'ｋ',
  l: 'ｌ',
  m: 'ｍ',
  n: 'ｎ',
  o: 'ｏ',
  p: 'ｐ',
  q: 'ｑ',
  r: 'ｒ',
  s: 'ｓ',
  t: 'ｔ',
  u: 'ｕ',
  v: 'ｖ',
  w: 'ｗ',
  x: 'ｘ',
  y: 'ｙ',
  z: 'ｚ',
  // 記号
  ' ': '　',
  '!': '！',
  '"': '"',
  '#': '＃',
  $: '＄',
  '%': '％',
  '&': '＆',
  "'": '\u2019',
  '(': '（',
  ')': '）',
  '*': '＊',
  '+': '＋',
  ',': '，',
  '-': '－',
  '.': '．',
  '/': '／',
  ':': '：',
  ';': '；',
  '<': '＜',
  '=': '＝',
  '>': '＞',
  '?': '？',
  '@': '＠',
  '[': '［',
  '\\': '＼',
  ']': '］',
  '^': '＾',
  _: '＿',
  '`': '\u2018',
  '{': '｛',
  '|': '｜',
  '}': '｝',
  '~': '～',
}

/**
 * 半角文字を全角に変換
 *
 * @param value - 変換対象の文字列
 * @returns 全角に変換された文字列
 *
 * @example
 * ```ts
 * toZenkaku('123ABC') // '１２３ＡＢＣ'
 * toZenkaku('東京都') // '東京都' (変換対象外はそのまま)
 * ```
 */
export function toZenkaku(value: string): string {
  return value
    .split('')
    .map((char) => HANKAKU_TO_ZENKAKU_MAP[char] ?? char)
    .join('')
}

/**
 * 半角数字のみを全角に変換
 */
export function toZenkakuNumber(value: string): string {
  return value.replace(/[0-9]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) + 0xfee0)
  })
}

/**
 * 半角英字のみを全角に変換
 */
export function toZenkakuAlpha(value: string): string {
  return value.replace(/[A-Za-z]/g, (char) => {
    return String.fromCharCode(char.charCodeAt(0) + 0xfee0)
  })
}
