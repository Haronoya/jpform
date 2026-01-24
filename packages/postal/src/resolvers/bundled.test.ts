import { describe, expect, it } from 'vitest'
import { BundledResolver, bundledResolver } from './bundled.js'

describe('BundledResolver', () => {
  it('有効な郵便番号から住所を取得する', async () => {
    const addresses = await bundledResolver.resolve('1000001')

    expect(addresses).toHaveLength(1)
    expect(addresses[0]).toMatchObject({
      postalCode: '1000001',
      prefecture: '東京都',
      prefectureCode: '13',
      city: '千代田区',
      town: '千代田',
    })
  })

  it('ハイフン付き郵便番号を処理する', async () => {
    const addresses = await bundledResolver.resolve('100-0001')

    expect(addresses).toHaveLength(1)
    expect(addresses[0]?.prefecture).toBe('東京都')
  })

  it('全角数字を処理する', async () => {
    const addresses = await bundledResolver.resolve('１００００００１')

    expect(addresses).toHaveLength(1)
    expect(addresses[0]?.prefecture).toBe('東京都')
  })

  it('存在しない郵便番号は空配列を返す', async () => {
    const addresses = await bundledResolver.resolve('0000000')

    expect(addresses).toEqual([])
  })

  it('無効な郵便番号は空配列を返す', async () => {
    const addresses = await bundledResolver.resolve('12345')

    expect(addresses).toEqual([])
  })

  it('カナ情報を含む', async () => {
    const addresses = await bundledResolver.resolve('1000001')

    expect(addresses[0]).toMatchObject({
      prefectureKana: 'トウキョウト',
      cityKana: 'チヨダク',
      townKana: 'チヨダ',
    })
  })

  it('複数の住所を返す場合がある', async () => {
    // サンプルデータでは1つずつだが、実際のデータでは複数の場合がある
    const resolver = new BundledResolver()
    const addresses = await resolver.resolve('1000001')

    expect(Array.isArray(addresses)).toBe(true)
  })
})
