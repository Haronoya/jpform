import { renderHook, waitFor, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import type { ReactNode } from 'react'
import type { JPAddress } from '@haro/jpform-core'
import type { PostalResolver } from '@haro/jpform-postal'
import { usePostalCode } from './usePostalCode.js'
import { JPFormProvider } from '../context/JPFormProvider.js'

const mockAddress: JPAddress = {
  postalCode: '1000001',
  prefecture: '東京都',
  prefectureCode: '13',
  city: '千代田区',
  town: '千代田',
}

const createMockResolver = (result: JPAddress[] = [mockAddress]): PostalResolver => ({
  resolve: vi.fn().mockResolvedValue(result),
})

const createWrapper = (resolver?: PostalResolver) => {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <JPFormProvider postalResolver={resolver} debounceMs={0}>
        {children}
      </JPFormProvider>
    )
  }
}

describe('usePostalCode', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns initial state', () => {
    const mockResolver = createMockResolver()
    const { result } = renderHook(() => usePostalCode(), {
      wrapper: createWrapper(mockResolver),
    })

    expect(result.current.addresses).toEqual([])
    expect(result.current.isLoading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.resolve).toBeDefined()
    expect(result.current.reset).toBeDefined()
  })

  it('resolves postal code manually', async () => {
    const mockResolver = createMockResolver()
    const { result } = renderHook(() => usePostalCode(), {
      wrapper: createWrapper(mockResolver),
    })

    await act(async () => {
      await result.current.resolve('1000001')
    })

    expect(result.current.addresses).toEqual([mockAddress])
    expect(result.current.isLoading).toBe(false)
  })

  it('resolves postal code automatically with debounce', async () => {
    const mockResolver = createMockResolver()
    const { result, rerender } = renderHook(
      ({ postalCode }) => usePostalCode(postalCode, { resolver: mockResolver, debounceMs: 300 }),
      {
        initialProps: { postalCode: '' },
        wrapper: createWrapper(mockResolver),
      }
    )

    rerender({ postalCode: '100-0001' })

    // debounce中はまだ呼ばれない
    expect(mockResolver.resolve).not.toHaveBeenCalled()

    // debounce待機
    await act(async () => {
      vi.advanceTimersByTime(300)
      await Promise.resolve()
    })

    // Promiseを解決させる
    await act(async () => {
      await Promise.resolve()
    })

    expect(mockResolver.resolve).toHaveBeenCalledWith('1000001')
  })

  it('does not resolve invalid postal codes', async () => {
    const mockResolver = createMockResolver()
    const { result } = renderHook(() => usePostalCode(), {
      wrapper: createWrapper(mockResolver),
    })

    await act(async () => {
      const addresses = await result.current.resolve('invalid')
    })

    expect(mockResolver.resolve).not.toHaveBeenCalled()
    expect(result.current.addresses).toEqual([])
  })

  it('normalizes postal code before resolving', async () => {
    const mockResolver = createMockResolver()
    const { result } = renderHook(() => usePostalCode(), {
      wrapper: createWrapper(mockResolver),
    })

    await act(async () => {
      await result.current.resolve('１００−０００１')
    })

    expect(mockResolver.resolve).toHaveBeenCalledWith('1000001')
  })

  it('handles resolver errors', async () => {
    const error = new Error('Network error')
    const mockResolver: PostalResolver = {
      resolve: vi.fn().mockRejectedValue(error),
    }
    const { result } = renderHook(() => usePostalCode(), {
      wrapper: createWrapper(mockResolver),
    })

    await act(async () => {
      await result.current.resolve('1000001')
    })

    expect(result.current.error).toBe(error)
    expect(result.current.addresses).toEqual([])
    expect(result.current.isLoading).toBe(false)
  })

  it('resets state', async () => {
    const mockResolver = createMockResolver()
    const { result } = renderHook(() => usePostalCode(), {
      wrapper: createWrapper(mockResolver),
    })

    await act(async () => {
      await result.current.resolve('1000001')
    })

    expect(result.current.addresses).toEqual([mockAddress])

    act(() => {
      result.current.reset()
    })

    expect(result.current.addresses).toEqual([])
    expect(result.current.error).toBe(null)
    expect(result.current.isLoading).toBe(false)
  })

  it('uses custom resolver from options', async () => {
    const customResolver = createMockResolver([{ ...mockAddress, city: '新宿区' }])
    const defaultResolver = createMockResolver()

    const { result } = renderHook(
      () => usePostalCode(undefined, { resolver: customResolver }),
      { wrapper: createWrapper(defaultResolver) }
    )

    await act(async () => {
      await result.current.resolve('1600000')
    })

    expect(customResolver.resolve).toHaveBeenCalled()
    expect(defaultResolver.resolve).not.toHaveBeenCalled()
    expect(result.current.addresses[0].city).toBe('新宿区')
  })
})
