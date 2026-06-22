import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useOralSync } from '../pages/oral/useOralSync'

// Capture original BroadcastChannel to restore after tests.
const ORIGINAL_BROADCAST_CHANNEL = globalThis.BroadcastChannel

// Minimal in-process BroadcastChannel so two hook instances talk to each other.
class FakeChannel {
  static channels: FakeChannel[] = []
  onmessage: ((e: { data: unknown }) => void) | null = null
  constructor(public name: string) { FakeChannel.channels.push(this) }
  postMessage(data: unknown) {
    FakeChannel.channels
      .filter(c => c !== this && c.name === this.name)
      .forEach(c => c.onmessage?.({ data }))
  }
  close() { FakeChannel.channels = FakeChannel.channels.filter(c => c !== this) }
}

beforeEach(() => {
  FakeChannel.channels = []
  ;(globalThis as { BroadcastChannel: unknown }).BroadcastChannel = FakeChannel
})

afterEach(() => {
  ;(globalThis as { BroadcastChannel: unknown }).BroadcastChannel = ORIGINAL_BROADCAST_CHANNEL
})

describe('useOralSync', () => {
  it('propagates a step change from one window to another', () => {
    const a = renderHook(() => useOralSync(0))
    const b = renderHook(() => useOralSync(0))

    act(() => a.result.current[1](7))

    expect(a.result.current[0]).toBe(7)
    expect(b.result.current[0]).toBe(7)
  })
})
