import { describe, expect, it } from 'vitest'
import { formatPostalCode, normalizePostalCode } from './postal.js'

describe('normalizePostalCode', () => {
  it('ハイフン付きの郵便番号を正規化する', () => {
    expect(normalizePostalCode('123-4567')).toBe('1234567')
  })

  it('全角数字を半角に変換する', () => {
    expect(normalizePostalCode('１２３４５６７')).toBe('1234567')
  })

  it('全角ハイフンを除去する', () => {
    expect(normalizePostalCode('１２３－４５６７')).toBe('1234567')
  })

  it('郵便マークを除去する', () => {
    expect(normalizePostalCode('〒123-4567')).toBe('1234567')
  })

  it('スペースを除去する', () => {
    expect(normalizePostalCode('123 4567')).toBe('1234567')
    expect(normalizePostalCode('123　4567')).toBe('1234567') // 全角スペース
  })

  it('数字以外の文字を除去する', () => {
    expect(normalizePostalCode('abc1234567def')).toBe('1234567')
  })

  it('既に正規化されている場合はそのまま', () => {
    expect(normalizePostalCode('1234567')).toBe('1234567')
  })
})

describe('formatPostalCode', () => {
  it('7桁の郵便番号をハイフン付きにフォーマットする', () => {
    expect(formatPostalCode('1234567')).toBe('123-4567')
  })

  it('既にフォーマットされている場合は正規化してフォーマット', () => {
    expect(formatPostalCode('123-4567')).toBe('123-4567')
  })

  it('全角数字をフォーマットする', () => {
    expect(formatPostalCode('１２３４５６７')).toBe('123-4567')
  })

  it('7桁でない場合は元の値を返す', () => {
    expect(formatPostalCode('12345')).toBe('12345')
    expect(formatPostalCode('123456789')).toBe('123456789')
  })
})
