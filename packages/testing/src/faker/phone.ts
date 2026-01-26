/**
 * 電話番号生成オプション
 */
export type FakePhoneOptions = {
  /** 電話番号のタイプ */
  type?: 'mobile' | 'landline' | 'ip' | 'freeDial' | undefined
  /** ハイフンを含めるか（デフォルト: true） */
  hyphenated?: boolean | undefined
}

/**
 * ランダムな数字文字列を生成
 */
function randomDigits(length: number): string {
  let result = ''
  for (let i = 0; i < length; i++) {
    result += Math.floor(Math.random() * 10).toString()
  }
  return result
}

/**
 * ランダムな携帯電話番号を生成
 */
function fakeMobilePhone(hyphenated: boolean): string {
  const prefix = ['070', '080', '090'][Math.floor(Math.random() * 3)]
  const middle = randomDigits(4)
  const last = randomDigits(4)

  if (hyphenated) {
    return `${prefix}-${middle}-${last}`
  }
  return `${prefix}${middle}${last}`
}

/**
 * ランダムな固定電話番号を生成
 */
function fakeLandlinePhone(hyphenated: boolean): string {
  // 主要な市外局番
  const areaCodes = ['03', '06', '045', '052', '011', '092', '082', '078', '075', '022'] as const
  const areaCode = areaCodes[Math.floor(Math.random() * areaCodes.length)] as string

  let middle: string
  let last: string

  if (areaCode.length === 2) {
    // 2桁市外局番: 0X-XXXX-XXXX
    middle = randomDigits(4)
    last = randomDigits(4)
  } else {
    // 3桁市外局番: 0XX-XXX-XXXX
    middle = randomDigits(3)
    last = randomDigits(4)
  }

  if (hyphenated) {
    return `${areaCode}-${middle}-${last}`
  }
  return `${areaCode}${middle}${last}`
}

/**
 * ランダムなIP電話番号を生成
 */
function fakeIpPhone(hyphenated: boolean): string {
  const middle = randomDigits(4)
  const last = randomDigits(4)

  if (hyphenated) {
    return `050-${middle}-${last}`
  }
  return `050${middle}${last}`
}

/**
 * ランダムなフリーダイヤル番号を生成
 */
function fakeFreeDialPhone(hyphenated: boolean): string {
  // 0120 or 0800
  if (Math.random() < 0.7) {
    // 0120-XXX-XXX
    const middle = randomDigits(3)
    const last = randomDigits(3)
    if (hyphenated) {
      return `0120-${middle}-${last}`
    }
    return `0120${middle}${last}`
  } else {
    // 0800-XXX-XXXX
    const middle = randomDigits(3)
    const last = randomDigits(4)
    if (hyphenated) {
      return `0800-${middle}-${last}`
    }
    return `0800${middle}${last}`
  }
}

/**
 * ランダムな電話番号を生成
 *
 * @param options - オプション
 * @returns ランダムな電話番号
 *
 * @example
 * ```ts
 * const phone = fakePhone()
 * // '090-1234-5678' or '03-1234-5678' など
 *
 * const mobile = fakePhone({ type: 'mobile' })
 * // '090-1234-5678' など
 *
 * const noHyphen = fakePhone({ hyphenated: false })
 * // '09012345678' など
 * ```
 */
export function fakePhone(options: FakePhoneOptions = {}): string {
  const { type, hyphenated = true } = options

  if (type) {
    switch (type) {
      case 'mobile':
        return fakeMobilePhone(hyphenated)
      case 'landline':
        return fakeLandlinePhone(hyphenated)
      case 'ip':
        return fakeIpPhone(hyphenated)
      case 'freeDial':
        return fakeFreeDialPhone(hyphenated)
    }
  }

  // タイプ未指定の場合はランダムに選択
  const types: Array<'mobile' | 'landline' | 'ip' | 'freeDial'> = ['mobile', 'landline', 'ip', 'freeDial']
  const weights = [0.5, 0.35, 0.1, 0.05] // 携帯50%, 固定35%, IP10%, フリーダイヤル5%

  const random = Math.random()
  let cumulative = 0

  for (let i = 0; i < types.length; i++) {
    const weight = weights[i]
    const phoneType = types[i]
    if (weight !== undefined && phoneType !== undefined) {
      cumulative += weight
      if (random < cumulative) {
        return fakePhone({ type: phoneType, hyphenated })
      }
    }
  }

  return fakeMobilePhone(hyphenated)
}

/**
 * ランダムな携帯電話番号を生成
 *
 * @param hyphenated - ハイフンを含めるか
 * @returns ランダムな携帯電話番号
 */
export function fakeMobile(hyphenated = true): string {
  return fakePhone({ type: 'mobile', hyphenated })
}

/**
 * ランダムな固定電話番号を生成
 *
 * @param hyphenated - ハイフンを含めるか
 * @returns ランダムな固定電話番号
 */
export function fakeLandline(hyphenated = true): string {
  return fakePhone({ type: 'landline', hyphenated })
}

/**
 * 複数のランダムな電話番号を生成
 *
 * @param count - 生成する件数
 * @param options - オプション
 * @returns ランダムな電話番号の配列
 */
export function fakePhones(count: number, options: FakePhoneOptions = {}): string[] {
  return Array.from({ length: count }, () => fakePhone(options))
}
