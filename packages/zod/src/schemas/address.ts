import { z } from 'zod'
import { PREFECTURES, isPrefecture } from '@haro/jpform-core'
import { postalCodeSchema, optionalPostalCodeSchema } from './postal.js'

/**
 * 都道府県コードの配列
 */
const PREFECTURE_CODES = [
  '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
  '11', '12', '13', '14', '15', '16', '17', '18', '19', '20',
  '21', '22', '23', '24', '25', '26', '27', '28', '29', '30',
  '31', '32', '33', '34', '35', '36', '37', '38', '39', '40',
  '41', '42', '43', '44', '45', '46', '47',
] as const

/**
 * 住所スキーマのオプション
 */
export type AddressSchemaOptions = {
  /** 郵便番号を必須にするか（デフォルト: true） */
  postalCodeRequired?: boolean
  /** 都道府県を必須にするか（デフォルト: true） */
  prefectureRequired?: boolean
  /** 市区町村を必須にするか（デフォルト: true） */
  cityRequired?: boolean
  /** 町域を必須にするか（デフォルト: false） */
  townRequired?: boolean
  /** カナ情報を含めるか（デフォルト: false） */
  includeKana?: boolean
  /** 都道府県コードを含めるか（デフォルト: false） */
  includePrefectureCode?: boolean
  /** エラーメッセージ */
  messages?: {
    postalCode?: string
    prefecture?: string
    city?: string
    town?: string
  }
}

const defaultMessages = {
  postalCode: '郵便番号を入力してください',
  prefecture: '都道府県を選択してください',
  city: '市区町村を入力してください',
  town: '町域を入力してください',
  invalidPrefecture: '有効な都道府県を選択してください',
  invalidPrefectureCode: '有効な都道府県コードを入力してください',
}

/**
 * 都道府県スキーマ
 */
export const prefectureSchema = z.enum(PREFECTURES, {
  errorMap: () => ({ message: defaultMessages.invalidPrefecture }),
})

/**
 * 都道府県コードスキーマ
 */
export const prefectureCodeSchema = z.enum(PREFECTURE_CODES, {
  errorMap: () => ({ message: defaultMessages.invalidPrefectureCode }),
})

/**
 * 住所スキーマを作成
 *
 * @param options - オプション
 * @returns Zodスキーマ
 *
 * @example
 * ```ts
 * const schema = addressSchema()
 * schema.parse({
 *   postalCode: '100-0001',
 *   prefecture: '東京都',
 *   city: '千代田区',
 *   town: '千代田',
 * })
 * ```
 */
export function addressSchema(options: AddressSchemaOptions = {}) {
  const {
    postalCodeRequired = true,
    prefectureRequired = true,
    cityRequired = true,
    townRequired = false,
    includeKana = false,
    includePrefectureCode = false,
    messages = {},
  } = options

  const baseSchema: Record<string, z.ZodTypeAny> = {}

  // 郵便番号
  if (postalCodeRequired) {
    baseSchema.postalCode = postalCodeSchema({
      required: messages.postalCode ?? defaultMessages.postalCode,
    })
  } else {
    baseSchema.postalCode = optionalPostalCodeSchema()
  }

  // 都道府県
  if (prefectureRequired) {
    baseSchema.prefecture = z
      .string({ required_error: messages.prefecture ?? defaultMessages.prefecture })
      .min(1, { message: messages.prefecture ?? defaultMessages.prefecture })
      .refine((val) => isPrefecture(val), {
        message: defaultMessages.invalidPrefecture,
      })
  } else {
    baseSchema.prefecture = z
      .string()
      .optional()
      .refine((val) => !val || isPrefecture(val), {
        message: defaultMessages.invalidPrefecture,
      })
  }

  // 都道府県コード
  if (includePrefectureCode) {
    baseSchema.prefectureCode = prefectureCodeSchema.optional()
  }

  // 市区町村
  if (cityRequired) {
    baseSchema.city = z
      .string({ required_error: messages.city ?? defaultMessages.city })
      .min(1, { message: messages.city ?? defaultMessages.city })
  } else {
    baseSchema.city = z.string().optional()
  }

  // 町域
  if (townRequired) {
    baseSchema.town = z
      .string({ required_error: messages.town ?? defaultMessages.town })
      .min(1, { message: messages.town ?? defaultMessages.town })
  } else {
    baseSchema.town = z.string().optional()
  }

  // カナ情報
  if (includeKana) {
    baseSchema.prefectureKana = z.string().optional()
    baseSchema.cityKana = z.string().optional()
    baseSchema.townKana = z.string().optional()
  }

  return z.object(baseSchema)
}

/**
 * JPAddress互換のスキーマを作成
 *
 * @returns JPAddress型互換のZodスキーマ
 */
export function jpAddressSchema() {
  return z.object({
    postalCode: postalCodeSchema(),
    prefecture: prefectureSchema,
    prefectureCode: prefectureCodeSchema,
    city: z.string().min(1, { message: defaultMessages.city }),
    town: z.string(),
    prefectureKana: z.string().optional(),
    cityKana: z.string().optional(),
    townKana: z.string().optional(),
  })
}
