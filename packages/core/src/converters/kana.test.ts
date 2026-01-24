import { describe, expect, it } from 'vitest'
import { toHiragana, toKatakana, toZenkakuKana } from './kana.js'

describe('toZenkakuKana', () => {
  it('半角カタカナを全角カタカナに変換する', () => {
    expect(toZenkakuKana('ｱｲｳｴｵ')).toBe('アイウエオ')
    expect(toZenkakuKana('ｶｷｸｹｺ')).toBe('カキクケコ')
  })

  it('濁点を結合する', () => {
    expect(toZenkakuKana('ｶﾞｷﾞｸﾞｹﾞｺﾞ')).toBe('ガギグゲゴ')
    expect(toZenkakuKana('ｻﾞｼﾞｽﾞｾﾞｿﾞ')).toBe('ザジズゼゾ')
  })

  it('半濁点を結合する', () => {
    expect(toZenkakuKana('ﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟ')).toBe('パピプペポ')
  })

  it('長音符を変換する', () => {
    expect(toZenkakuKana('ｶﾞｰﾙ')).toBe('ガール')
  })

  it('変換対象外はそのまま', () => {
    expect(toZenkakuKana('ABC123')).toBe('ABC123')
    expect(toZenkakuKana('あいうえお')).toBe('あいうえお')
  })
})

describe('toKatakana', () => {
  it('ひらがなをカタカナに変換する', () => {
    expect(toKatakana('あいうえお')).toBe('アイウエオ')
    expect(toKatakana('かきくけこ')).toBe('カキクケコ')
    expect(toKatakana('がぎぐげご')).toBe('ガギグゲゴ')
    expect(toKatakana('ぱぴぷぺぽ')).toBe('パピプペポ')
  })

  it('変換対象外はそのまま', () => {
    expect(toKatakana('ABC123')).toBe('ABC123')
    expect(toKatakana('アイウエオ')).toBe('アイウエオ')
    expect(toKatakana('漢字')).toBe('漢字')
  })

  it('混在する文字列を変換する', () => {
    expect(toKatakana('やまだたろう')).toBe('ヤマダタロウ')
  })
})

describe('toHiragana', () => {
  it('カタカナをひらがなに変換する', () => {
    expect(toHiragana('アイウエオ')).toBe('あいうえお')
    expect(toHiragana('カキクケコ')).toBe('かきくけこ')
    expect(toHiragana('ガギグゲゴ')).toBe('がぎぐげご')
    expect(toHiragana('パピプペポ')).toBe('ぱぴぷぺぽ')
  })

  it('変換対象外はそのまま', () => {
    expect(toHiragana('ABC123')).toBe('ABC123')
    expect(toHiragana('あいうえお')).toBe('あいうえお')
    expect(toHiragana('漢字')).toBe('漢字')
  })

  it('混在する文字列を変換する', () => {
    expect(toHiragana('ヤマダタロウ')).toBe('やまだたろう')
  })
})
