'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import type { JPAddress } from '@haro/jpform-core'
import { normalizePostalCode, isValidPostalCode } from '@haro/jpform-core'
import type { PostalResolver } from '@haro/jpform-postal'
import { useJPFormConfig } from '../context/JPFormProvider.js'

/**
 * usePostalCodeのオプション
 */
export type UsePostalCodeOptions = {
  /** 郵便番号Resolver */
  resolver?: PostalResolver
  /** debounce時間（ミリ秒） */
  debounceMs?: number
  /** 自動解決を有効にするか */
  autoResolve?: boolean
}

/**
 * usePostalCodeの戻り値
 */
export type UsePostalCodeReturn = {
  /** 解決された住所の配列 */
  addresses: JPAddress[]
  /** ローディング状態 */
  isLoading: boolean
  /** エラー */
  error: Error | null
  /** 郵便番号を解決する */
  resolve: (postalCode: string) => Promise<JPAddress[]>
  /** 状態をリセットする */
  reset: () => void
}

/**
 * 郵便番号から住所を解決するHook
 *
 * @param postalCode - 郵便番号（autoResolve有効時に使用）
 * @param options - オプション
 * @returns 住所情報と操作関数
 *
 * @example
 * ```tsx
 * // 自動解決（入力値の変更に応じて自動的に解決）
 * const [postalCode, setPostalCode] = useState('')
 * const { addresses, isLoading } = usePostalCode(postalCode)
 *
 * // 手動解決
 * const { resolve, addresses } = usePostalCode()
 * const handleSearch = () => resolve('1000001')
 * ```
 */
export function usePostalCode(
  postalCode?: string,
  options: UsePostalCodeOptions = {}
): UsePostalCodeReturn {
  const config = useJPFormConfig()
  const {
    resolver = config.postalResolver,
    debounceMs = config.debounceMs,
    autoResolve = postalCode !== undefined,
  } = options

  const [addresses, setAddresses] = useState<JPAddress[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const debounceTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const abortControllerRef = useRef<AbortController>()

  const resolve = useCallback(
    async (code: string): Promise<JPAddress[]> => {
      // 前回のリクエストをキャンセル
      abortControllerRef.current?.abort()
      abortControllerRef.current = new AbortController()

      const normalized = normalizePostalCode(code)

      if (!isValidPostalCode(normalized)) {
        setAddresses([])
        return []
      }

      setIsLoading(true)
      setError(null)

      try {
        const result = await resolver.resolve(normalized)
        setAddresses(result)
        return result
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err)
        }
        return []
      } finally {
        setIsLoading(false)
      }
    },
    [resolver]
  )

  const reset = useCallback(() => {
    setAddresses([])
    setError(null)
    setIsLoading(false)
  }, [])

  // 自動解決
  useEffect(() => {
    if (!autoResolve || postalCode === undefined) {
      return
    }

    // debounceタイマーをクリア
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    const normalized = normalizePostalCode(postalCode)

    if (!isValidPostalCode(normalized)) {
      setAddresses([])
      return
    }

    debounceTimerRef.current = setTimeout(() => {
      void resolve(postalCode)
    }, debounceMs)

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [postalCode, autoResolve, debounceMs, resolve])

  // クリーンアップ
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    addresses,
    isLoading,
    error,
    resolve,
    reset,
  }
}
