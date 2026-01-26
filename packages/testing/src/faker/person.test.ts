import { describe, expect, it } from 'vitest'
import { fakePerson, fakePersons, fakeLastName, fakeFirstName, fakeFullName } from './person.js'

describe('fakePerson', () => {
  it('generates valid person structure', () => {
    const person = fakePerson()

    expect(person.lastName).toBeDefined()
    expect(person.firstName).toBeDefined()
    expect(person.fullName).toBe(`${person.lastName} ${person.firstName}`)
  })

  it('includes kana by default', () => {
    const person = fakePerson()

    expect(person.lastNameKana).toBeDefined()
    expect(person.firstNameKana).toBeDefined()
    expect(person.fullNameKana).toBe(`${person.lastNameKana} ${person.firstNameKana}`)
  })

  it('excludes kana when requested', () => {
    const person = fakePerson({ includeKana: false })

    expect(person.lastNameKana).toBeUndefined()
    expect(person.firstNameKana).toBeUndefined()
    expect(person.fullNameKana).toBeUndefined()
  })

  it('includes hiragana when requested', () => {
    const person = fakePerson({ includeHiragana: true })

    expect(person.lastNameHiragana).toBeDefined()
    expect(person.firstNameHiragana).toBeDefined()
    expect(person.fullNameHiragana).toBe(`${person.lastNameHiragana} ${person.firstNameHiragana}`)
  })

  it('excludes hiragana by default', () => {
    const person = fakePerson()

    expect(person.lastNameHiragana).toBeUndefined()
    expect(person.firstNameHiragana).toBeUndefined()
    expect(person.fullNameHiragana).toBeUndefined()
  })

  it('respects gender option', () => {
    // 複数回生成して一貫性を確認（性別固定時に名前の候補が変わる）
    for (let i = 0; i < 10; i++) {
      const malePerson = fakePerson({ gender: 'male' })
      const femalePerson = fakePerson({ gender: 'female' })

      // 名前が空でないことを確認
      expect(malePerson.firstName.length).toBeGreaterThan(0)
      expect(femalePerson.firstName.length).toBeGreaterThan(0)
    }
  })
})

describe('fakeLastName', () => {
  it('generates non-empty last names', () => {
    for (let i = 0; i < 10; i++) {
      const name = fakeLastName()
      expect(name.length).toBeGreaterThan(0)
    }
  })
})

describe('fakeFirstName', () => {
  it('generates non-empty first names', () => {
    for (let i = 0; i < 10; i++) {
      const name = fakeFirstName()
      expect(name.length).toBeGreaterThan(0)
    }
  })

  it('respects gender option', () => {
    for (let i = 0; i < 10; i++) {
      const maleName = fakeFirstName('male')
      const femaleName = fakeFirstName('female')
      expect(maleName.length).toBeGreaterThan(0)
      expect(femaleName.length).toBeGreaterThan(0)
    }
  })
})

describe('fakeFullName', () => {
  it('generates full names with space separator', () => {
    for (let i = 0; i < 10; i++) {
      const name = fakeFullName()
      expect(name).toMatch(/^.+ .+$/)
    }
  })
})

describe('fakePersons', () => {
  it('generates correct number of persons', () => {
    const persons = fakePersons(5)
    expect(persons).toHaveLength(5)
  })

  it('applies options to all persons', () => {
    const persons = fakePersons(3, { includeKana: false })
    persons.forEach((person) => {
      expect(person.lastNameKana).toBeUndefined()
    })
  })
})
