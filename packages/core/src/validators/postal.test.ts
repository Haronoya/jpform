import { describe, expect, it } from 'vitest'
import { isValidPostalCode } from './postal.js'

describe('isValidPostalCode', () => {
  it('有効な郵便番号を検証する', () => {
    expect(isValidPostalCode('1234567')).toBe(true)
    expect(isValidPostalCode('123-4567')).toBe(true)
    expect(isValidPostalCode('〒123-4567')).toBe(true)
  })

  it('全角数字の郵便番号を検証する', () => {
    expect(isValidPostalCode('１２３４５６７')).toBe(true)
    expect(isValidPostalCode('１２３－４５６７')).toBe(true)
  })

  it('無効な郵便番号を検証する', () => {
    expect(isValidPostalCode('12345')).toBe(false) // 5桁
    expect(isValidPostalCode('12345678')).toBe(false) // 8桁
    expect(isValidPostalCode('abcdefg')).toBe(false) // 英字
    expect(isValidPostalCode('')).toBe(false) // 空文字
  })
})
