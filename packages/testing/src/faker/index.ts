export {
  fakeAddress,
  fakeAddresses,
  fakePostalCode,
  fakePrefecture,
} from './address.js'
export type { FakeAddressOptions } from './address.js'

export {
  fakePhone,
  fakePhones,
  fakeMobile,
  fakeLandline,
} from './phone.js'
export type { FakePhoneOptions } from './phone.js'

export {
  fakePerson,
  fakePersons,
  fakeLastName,
  fakeFirstName,
  fakeFullName,
} from './person.js'
export type { FakePersonOptions, FakePerson } from './person.js'

// Convenience faker object
import { fakeAddress, fakePostalCode, fakePrefecture } from './address.js'
import { fakePhone, fakeMobile, fakeLandline } from './phone.js'
import { fakePerson, fakeLastName, fakeFirstName, fakeFullName } from './person.js'

/**
 * Fakerオブジェクト - テストデータ生成用の便利なインターフェース
 */
export const faker = {
  /** 住所を生成 */
  address: fakeAddress,
  /** 郵便番号を生成 */
  postalCode: fakePostalCode,
  /** 都道府県を生成 */
  prefecture: fakePrefecture,
  /** 電話番号を生成 */
  phone: fakePhone,
  /** 携帯電話番号を生成 */
  mobile: fakeMobile,
  /** 固定電話番号を生成 */
  landline: fakeLandline,
  /** フリーダイヤルを生成 */
  freeDial: () => `0120-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
  /** 人物情報を生成 */
  person: fakePerson,
  /** 姓を生成 */
  lastName: fakeLastName,
  /** 名を生成 */
  firstName: fakeFirstName,
  /** フルネームを生成 */
  fullName: fakeFullName,
}
