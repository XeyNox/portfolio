import { useCallback, useEffect, useRef, useState } from 'react'

const CHANNEL = 'oral'
const STORAGE_KEY = 'oral:step'

export function useOralSync(initial = 0): [number, (i: number) => void] {
  const [stepIndex, setLocal] = useState(initial)
  const channelRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof BroadcastChannel !== 'undefined') {
      const ch = new BroadcastChannel(CHANNEL)
      ch.onmessage = e => {
        const i = (e.data as { stepIndex?: number }).stepIndex
        if (typeof i === 'number') setLocal(i)
      }
      channelRef.current = ch
      return () => {
        ch.close()
        channelRef.current = null
      }
    }
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue != null) setLocal(Number(e.newValue))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const setStepIndex = useCallback((i: number) => {
    setLocal(i)
    if (channelRef.current) {
      channelRef.current.postMessage({ stepIndex: i })
    } else if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, String(i))
    }
  }, [])

  return [stepIndex, setStepIndex]
}
