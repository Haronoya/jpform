import { z } from 'zod'
import {
  normalizePhone,
  isValidPhone,
  isMobilePhone,
  isLandlinePhone,
  isFreeDialPhone,
} from '@haro/jpform-core'

/**
 * 電話番号スキーマのオプション
 */
export type PhoneSchemaOptions = {
  /** 必須項目のエラーメッセージ */
  required?: string
  /** 無効な電話番号のエラーメッセージ */
  invalid?: string
  /** 入力値を正規化するか（デフォルト: true） */
  normalize?: boolean
}

const defaultMessages = {
  required: '電話番号を入力してください',
  invalid: '有効な電話番号を入力してください',
  invalidMobile: '有効な携帯電話番号を入力してください',
  invalidLandline: '有効な固定電話番号を入力してください',
  invalidFreeDial: '有効なフリーダイヤル番号を入力してください',
}

/**
 * 電話番号スキーマを作成
 *
 * @param options - オプション
 * @returns Zodスキーマ
 *
 * @example
 * ```ts
 * const schema = phoneSchema()
 * schema.parse('03-1234-5678') // '03-1234-5678'
 * schema.parse('０３−１２３４−５６７８') // '03-1234-5678'
 * schema.parse('invalid') // throws ZodError
 * ```
 */
export function phoneSchema(options: PhoneSchemaOptions = {}) {
  const {
    required = defaultMessages.required,
    invalid = defaultMessages.invalid,
    normalize = true,
  } = options

  return z
    .string({ required_error: required })
    .min(1, { message: required })
    .transform((val) => (normalize ? normalizePhone(val) : val))
    .refine((val) => isValidPhone(val), { message: invalid })
}

/**
 * オプショナルな電話番号スキーマを作成
 *
 * @param options - オプション
 * @returns Zodスキーマ（空文字列は undefined として扱う）
 */
export function optionalPhoneSchema(options: PhoneSchemaOptions = {}) {
  const {
    invalid = defaultMessages.invalid,
    normalize = true,
  } = options

  return z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === '') return undefined
      return normalize ? normalizePhone(val) : val
    })
    .refine((val) => val === undefined || isValidPhone(val), { message: invalid })
}

/**
 * 携帯電話番号スキーマを作成
 *
 * @param options - オプション
 * @returns Zodスキーマ
 */
export function mobilePhoneSchema(options: PhoneSchemaOptions = {}) {
  const {
    required = defaultMessages.required,
    invalid = defaultMessages.invalidMobile,
    normalize = true,
  } = options

  return z
    .string({ required_error: required })
    .min(1, { message: required })
    .transform((val) => (normalize ? normalizePhone(val) : val))
    .refine((val) => isMobilePhone(val), { message: invalid })
}

/**
 * 固定電話番号スキーマを作成
 *
 * @param options - オプション
 * @returns Zodスキーマ
 */
export function landlinePhoneSchema(options: PhoneSchemaOptions = {}) {
  const {
    required = defaultMessages.required,
    invalid = defaultMessages.invalidLandline,
    normalize = true,
  } = options

  return z
    .string({ required_error: required })
    .min(1, { message: required })
    .transform((val) => (normalize ? normalizePhone(val) : val))
    .refine((val) => isLandlinePhone(val), { message: invalid })
}

/**
 * フリーダイヤル番号スキーマを作成
 *
 * @param options - オプション
 * @returns Zodスキーマ
 */
export function freeDialPhoneSchema(options: PhoneSchemaOptions = {}) {
  const {
    required = defaultMessages.required,
    invalid = defaultMessages.invalidFreeDial,
    normalize = true,
  } = options

  return z
    .string({ required_error: required })
    .min(1, { message: required })
    .transform((val) => (normalize ? normalizePhone(val) : val))
    .refine((val) => isFreeDialPhone(val), { message: invalid })
}
