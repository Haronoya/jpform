import { describe, expect, it } from 'vitest'
import { postalCodeSchema, optionalPostalCodeSchema } from './postal.js'

describe('postalCodeSchema', () => {
  const schema = postalCodeSchema()

  it('validates correct postal codes', () => {
    expect(schema.parse('1000001')).toBe('1000001')
    expect(schema.parse('100-0001')).toBe('1000001')
    expect(schema.parse('１００−０００１')).toBe('1000001')
  })

  it('normalizes zenkaku digits', () => {
    expect(schema.parse('１２３４５６７')).toBe('1234567')
  })

  it('rejects invalid postal codes', () => {
    expect(() => schema.parse('12345')).toThrow()
    expect(() => schema.parse('abcdefg')).toThrow()
    expect(() => schema.parse('12345678')).toThrow()
  })

  it('rejects empty strings', () => {
    expect(() => schema.parse('')).toThrow()
  })

  it('uses custom error messages', () => {
    const customSchema = postalCodeSchema({
      required: 'Please enter postal code',
      invalid: 'Invalid postal code format',
    })

    try {
      customSchema.parse('')
    } catch (e: any) {
      expect(e.errors[0].message).toBe('Please enter postal code')
    }

    try {
      customSchema.parse('12345')
    } catch (e: any) {
      expect(e.errors[0].message).toBe('Invalid postal code format')
    }
  })

  it('can disable normalization', () => {
    const noNormalizeSchema = postalCodeSchema({ normalize: false })
    expect(noNormalizeSchema.parse('100-0001')).toBe('100-0001')
  })
})

describe('optionalPostalCodeSchema', () => {
  const schema = optionalPostalCodeSchema()

  it('returns undefined for empty values', () => {
    expect(schema.parse('')).toBe(undefined)
    expect(schema.parse(undefined)).toBe(undefined)
    expect(schema.parse('   ')).toBe(undefined)
  })

  it('validates and normalizes non-empty values', () => {
    expect(schema.parse('100-0001')).toBe('1000001')
    expect(schema.parse('１２３４５６７')).toBe('1234567')
  })

  it('rejects invalid non-empty values', () => {
    expect(() => schema.parse('12345')).toThrow()
    expect(() => schema.parse('invalid')).toThrow()
  })
})
