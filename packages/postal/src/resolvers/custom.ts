import { normalizePostalCode, type JPAddress } from '@haro/jpform-core'
import type { PostalResolver } from './types.js'

/**
 * カスタムResolver関数の型
 */
export type CustomResolveFunction = (postalCode: string) => Promise<JPAddress[]>

/**
 * カスタムResolverの設定
 */
export type CustomResolverOptions = {
  /** 解決関数 */
  resolve: CustomResolveFunction
  /** 入力を正規化するか */
  normalize?: boolean
}

/**
 * カスタム関数を使用する郵便番号Resolver
 */
export class CustomResolver implements PostalResolver {
  private readonly resolveFn: CustomResolveFunction
  private readonly shouldNormalize: boolean

  constructor(options: CustomResolverOptions) {
    this.resolveFn = options.resolve
    this.shouldNormalize = options.normalize ?? true
  }

  async resolve(postalCode: string): Promise<JPAddress[]> {
    const input = this.shouldNormalize ? normalizePostalCode(postalCode) : postalCode

    if (this.shouldNormalize && input.length !== 7) {
      return []
    }

    return this.resolveFn(input)
  }
}

/**
 * カスタムResolverを作成
 *
 * @example
 * ```ts
 * const resolver = createCustomResolver({
 *   resolve: async (postalCode) => {
 *     const response = await fetch(`/api/address?postal=${postalCode}`)
 *     return response.json()
 *   }
 * })
 * ```
 */
export function createCustomResolver(options: CustomResolverOptions): CustomResolver {
  return new CustomResolver(options)
}
