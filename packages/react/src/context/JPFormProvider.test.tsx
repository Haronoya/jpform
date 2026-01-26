import { renderHook } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import type { ReactNode } from 'react'
import type { PostalResolver } from '@haro/jpform-postal'
import { JPFormProvider, useJPFormConfig } from './JPFormProvider.js'

const createMockResolver = (): PostalResolver => ({
  resolve: vi.fn().mockResolvedValue([]),
})

describe('JPFormProvider', () => {
  it('provides default config when no props given', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <JPFormProvider>{children}</JPFormProvider>
    )

    const { result } = renderHook(() => useJPFormConfig(), { wrapper })

    expect(result.current.debounceMs).toBe(300)
    expect(result.current.postalResolver).toBeDefined()
    expect(result.current.postalResolver.resolve).toBeDefined()
  })

  it('provides custom postalResolver', () => {
    const mockResolver = createMockResolver()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <JPFormProvider postalResolver={mockResolver}>{children}</JPFormProvider>
    )

    const { result } = renderHook(() => useJPFormConfig(), { wrapper })

    expect(result.current.postalResolver).toBe(mockResolver)
  })

  it('provides custom debounceMs', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <JPFormProvider debounceMs={500}>{children}</JPFormProvider>
    )

    const { result } = renderHook(() => useJPFormConfig(), { wrapper })

    expect(result.current.debounceMs).toBe(500)
  })

  it('provides all custom props', () => {
    const mockResolver = createMockResolver()
    const wrapper = ({ children }: { children: ReactNode }) => (
      <JPFormProvider postalResolver={mockResolver} debounceMs={1000}>
        {children}
      </JPFormProvider>
    )

    const { result } = renderHook(() => useJPFormConfig(), { wrapper })

    expect(result.current.postalResolver).toBe(mockResolver)
    expect(result.current.debounceMs).toBe(1000)
  })
})

describe('useJPFormConfig', () => {
  it('returns default config without Provider', () => {
    const { result } = renderHook(() => useJPFormConfig())

    expect(result.current.debounceMs).toBe(300)
    expect(result.current.postalResolver).toBeDefined()
  })
})
