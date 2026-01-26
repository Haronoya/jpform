// Faker utilities
export {
  // Address
  fakeAddress,
  fakeAddresses,
  fakePostalCode,
  fakePrefecture,
  // Phone
  fakePhone,
  fakePhones,
  fakeMobile,
  fakeLandline,
  // Person
  fakePerson,
  fakePersons,
  fakeLastName,
  fakeFirstName,
  fakeFullName,
} from './faker/index.js'

export type {
  FakeAddressOptions,
  FakePhoneOptions,
  FakePersonOptions,
  FakePerson,
} from './faker/index.js'

// Re-export types from core for convenience
export type { JPAddress, Prefecture, PrefectureCode } from '@haro/jpform-core'
