import { normalizePostalCode } from '../converters/postal.js'

/**
 * 有効な郵便番号かどうかを検証
 *
 * @param value - 郵便番号文字列
 * @returns 有効な郵便番号の場合は true
 *
 * @example
 * ```ts
 * isValidPostalCode('123-4567') // true
 * isValidPostalCode('1234567') // true
 * isValidPostalCode('１２３４５６７') // true
 * isValidPostalCode('12345') // false
 * isValidPostalCode('abcdefg') // false
 * ```
 */
export function isValidPostalCode(value: string): boolean {
  const normalized = normalizePostalCode(value)
  return /^[0-9]{7}$/.test(normalized)
}
