import { describe, expect, it } from 'vitest'
import {
  extractPhoneDigits,
  isFreeDialPhone,
  isLandlinePhone,
  isMobilePhone,
  isValidPhone,
  normalizePhone,
} from './phone.js'

describe('normalizePhone', () => {
  it('全角数字を半角に変換する', () => {
    expect(normalizePhone('０３１２３４５６７８')).toBe('0312345678')
  })

  it('ハイフン以外の記号を除去する', () => {
    expect(normalizePhone('03(1234)5678')).toBe('0312345678')
    expect(normalizePhone('03-1234-5678')).toBe('03-1234-5678')
  })
})

describe('extractPhoneDigits', () => {
  it('数字のみを抽出する', () => {
    expect(extractPhoneDigits('03-1234-5678')).toBe('0312345678')
    expect(extractPhoneDigits('090-1234-5678')).toBe('09012345678')
  })
})

describe('isValidPhone', () => {
  it('携帯電話番号を検証する', () => {
    expect(isValidPhone('090-1234-5678')).toBe(true)
    expect(isValidPhone('080-1234-5678')).toBe(true)
    expect(isValidPhone('070-1234-5678')).toBe(true)
    expect(isValidPhone('09012345678')).toBe(true)
  })

  it('固定電話番号を検証する', () => {
    expect(isValidPhone('03-1234-5678')).toBe(true)
    expect(isValidPhone('06-1234-5678')).toBe(true)
    expect(isValidPhone('0312345678')).toBe(true)
  })

  it('IP電話番号を検証する', () => {
    expect(isValidPhone('050-1234-5678')).toBe(true)
    expect(isValidPhone('05012345678')).toBe(true)
  })

  it('フリーダイヤルを検証する', () => {
    expect(isValidPhone('0120-123-456')).toBe(true)
    expect(isValidPhone('0800-123-4567')).toBe(true)
  })

  it('無効な電話番号を検証する', () => {
    expect(isValidPhone('1234567890')).toBe(false) // 0から始まらない
    expect(isValidPhone('03-1234-567')).toBe(false) // 桁数不足
    expect(isValidPhone('abcdefghij')).toBe(false) // 英字
    expect(isValidPhone('')).toBe(false) // 空文字
  })
})

describe('isMobilePhone', () => {
  it('携帯電話番号を判定する', () => {
    expect(isMobilePhone('090-1234-5678')).toBe(true)
    expect(isMobilePhone('080-1234-5678')).toBe(true)
    expect(isMobilePhone('070-1234-5678')).toBe(true)
  })

  it('携帯電話以外はfalse', () => {
    expect(isMobilePhone('03-1234-5678')).toBe(false)
    expect(isMobilePhone('050-1234-5678')).toBe(false)
    expect(isMobilePhone('0120-123-456')).toBe(false)
  })
})

describe('isLandlinePhone', () => {
  it('固定電話番号を判定する', () => {
    expect(isLandlinePhone('03-1234-5678')).toBe(true)
    expect(isLandlinePhone('06-1234-5678')).toBe(true)
  })

  it('固定電話以外はfalse', () => {
    expect(isLandlinePhone('090-1234-5678')).toBe(false)
    expect(isLandlinePhone('050-1234-5678')).toBe(false)
    expect(isLandlinePhone('0120-123-456')).toBe(false)
  })
})

describe('isFreeDialPhone', () => {
  it('フリーダイヤルを判定する', () => {
    expect(isFreeDialPhone('0120-123-456')).toBe(true)
    expect(isFreeDialPhone('0800-123-4567')).toBe(true)
  })

  it('フリーダイヤル以外はfalse', () => {
    expect(isFreeDialPhone('03-1234-5678')).toBe(false)
    expect(isFreeDialPhone('090-1234-5678')).toBe(false)
  })
})
