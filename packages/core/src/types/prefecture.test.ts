import { describe, expect, it } from 'vitest'
import {
  getPrefectureCode,
  getPrefectureName,
  isPrefecture,
  PREFECTURES,
} from './prefecture.js'

describe('PREFECTURES', () => {
  it('47都道府県が定義されている', () => {
    expect(PREFECTURES).toHaveLength(47)
  })

  it('北海道が最初', () => {
    expect(PREFECTURES[0]).toBe('北海道')
  })

  it('沖縄県が最後', () => {
    expect(PREFECTURES[46]).toBe('沖縄県')
  })
})

describe('getPrefectureCode', () => {
  it('都道府県名からコードを取得する', () => {
    expect(getPrefectureCode('北海道')).toBe('01')
    expect(getPrefectureCode('東京都')).toBe('13')
    expect(getPrefectureCode('大阪府')).toBe('27')
    expect(getPrefectureCode('沖縄県')).toBe('47')
  })
})

describe('getPrefectureName', () => {
  it('コードから都道府県名を取得する', () => {
    expect(getPrefectureName('01')).toBe('北海道')
    expect(getPrefectureName('13')).toBe('東京都')
    expect(getPrefectureName('27')).toBe('大阪府')
    expect(getPrefectureName('47')).toBe('沖縄県')
  })

  it('無効なコードでエラーをスローする', () => {
    expect(() => getPrefectureName('00' as '01')).toThrow()
    expect(() => getPrefectureName('48' as '01')).toThrow()
  })
})

describe('isPrefecture', () => {
  it('都道府県名を判定する', () => {
    expect(isPrefecture('東京都')).toBe(true)
    expect(isPrefecture('大阪府')).toBe(true)
    expect(isPrefecture('北海道')).toBe(true)
  })

  it('都道府県名以外はfalse', () => {
    expect(isPrefecture('東京')).toBe(false)
    expect(isPrefecture('トウキョウト')).toBe(false)
    expect(isPrefecture('')).toBe(false)
  })
})
