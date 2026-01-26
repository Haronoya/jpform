import { describe, expect, it } from 'vitest'
import {
  phoneSchema,
  optionalPhoneSchema,
  mobilePhoneSchema,
  landlinePhoneSchema,
  freeDialPhoneSchema,
} from './phone.js'

describe('phoneSchema', () => {
  const schema = phoneSchema()

  it('validates landline phone numbers', () => {
    expect(schema.parse('03-1234-5678')).toBe('03-1234-5678')
    expect(schema.parse('0312345678')).toBe('0312345678')
  })

  it('validates mobile phone numbers', () => {
    expect(schema.parse('090-1234-5678')).toBe('090-1234-5678')
    expect(schema.parse('080-1234-5678')).toBe('080-1234-5678')
    expect(schema.parse('070-1234-5678')).toBe('070-1234-5678')
  })

  it('validates IP phone numbers', () => {
    expect(schema.parse('050-1234-5678')).toBe('050-1234-5678')
  })

  it('validates free dial numbers', () => {
    expect(schema.parse('0120-123-456')).toBe('0120-123-456')
    expect(schema.parse('0800-123-4567')).toBe('0800-123-4567')
  })

  it('normalizes zenkaku digits', () => {
    expect(schema.parse('０３−１２３４−５６７８')).toBe('03-1234-5678')
  })

  it('rejects invalid phone numbers', () => {
    expect(() => schema.parse('1234567890')).toThrow()
    expect(() => schema.parse('abcdefghij')).toThrow()
    expect(() => schema.parse('12345')).toThrow()
  })

  it('rejects empty strings', () => {
    expect(() => schema.parse('')).toThrow()
  })

  it('uses custom error messages', () => {
    const customSchema = phoneSchema({
      required: 'Please enter phone number',
      invalid: 'Invalid phone number format',
    })

    try {
      customSchema.parse('')
    } catch (e: any) {
      expect(e.errors[0].message).toBe('Please enter phone number')
    }

    try {
      customSchema.parse('1234567890')
    } catch (e: any) {
      expect(e.errors[0].message).toBe('Invalid phone number format')
    }
  })
})

describe('optionalPhoneSchema', () => {
  const schema = optionalPhoneSchema()

  it('returns undefined for empty values', () => {
    expect(schema.parse('')).toBe(undefined)
    expect(schema.parse(undefined)).toBe(undefined)
    expect(schema.parse('   ')).toBe(undefined)
  })

  it('validates and normalizes non-empty values', () => {
    expect(schema.parse('03-1234-5678')).toBe('03-1234-5678')
    expect(schema.parse('０９０−１２３４−５６７８')).toBe('090-1234-5678')
  })

  it('rejects invalid non-empty values', () => {
    expect(() => schema.parse('1234567890')).toThrow()
    expect(() => schema.parse('invalid')).toThrow()
  })
})

describe('mobilePhoneSchema', () => {
  const schema = mobilePhoneSchema()

  it('validates mobile phone numbers', () => {
    expect(schema.parse('090-1234-5678')).toBe('090-1234-5678')
    expect(schema.parse('080-1234-5678')).toBe('080-1234-5678')
    expect(schema.parse('070-1234-5678')).toBe('070-1234-5678')
  })

  it('rejects landline phone numbers', () => {
    expect(() => schema.parse('03-1234-5678')).toThrow()
  })

  it('rejects IP phone numbers', () => {
    expect(() => schema.parse('050-1234-5678')).toThrow()
  })
})

describe('landlinePhoneSchema', () => {
  const schema = landlinePhoneSchema()

  it('validates landline phone numbers', () => {
    expect(schema.parse('03-1234-5678')).toBe('03-1234-5678')
    expect(schema.parse('06-1234-5678')).toBe('06-1234-5678')
  })

  it('rejects mobile phone numbers', () => {
    expect(() => schema.parse('090-1234-5678')).toThrow()
  })
})

describe('freeDialPhoneSchema', () => {
  const schema = freeDialPhoneSchema()

  it('validates free dial numbers', () => {
    expect(schema.parse('0120-123-456')).toBe('0120-123-456')
    expect(schema.parse('0800-123-4567')).toBe('0800-123-4567')
  })

  it('rejects landline phone numbers', () => {
    expect(() => schema.parse('03-1234-5678')).toThrow()
  })

  it('rejects mobile phone numbers', () => {
    expect(() => schema.parse('090-1234-5678')).toThrow()
  })
})
