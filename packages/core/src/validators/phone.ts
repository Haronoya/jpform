import { toHankaku } from '../converters/hankaku.js'

/**
 * 電話番号を正規化（数字とハイフンのみに変換）
 *
 * @param value - 電話番号文字列
 * @returns 正規化された電話番号
 */
export function normalizePhone(value: string): string {
  // 全角を半角に変換
  let normalized = toHankaku(value)

  // 数字とハイフン以外を除去
  normalized = normalized.replace(/[^0-9-]/g, '')

  return normalized
}

/**
 * 電話番号から数字のみを抽出
 *
 * @param value - 電話番号文字列
 * @returns 数字のみの文字列
 */
export function extractPhoneDigits(value: string): string {
  return normalizePhone(value).replace(/-/g, '')
}

/**
 * 有効な日本の電話番号かどうかを検証
 *
 * 対応形式:
 * - 固定電話: 0X-XXXX-XXXX, 0XX-XXX-XXXX, 0XXX-XX-XXXX など
 * - 携帯電話: 070/080/090-XXXX-XXXX
 * - IP電話: 050-XXXX-XXXX
 * - フリーダイヤル: 0120-XXX-XXX, 0800-XXX-XXXX
 *
 * @param value - 電話番号文字列
 * @returns 有効な電話番号の場合は true
 *
 * @example
 * ```ts
 * isValidPhone('03-1234-5678') // true
 * isValidPhone('090-1234-5678') // true
 * isValidPhone('0120-123-456') // true
 * isValidPhone('1234567890') // false (0から始まらない)
 * ```
 */
export function isValidPhone(value: string): boolean {
  const digits = extractPhoneDigits(value)

  // 0から始まる10〜11桁の数字
  if (!/^0[0-9]{9,10}$/.test(digits)) {
    return false
  }

  // 携帯電話 (070/080/090)
  if (/^0[789]0[0-9]{8}$/.test(digits)) {
    return true
  }

  // IP電話 (050)
  if (/^050[0-9]{8}$/.test(digits)) {
    return true
  }

  // フリーダイヤル (0120)
  if (/^0120[0-9]{6}$/.test(digits)) {
    return true
  }

  // フリーダイヤル (0800)
  if (/^0800[0-9]{7}$/.test(digits)) {
    return true
  }

  // 固定電話 (10桁)
  if (/^0[1-9][0-9]{8}$/.test(digits)) {
    return true
  }

  return false
}

/**
 * 携帯電話番号かどうかを検証
 *
 * @param value - 電話番号文字列
 * @returns 携帯電話番号の場合は true
 */
export function isMobilePhone(value: string): boolean {
  const digits = extractPhoneDigits(value)
  return /^0[789]0[0-9]{8}$/.test(digits)
}

/**
 * 固定電話番号かどうかを検証
 *
 * @param value - 電話番号文字列
 * @returns 固定電話番号の場合は true
 */
export function isLandlinePhone(value: string): boolean {
  const digits = extractPhoneDigits(value)
  // 0から始まり、070/080/090/050/0120/0800 以外の10桁
  if (!/^0[1-9][0-9]{8}$/.test(digits)) {
    return false
  }
  // 携帯・IP電話を除外
  if (/^0[5789]0/.test(digits)) {
    return false
  }
  // フリーダイヤルを除外
  if (/^0120/.test(digits)) {
    return false
  }
  return true
}

/**
 * フリーダイヤルかどうかを検証
 *
 * @param value - 電話番号文字列
 * @returns フリーダイヤルの場合は true
 */
export function isFreeDialPhone(value: string): boolean {
  const digits = extractPhoneDigits(value)
  return /^0120[0-9]{6}$/.test(digits) || /^0800[0-9]{7}$/.test(digits)
}
