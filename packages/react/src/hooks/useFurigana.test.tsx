import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useFurigana } from './useFurigana.js'

describe('useFurigana', () => {
  it('returns furigana functions', () => {
    const { result } = renderHook(() => useFurigana())

    expect(result.current.getLastNameReading).toBeDefined()
    expect(result.current.getFirstNameReading).toBeDefined()
    expect(result.current.getFullNameReading).toBeDefined()
  })

  it('returns katakana reading by default', () => {
    const { result } = renderHook(() => useFurigana())

    expect(result.current.getLastNameReading('山田')).toBe('ヤマダ')
    expect(result.current.getFirstNameReading('太郎')).toBe('タロウ')
    expect(result.current.getFullNameReading('山田 太郎')).toBe('ヤマダ タロウ')
  })

  it('returns hiragana reading when format is hiragana', () => {
    const { result } = renderHook(() => useFurigana({ format: 'hiragana' }))

    expect(result.current.getLastNameReading('山田')).toBe('やまだ')
    expect(result.current.getFirstNameReading('太郎')).toBe('たろう')
    expect(result.current.getFullNameReading('山田 太郎')).toBe('やまだ たろう')
  })

  it('returns undefined for unknown names', () => {
    const { result } = renderHook(() => useFurigana())

    expect(result.current.getLastNameReading('未登録')).toBeUndefined()
    expect(result.current.getFirstNameReading('未登録')).toBeUndefined()
    expect(result.current.getFullNameReading('未登録 未登録')).toBeUndefined()
  })
})
