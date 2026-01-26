import { describe, expect, it } from 'vitest'
import { PREFECTURES } from '@haro/jpform-core'
import { fakeAddress, fakeAddresses, fakePostalCode, fakePrefecture } from './address.js'

describe('fakePostalCode', () => {
  it('generates 7-digit postal codes', () => {
    for (let i = 0; i < 10; i++) {
      const code = fakePostalCode()
      expect(code).toMatch(/^[0-9]{7}$/)
    }
  })
})

describe('fakePrefecture', () => {
  it('generates valid prefecture names', () => {
    for (let i = 0; i < 10; i++) {
      const pref = fakePrefecture()
      expect(PREFECTURES).toContain(pref)
    }
  })
})

describe('fakeAddress', () => {
  it('generates valid address structure', () => {
    const address = fakeAddress()

    expect(address.postalCode).toMatch(/^[0-9]{7}$/)
    expect(PREFECTURES).toContain(address.prefecture)
    expect(address.prefectureCode).toMatch(/^[0-9]{2}$/)
    expect(address.city).toBeDefined()
    expect(address.town).toBeDefined()
  })

  it('respects prefecture option', () => {
    const address = fakeAddress({ prefecture: '東京都' })
    expect(address.prefecture).toBe('東京都')
    expect(address.prefectureCode).toBe('13')
  })

  it('respects postalCode option', () => {
    const address = fakeAddress({ postalCode: '1234567' })
    expect(address.postalCode).toBe('1234567')
  })

  it('includes kana when requested', () => {
    const address = fakeAddress({ includeKana: true, prefecture: '東京都' })
    expect(address.prefectureKana).toBeDefined()
    expect(address.cityKana).toBeDefined()
    expect(address.townKana).toBeDefined()
  })

  it('excludes kana by default', () => {
    const address = fakeAddress()
    expect(address.prefectureKana).toBeUndefined()
    expect(address.cityKana).toBeUndefined()
    expect(address.townKana).toBeUndefined()
  })
})

describe('fakeAddresses', () => {
  it('generates correct number of addresses', () => {
    const addresses = fakeAddresses(5)
    expect(addresses).toHaveLength(5)
  })

  it('applies options to all addresses', () => {
    const addresses = fakeAddresses(3, { prefecture: '大阪府' })
    addresses.forEach((address) => {
      expect(address.prefecture).toBe('大阪府')
    })
  })
})
