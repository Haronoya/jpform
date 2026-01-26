import { describe, expect, it } from 'vitest'
import { fakePhone, fakePhones, fakeMobile, fakeLandline } from './phone.js'

describe('fakePhone', () => {
  it('generates valid phone numbers', () => {
    for (let i = 0; i < 10; i++) {
      const phone = fakePhone()
      // ハイフン付きの電話番号形式
      expect(phone).toMatch(/^0[0-9]{1,4}-[0-9]{1,4}-[0-9]{3,4}$/)
    }
  })

  it('generates mobile phone numbers', () => {
    for (let i = 0; i < 10; i++) {
      const phone = fakePhone({ type: 'mobile' })
      expect(phone).toMatch(/^0[789]0-[0-9]{4}-[0-9]{4}$/)
    }
  })

  it('generates landline phone numbers', () => {
    for (let i = 0; i < 10; i++) {
      const phone = fakePhone({ type: 'landline' })
      // 2桁または3桁の市外局番
      expect(phone).toMatch(/^0[1-9][0-9]?-[0-9]{3,4}-[0-9]{4}$/)
    }
  })

  it('generates IP phone numbers', () => {
    for (let i = 0; i < 10; i++) {
      const phone = fakePhone({ type: 'ip' })
      expect(phone).toMatch(/^050-[0-9]{4}-[0-9]{4}$/)
    }
  })

  it('generates free dial numbers', () => {
    for (let i = 0; i < 10; i++) {
      const phone = fakePhone({ type: 'freeDial' })
      expect(phone).toMatch(/^0(120-[0-9]{3}-[0-9]{3}|800-[0-9]{3}-[0-9]{4})$/)
    }
  })

  it('generates numbers without hyphens when requested', () => {
    const phone = fakePhone({ type: 'mobile', hyphenated: false })
    expect(phone).toMatch(/^0[789]0[0-9]{8}$/)
  })
})

describe('fakeMobile', () => {
  it('generates mobile phone numbers', () => {
    for (let i = 0; i < 10; i++) {
      const phone = fakeMobile()
      expect(phone).toMatch(/^0[789]0-[0-9]{4}-[0-9]{4}$/)
    }
  })

  it('supports hyphenated option', () => {
    const phone = fakeMobile(false)
    expect(phone).toMatch(/^0[789]0[0-9]{8}$/)
  })
})

describe('fakeLandline', () => {
  it('generates landline phone numbers', () => {
    for (let i = 0; i < 10; i++) {
      const phone = fakeLandline()
      expect(phone).toMatch(/^0[1-9][0-9]?-[0-9]{3,4}-[0-9]{4}$/)
    }
  })

  it('supports hyphenated option', () => {
    const phone = fakeLandline(false)
    expect(phone).toMatch(/^0[1-9][0-9]{8,9}$/)
  })
})

describe('fakePhones', () => {
  it('generates correct number of phone numbers', () => {
    const phones = fakePhones(5)
    expect(phones).toHaveLength(5)
  })

  it('applies options to all phone numbers', () => {
    const phones = fakePhones(3, { type: 'mobile' })
    phones.forEach((phone) => {
      expect(phone).toMatch(/^0[789]0-[0-9]{4}-[0-9]{4}$/)
    })
  })
})
