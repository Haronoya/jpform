'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { PostalResolver } from '@haro/jpform-postal'
import { bundledResolver } from '@haro/jpform-postal'

/**
 * JPFormの設定
 */
export type JPFormConfig = {
  /** 郵便番号Resolver */
  postalResolver: PostalResolver
  /** debounce時間（ミリ秒） */
  debounceMs: number
}

const defaultConfig: JPFormConfig = {
  postalResolver: bundledResolver,
  debounceMs: 300,
}

const JPFormContext = createContext<JPFormConfig>(defaultConfig)

/**
 * JPFormの設定を提供するProvider
 */
export type JPFormProviderProps = {
  children: ReactNode
  /** 郵便番号Resolver */
  postalResolver?: PostalResolver
  /** debounce時間（ミリ秒） */
  debounceMs?: number
}

export function JPFormProvider({
  children,
  postalResolver = bundledResolver,
  debounceMs = 300,
}: JPFormProviderProps) {
  const config: JPFormConfig = {
    postalResolver,
    debounceMs,
  }

  return <JPFormContext.Provider value={config}>{children}</JPFormContext.Provider>
}

/**
 * JPFormの設定を取得するHook
 */
export function useJPFormConfig(): JPFormConfig {
  return useContext(JPFormContext)
}
