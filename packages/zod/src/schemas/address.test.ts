import { describe, expect, it } from 'vitest'
import {
  prefectureSchema,
  prefectureCodeSchema,
  addressSchema,
  jpAddressSchema,
} from './address.js'

describe('prefectureSchema', () => {
  it('validates all prefectures', () => {
    expect(prefectureSchema.parse('東京都')).toBe('東京都')
    expect(prefectureSchema.parse('大阪府')).toBe('大阪府')
    expect(prefectureSchema.parse('北海道')).toBe('北海道')
    expect(prefectureSchema.parse('沖縄県')).toBe('沖縄県')
  })

  it('rejects invalid prefectures', () => {
    expect(() => prefectureSchema.parse('東京')).toThrow()
    expect(() => prefectureSchema.parse('invalid')).toThrow()
  })
})

describe('prefectureCodeSchema', () => {
  it('validates all prefecture codes', () => {
    expect(prefectureCodeSchema.parse('01')).toBe('01')
    expect(prefectureCodeSchema.parse('13')).toBe('13')
    expect(prefectureCodeSchema.parse('47')).toBe('47')
  })

  it('rejects invalid prefecture codes', () => {
    expect(() => prefectureCodeSchema.parse('00')).toThrow()
    expect(() => prefectureCodeSchema.parse('48')).toThrow()
    expect(() => prefectureCodeSchema.parse('1')).toThrow()
    expect(() => prefectureCodeSchema.parse('invalid')).toThrow()
  })
})

describe('addressSchema', () => {
  it('validates complete address with defaults', () => {
    const schema = addressSchema()
    const result = schema.parse({
      postalCode: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      town: '千代田',
    })

    expect(result.postalCode).toBe('1000001')
    expect(result.prefecture).toBe('東京都')
    expect(result.city).toBe('千代田区')
    expect(result.town).toBe('千代田')
  })

  it('allows optional town by default', () => {
    const schema = addressSchema()
    const result = schema.parse({
      postalCode: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
    })

    expect(result.town).toBeUndefined()
  })

  it('requires postalCode by default', () => {
    const schema = addressSchema()
    expect(() =>
      schema.parse({
        prefecture: '東京都',
        city: '千代田区',
      })
    ).toThrow()
  })

  it('allows optional postalCode when configured', () => {
    const schema = addressSchema({ postalCodeRequired: false })
    const result = schema.parse({
      prefecture: '東京都',
      city: '千代田区',
    })

    expect(result.postalCode).toBeUndefined()
  })

  it('requires town when configured', () => {
    const schema = addressSchema({ townRequired: true })
    expect(() =>
      schema.parse({
        postalCode: '100-0001',
        prefecture: '東京都',
        city: '千代田区',
      })
    ).toThrow()
  })

  it('includes kana fields when configured', () => {
    const schema = addressSchema({ includeKana: true })
    const result = schema.parse({
      postalCode: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      prefectureKana: 'トウキョウト',
      cityKana: 'チヨダク',
      townKana: 'チヨダ',
    })

    expect(result.prefectureKana).toBe('トウキョウト')
    expect(result.cityKana).toBe('チヨダク')
    expect(result.townKana).toBe('チヨダ')
  })

  it('includes prefecture code when configured', () => {
    const schema = addressSchema({ includePrefectureCode: true })
    const result = schema.parse({
      postalCode: '100-0001',
      prefecture: '東京都',
      city: '千代田区',
      prefectureCode: '13',
    })

    expect(result.prefectureCode).toBe('13')
  })

  it('uses custom error messages', () => {
    const schema = addressSchema({
      messages: {
        postalCode: 'カスタム郵便番号エラー',
        prefecture: 'カスタム都道府県エラー',
      },
    })

    try {
      schema.parse({
        prefecture: '東京都',
        city: '千代田区',
      })
    } catch (e: any) {
      const postalError = e.errors.find((err: any) => err.path[0] === 'postalCode')
      expect(postalError.message).toBe('カスタム郵便番号エラー')
    }
  })
})

describe('jpAddressSchema', () => {
  it('validates JPAddress compatible structure', () => {
    const schema = jpAddressSchema()
    const result = schema.parse({
      postalCode: '100-0001',
      prefecture: '東京都',
      prefectureCode: '13',
      city: '千代田区',
      town: '千代田',
      prefectureKana: 'トウキョウト',
      cityKana: 'チヨダク',
      townKana: 'チヨダ',
    })

    expect(result.postalCode).toBe('1000001')
    expect(result.prefecture).toBe('東京都')
    expect(result.prefectureCode).toBe('13')
    expect(result.city).toBe('千代田区')
    expect(result.town).toBe('千代田')
    expect(result.prefectureKana).toBe('トウキョウト')
  })

  it('allows optional kana fields', () => {
    const schema = jpAddressSchema()
    const result = schema.parse({
      postalCode: '100-0001',
      prefecture: '東京都',
      prefectureCode: '13',
      city: '千代田区',
      town: '',
    })

    expect(result.prefectureKana).toBeUndefined()
    expect(result.cityKana).toBeUndefined()
    expect(result.townKana).toBeUndefined()
  })

  it('requires all non-optional fields', () => {
    const schema = jpAddressSchema()

    expect(() =>
      schema.parse({
        postalCode: '100-0001',
        prefecture: '東京都',
        prefectureCode: '13',
        // missing city and town
      })
    ).toThrow()
  })
})
