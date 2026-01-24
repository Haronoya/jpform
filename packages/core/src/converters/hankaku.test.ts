import { describe, expect, it } from 'vitest'
import { toHankaku, toHankakuAlpha, toHankakuNumber } from './hankaku.js'

describe('toHankaku', () => {
  it('全角数字を半角に変換する', () => {
    expect(toHankaku('０１２３４５６７８９')).toBe('0123456789')
  })

  it('全角英字を半角に変換する', () => {
    expect(toHankaku('ＡＢＣＤＥＦＧ')).toBe('ABCDEFG')
    expect(toHankaku('ａｂｃｄｅｆｇ')).toBe('abcdefg')
  })

  it('全角記号を半角に変換する', () => {
    expect(toHankaku('！＠＃＄％')).toBe('!@#$%')
    expect(toHankaku('（）［］｛｝')).toBe('()[]{}')
  })

  it('全角スペースを半角に変換する', () => {
    expect(toHankaku('　')).toBe(' ')
  })

  it('変換対象外の文字はそのまま', () => {
    expect(toHankaku('東京都渋谷区')).toBe('東京都渋谷区')
    expect(toHankaku('あいうえお')).toBe('あいうえお')
    expect(toHankaku('アイウエオ')).toBe('アイウエオ')
  })

  it('混在する文字列を変換する', () => {
    expect(toHankaku('東京都１２３')).toBe('東京都123')
    expect(toHankaku('ＡＢＣ株式会社')).toBe('ABC株式会社')
  })
})

describe('toHankakuNumber', () => {
  it('全角数字のみを半角に変換する', () => {
    expect(toHankakuNumber('０１２３４５')).toBe('012345')
    expect(toHankakuNumber('ＡＢＣＤ')).toBe('ＡＢＣＤ') // 英字は変換しない
  })
})

describe('toHankakuAlpha', () => {
  it('全角英字のみを半角に変換する', () => {
    expect(toHankakuAlpha('ＡＢＣＤ')).toBe('ABCD')
    expect(toHankakuAlpha('ａｂｃｄ')).toBe('abcd')
    expect(toHankakuAlpha('０１２３')).toBe('０１２３') // 数字は変換しない
  })
})
