export {
  ApiResolver,
  BundledResolver,
  bundledResolver,
  createApiResolver,
  createCustomResolver,
  CustomResolver,
} from './resolvers/index.js'

export type {
  ApiResolverOptions,
  CustomResolveFunction,
  CustomResolverOptions,
  PostalData,
  PostalResolver,
} from './resolvers/index.js'

export { resolvePostalCode } from './resolve.js'

// Re-export types from core
export type { JPAddress, Prefecture, PrefectureCode } from '@haro/jpform-core'
