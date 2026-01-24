import { describe, expect, it } from 'vitest'
import { resolvePostalCode } from './resolve.js'
import { createCustomResolver } from './resolvers/custom.js'

describe('resolvePostalCode', () => {
  it('デフォルトでBundledResolverを使用する', async () => {
    const addresses = await resolvePostalCode('1000001')

    expect(addresses).toHaveLength(1)
    expect(addresses[0]?.prefecture).toBe('東京都')
  })

  it('カスタムResolverを使用できる', async () => {
    const customResolver = createCustomResolver({
      resolve: async () => [
        {
          postalCode: '1234567',
          prefecture: '北海道',
          prefectureCode: '01',
          city: 'テスト市',
          town: 'テスト町',
        },
      ],
    })

    const addresses = await resolvePostalCode('1234567', customResolver)

    expect(addresses).toHaveLength(1)
    expect(addresses[0]?.prefecture).toBe('北海道')
  })
})
