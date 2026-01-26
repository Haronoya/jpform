import { z } from 'zod'
import { normalizePostalCode, isValidPostalCode } from '@haro/jpform-core'

/**
 * 郵便番号スキーマのオプション
 */
export type PostalCodeSchemaOptions = {
  /** 必須項目のエラーメッセージ */
  required?: string
  /** 無効な郵便番号のエラーメッセージ */
  invalid?: string
  /** 入力値を正規化するか（デフォルト: true） */
  normalize?: boolean
}

const defaultMessages = {
  required: '郵便番号を入力してください',
  invalid: '有効な郵便番号を入力してください',
}

/**
 * 郵便番号スキーマを作成
 *
 * @param options - オプション
 * @returns Zodスキーマ
 *
 * @example
 * ```ts
 * const schema = postalCodeSchema()
 * schema.parse('100-0001') // '1000001'
 * schema.parse('１００−０００１') // '1000001'
 * schema.parse('invalid') // throws ZodError
 * ```
 */
export function postalCodeSchema(options: PostalCodeSchemaOptions = {}) {
  const {
    required = defaultMessages.required,
    invalid = defaultMessages.invalid,
    normalize = true,
  } = options

  return z
    .string({ required_error: required })
    .min(1, { message: required })
    .transform((val) => (normalize ? normalizePostalCode(val) : val))
    .refine((val) => isValidPostalCode(val), { message: invalid })
}

/**
 * オプショナルな郵便番号スキーマを作成
 *
 * @param options - オプション
 * @returns Zodスキーマ（空文字列は undefined として扱う）
 *
 * @example
 * ```ts
 * const schema = optionalPostalCodeSchema()
 * schema.parse('100-0001') // '1000001'
 * schema.parse('') // undefined
 * schema.parse(undefined) // undefined
 * ```
 */
export function optionalPostalCodeSchema(options: PostalCodeSchemaOptions = {}) {
  const {
    invalid = defaultMessages.invalid,
    normalize = true,
  } = options

  return z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === '') return undefined
      return normalize ? normalizePostalCode(val) : val
    })
    .refine((val) => val === undefined || isValidPostalCode(val), { message: invalid })
}
