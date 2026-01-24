// Converters
export {
  formatPostalCode,
  normalizePostalCode,
  toHankaku,
  toHankakuAlpha,
  toHankakuNumber,
  toHiragana,
  toKatakana,
  toZenkaku,
  toZenkakuAlpha,
  toZenkakuKana,
  toZenkakuNumber,
} from './converters/index.js'

// Validators
export {
  extractPhoneDigits,
  isFreeDialPhone,
  isLandlinePhone,
  isMobilePhone,
  isValidPhone,
  isValidPostalCode,
  normalizePhone,
} from './validators/index.js'

// Types
export {
  getPrefectureCode,
  getPrefectureName,
  isPrefecture,
  PREFECTURES,
} from './types/index.js'
export type { JPAddress, Prefecture, PrefectureCode } from './types/index.js'
