import { toHankaku } from './hankaku.js'

/**
 * 郵便番号を正規化（7桁の半角数字に変換）
 *
 * @param value - 郵便番号文字列
 * @returns 正規化された郵便番号（7桁の半角数字）、正規化できない場合は元の文字列
 *
 * @example
 * ```ts
 * normalizePostalCode('123-4567') // '1234567'
 * normalizePostalCode('１２３－４５６７') // '1234567'
 * normalizePostalCode('〒123-4567') // '1234567'
 * ```
 */
export function normalizePostalCode(value: string): string {
  // 全角を半角に変換
  let normalized = toHankaku(value)

  // 郵便マーク、ハイフン、スペースを除去
  normalized = normalized.replace(/[〒\-－ー\s]/g, '')

  // 数字以外を除去
  normalized = normalized.replace(/[^0-9]/g, '')

  return normalized
}

/**
 * 郵便番号をフォーマット（ハイフン付き形式に変換）
 *
 * @param value - 郵便番号文字列
 * @returns フォーマットされた郵便番号（例: "123-4567"）
 *
 * @example
 * ```ts
 * formatPostalCode('1234567') // '123-4567'
 * formatPostalCode('123-4567') // '123-4567'
 * ```
 */
export function formatPostalCode(value: string): string {
  const normalized = normalizePostalCode(value)

  if (normalized.length === 7) {
    return `${normalized.slice(0, 3)}-${normalized.slice(3)}`
  }

  return value
}
