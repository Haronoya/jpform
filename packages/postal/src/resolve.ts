import type { JPAddress } from '@haro/jpform-core'
import { bundledResolver } from './resolvers/bundled.js'
import type { PostalResolver } from './resolvers/types.js'

/**
 * 郵便番号から住所を解決
 *
 * @param postalCode - 郵便番号
 * @param resolver - 使用するResolver（デフォルト: BundledResolver）
 * @returns 住所の配列
 *
 * @example
 * ```ts
 * // デフォルト（同梱データ）を使用
 * const addresses = await resolvePostalCode('1000001')
 *
 * // 外部APIを使用
 * const apiResolver = createApiResolver()
 * const addresses = await resolvePostalCode('1000001', apiResolver)
 * ```
 */
export async function resolvePostalCode(
  postalCode: string,
  resolver: PostalResolver = bundledResolver
): Promise<JPAddress[]> {
  return resolver.resolve(postalCode)
}
