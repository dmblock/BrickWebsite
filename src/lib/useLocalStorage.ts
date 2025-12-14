import { useState, useEffect, useRef } from 'react'

type SetValue<T> = (value: T | ((prev: T) => T)) => void

export default function useLocalStorage<T>(
  key: string,
  initialValue: T,
  debounce = 500,
): [T, SetValue<T>, () => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    // debounce saving
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = window.setTimeout(() => {
      try {
        localStorage.setItem(key, JSON.stringify(state))
      } catch {
        // ignore
      }
    }, debounce)

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [key, state, debounce])

  const clear = () => {
    try {
      localStorage.removeItem(key)
    } catch {
      // ignore
    }
  }

  return [state, setState as SetValue<T>, clear]
}
