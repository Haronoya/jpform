// Schemas
export {
  postalCodeSchema,
  optionalPostalCodeSchema,
  phoneSchema,
  optionalPhoneSchema,
  mobilePhoneSchema,
  landlinePhoneSchema,
  freeDialPhoneSchema,
  prefectureSchema,
  prefectureCodeSchema,
  addressSchema,
  jpAddressSchema,
} from './schemas/index.js'

export type {
  PostalCodeSchemaOptions,
  PhoneSchemaOptions,
  AddressSchemaOptions,
} from './schemas/index.js'

// Re-export types from core for convenience
export type { JPAddress, Prefecture, PrefectureCode } from '@haro/jpform-core'
