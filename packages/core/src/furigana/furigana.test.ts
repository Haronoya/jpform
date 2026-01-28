import { describe, expect, it } from 'vitest'
import {
  getLastNameFurigana,
  getFirstNameFurigana,
  getFullNameFurigana,
  addLastNameReading,
  addFirstNameReading,
} from './index.js'

describe('getLastNameFurigana', () => {
  it('returns katakana reading for known last names', () => {
    expect(getLastNameFurigana('山田')).toBe('ヤマダ')
    expect(getLastNameFurigana('佐藤')).toBe('サトウ')
    expect(getLastNameFurigana('鈴木')).toBe('スズキ')
    expect(getLastNameFurigana('高橋')).toBe('タカハシ')
  })

  it('returns hiragana reading when format is hiragana', () => {
    expect(getLastNameFurigana('山田', { format: 'hiragana' })).toBe('やまだ')
    expect(getLastNameFurigana('佐藤', { format: 'hiragana' })).toBe('さとう')
  })

  it('returns undefined for unknown last names', () => {
    expect(getLastNameFurigana('未登録')).toBeUndefined()
    expect(getLastNameFurigana('')).toBeUndefined()
  })

  it('handles variant kanji', () => {
    expect(getLastNameFurigana('斎藤')).toBe('サイトウ')
    expect(getLastNameFurigana('斉藤')).toBe('サイトウ')
    expect(getLastNameFurigana('齋藤')).toBe('サイトウ')
    expect(getLastNameFurigana('渡辺')).toBe('ワタナベ')
    expect(getLastNameFurigana('渡邊')).toBe('ワタナベ')
  })
})

describe('getFirstNameFurigana', () => {
  it('returns katakana reading for known first names', () => {
    expect(getFirstNameFurigana('太郎')).toBe('タロウ')
    expect(getFirstNameFurigana('花子')).toBe('ハナコ')
    expect(getFirstNameFurigana('翔')).toBe('ショウ')
  })

  it('returns hiragana reading when format is hiragana', () => {
    expect(getFirstNameFurigana('太郎', { format: 'hiragana' })).toBe('たろう')
    expect(getFirstNameFurigana('花子', { format: 'hiragana' })).toBe('はなこ')
  })

  it('returns undefined for unknown first names', () => {
    expect(getFirstNameFurigana('未登録')).toBeUndefined()
    expect(getFirstNameFurigana('')).toBeUndefined()
  })
})

describe('getFullNameFurigana', () => {
  it('returns full name reading for known names', () => {
    expect(getFullNameFurigana('山田 太郎')).toBe('ヤマダ タロウ')
    expect(getFullNameFurigana('佐藤 花子')).toBe('サトウ ハナコ')
  })

  it('handles full-width space', () => {
    expect(getFullNameFurigana('山田　太郎')).toBe('ヤマダ タロウ')
  })

  it('returns hiragana reading when format is hiragana', () => {
    expect(getFullNameFurigana('山田 太郎', { format: 'hiragana' })).toBe('やまだ たろう')
  })

  it('returns undefined when last name is unknown', () => {
    expect(getFullNameFurigana('未登録 太郎')).toBeUndefined()
  })

  it('returns undefined when first name is unknown', () => {
    expect(getFullNameFurigana('山田 未登録')).toBeUndefined()
  })

  it('returns undefined when no space separator', () => {
    expect(getFullNameFurigana('山田太郎')).toBeUndefined()
  })

  it('returns undefined for more than two parts', () => {
    expect(getFullNameFurigana('山田 太郎 様')).toBeUndefined()
  })
})

describe('addLastNameReading', () => {
  it('adds custom last name reading', () => {
    addLastNameReading('新姓', 'シンセイ')
    expect(getLastNameFurigana('新姓')).toBe('シンセイ')
  })

  it('converts hiragana input to katakana', () => {
    addLastNameReading('別姓', 'べっせい')
    expect(getLastNameFurigana('別姓')).toBe('ベッセイ')
  })
})

describe('addFirstNameReading', () => {
  it('adds custom first name reading', () => {
    addFirstNameReading('新名', 'シンメイ')
    expect(getFirstNameFurigana('新名')).toBe('シンメイ')
  })

  it('converts hiragana input to katakana', () => {
    addFirstNameReading('別名', 'べつめい')
    expect(getFirstNameFurigana('別名')).toBe('ベツメイ')
  })
})
