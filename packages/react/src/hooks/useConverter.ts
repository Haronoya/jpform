'use client'

import { useCallback, useMemo } from 'react'
import {
  toHankaku,
  toHankakuAlpha,
  toHankakuNumber,
  toZenkaku,
  toZenkakuAlpha,
  toZenkakuNumber,
  toZenkakuKana,
  toKatakana,
  toHiragana,
  normalizePostalCode,
  formatPostalCode,
  normalizePhone,
} from '@haro/jpform-core'

/**
 * useConverterの戻り値
 */
export type UseConverterReturn = {
  /** 全角を半角に変換 */
  toHankaku: (value: string) => string
  /** 全角英字を半角に変換 */
  toHankakuAlpha: (value: string) => string
  /** 全角数字を半角に変換 */
  toHankakuNumber: (value: string) => string
  /** 半角を全角に変換 */
  toZenkaku: (value: string) => string
  /** 半角英字を全角に変換 */
  toZenkakuAlpha: (value: string) => string
  /** 半角数字を全角に変換 */
  toZenkakuNumber: (value: string) => string
  /** 半角カタカナを全角カタカナに変換 */
  toZenkakuKana: (value: string) => string
  /** ひらがなをカタカナに変換 */
  toKatakana: (value: string) => string
  /** カタカナをひらがなに変換 */
  toHiragana: (value: string) => string
  /** 郵便番号を正規化 */
  normalizePostalCode: (value: string) => string
  /** 郵便番号をフォーマット（ハイフン付き） */
  formatPostalCode: (value: string) => string
  /** 電話番号を正規化 */
  normalizePhone: (value: string) => string
}

/**
 * 文字変換ユーティリティを提供するHook
 *
 * @returns 変換関数群
 *
 * @example
 * ```tsx
 * const { toHankaku, normalizePostalCode } = useConverter()
 *
 * <input
 *   value={value}
 *   onChange={e => setValue(toHankaku(e.target.value))}
 * />
 * ```
 */
export function useConverter(): UseConverterReturn {
  // メモ化された関数群を返す
  return useMemo(
    () => ({
      toHankaku,
      toHankakuAlpha,
      toHankakuNumber,
      toZenkaku,
      toZenkakuAlpha,
      toZenkakuNumber,
      toZenkakuKana,
      toKatakana,
      toHiragana,
      normalizePostalCode,
      formatPostalCode,
      normalizePhone,
    }),
    []
  )
}

/**
 * 入力値を変換するハンドラを生成するHook
 *
 * @param converter - 変換関数
 * @param onChange - 変更ハンドラ
 * @returns イベントハンドラ
 *
 * @example
 * ```tsx
 * const handleChange = useInputConverter(toHankaku, setValue)
 * <input onChange={handleChange} />
 * ```
 */
export function useInputConverter<T extends HTMLInputElement | HTMLTextAreaElement>(
  converter: (value: string) => string,
  onChange: (value: string) => void
) {
  return useCallback(
    (event: React.ChangeEvent<T>) => {
      const converted = converter(event.target.value)
      onChange(converted)
    },
    [converter, onChange]
  )
}
