'use client'

import { useCallback, useMemo } from 'react'
import {
  getLastNameFurigana,
  getFirstNameFurigana,
  getFullNameFurigana,
  type FuriganaFormat,
} from '@haro/jpform-core'

export type UseFuriganaOptions = {
  /** 出力形式（デフォルト: katakana） */
  format?: FuriganaFormat
}

export type UseFuriganaReturn = {
  /** 姓からふりがなを取得 */
  getLastNameReading: (lastName: string) => string | undefined
  /** 名からふりがなを取得 */
  getFirstNameReading: (firstName: string) => string | undefined
  /** フルネームからふりがなを取得 */
  getFullNameReading: (fullName: string) => string | undefined
}

/**
 * ふりがな自動生成フック
 *
 * @param options - オプション
 * @returns ふりがな取得関数
 *
 * @example
 * ```tsx
 * function NameForm() {
 *   const [lastName, setLastName] = useState('')
 *   const [lastNameKana, setLastNameKana] = useState('')
 *   const { getLastNameReading } = useFurigana()
 *
 *   const handleLastNameChange = (e) => {
 *     const value = e.target.value
 *     setLastName(value)
 *
 *     // ふりがなを自動設定（見つかった場合のみ）
 *     const reading = getLastNameReading(value)
 *     if (reading) {
 *       setLastNameKana(reading)
 *     }
 *   }
 *
 *   return (
 *     <>
 *       <input value={lastName} onChange={handleLastNameChange} />
 *       <input value={lastNameKana} onChange={(e) => setLastNameKana(e.target.value)} />
 *     </>
 *   )
 * }
 * ```
 */
export function useFurigana(options: UseFuriganaOptions = {}): UseFuriganaReturn {
  const { format = 'katakana' } = options

  const getLastNameReading = useCallback(
    (lastName: string) => getLastNameFurigana(lastName, { format }),
    [format]
  )

  const getFirstNameReading = useCallback(
    (firstName: string) => getFirstNameFurigana(firstName, { format }),
    [format]
  )

  const getFullNameReading = useCallback(
    (fullName: string) => getFullNameFurigana(fullName, { format }),
    [format]
  )

  return useMemo(
    () => ({
      getLastNameReading,
      getFirstNameReading,
      getFullNameReading,
    }),
    [getLastNameReading, getFirstNameReading, getFullNameReading]
  )
}
