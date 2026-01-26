// Context
export { JPFormProvider, useJPFormConfig } from './context/index.js'
export type { JPFormConfig, JPFormProviderProps } from './context/index.js'

// Hooks
export { usePostalCode } from './hooks/index.js'
export type { UsePostalCodeOptions, UsePostalCodeReturn } from './hooks/index.js'
export { useConverter, useInputConverter } from './hooks/index.js'
export type { UseConverterReturn } from './hooks/index.js'

// Re-export types from core for convenience
export type { JPAddress, Prefecture, PrefectureCode } from '@haro/jpform-core'
