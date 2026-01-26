import { renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { useConverter, useInputConverter } from './useConverter.js'

describe('useConverter', () => {
  it('returns all converter functions', () => {
    const { result } = renderHook(() => useConverter())

    expect(result.current.toHankaku).toBeDefined()
    expect(result.current.toHankakuAlpha).toBeDefined()
    expect(result.current.toHankakuNumber).toBeDefined()
    expect(result.current.toZenkaku).toBeDefined()
    expect(result.current.toZenkakuAlpha).toBeDefined()
    expect(result.current.toZenkakuNumber).toBeDefined()
    expect(result.current.toZenkakuKana).toBeDefined()
    expect(result.current.toKatakana).toBeDefined()
    expect(result.current.toHiragana).toBeDefined()
    expect(result.current.normalizePostalCode).toBeDefined()
    expect(result.current.formatPostalCode).toBeDefined()
    expect(result.current.normalizePhone).toBeDefined()
  })

  it('toHankaku converts zenkaku to hankaku', () => {
    const { result } = renderHook(() => useConverter())
    expect(result.current.toHankaku('ＡＢＣ１２３')).toBe('ABC123')
  })

  it('toZenkaku converts hankaku to zenkaku', () => {
    const { result } = renderHook(() => useConverter())
    expect(result.current.toZenkaku('ABC123')).toBe('ＡＢＣ１２３')
  })

  it('toKatakana converts hiragana to katakana', () => {
    const { result } = renderHook(() => useConverter())
    expect(result.current.toKatakana('あいうえお')).toBe('アイウエオ')
  })

  it('toHiragana converts katakana to hiragana', () => {
    const { result } = renderHook(() => useConverter())
    expect(result.current.toHiragana('アイウエオ')).toBe('あいうえお')
  })

  it('normalizePostalCode normalizes postal codes', () => {
    const { result } = renderHook(() => useConverter())
    expect(result.current.normalizePostalCode('１００−０００１')).toBe('1000001')
    expect(result.current.normalizePostalCode('100-0001')).toBe('1000001')
  })

  it('formatPostalCode formats postal codes with hyphen', () => {
    const { result } = renderHook(() => useConverter())
    expect(result.current.formatPostalCode('1000001')).toBe('100-0001')
  })

  it('returns stable references across renders', () => {
    const { result, rerender } = renderHook(() => useConverter())
    const firstResult = result.current

    rerender()

    expect(result.current).toBe(firstResult)
  })
})

describe('useInputConverter', () => {
  it('creates a change handler that converts input value', () => {
    let capturedValue = ''
    const onChange = (value: string) => {
      capturedValue = value
    }

    const { result } = renderHook(() =>
      useInputConverter((v) => v.toUpperCase(), onChange)
    )

    const mockEvent = {
      target: { value: 'hello' },
    } as React.ChangeEvent<HTMLInputElement>

    result.current(mockEvent)

    expect(capturedValue).toBe('HELLO')
  })
})
