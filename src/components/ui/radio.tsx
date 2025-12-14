import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type RadioGroupContextValue = {
  value: string | null
  onChange: (val: string) => void
  register: (val: string, ref: HTMLElement) => void
  unregister: (val: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null,
)

export function RadioGroup({
  value,
  onChange,
  children,
  className,
}: {
  value: string | null
  onChange: (val: string) => void
  children: React.ReactNode
  className?: string
}) {
  const itemsRef = React.useRef<Array<{ val: string; ref: HTMLElement }>>([])

  const register = React.useCallback((val: string, ref: HTMLElement) => {
    itemsRef.current = itemsRef.current
      .filter(i => i.val !== val)
      .concat({ val, ref })
  }, [])

  const unregister = React.useCallback((val: string) => {
    itemsRef.current = itemsRef.current.filter(i => i.val !== val)
  }, [])

  const ctx = React.useMemo(
    () => ({ value, onChange, register, unregister }),
    [value, onChange, register, unregister],
  )

  return (
    <RadioGroupContext.Provider value={ctx}>
      <div
        role='radiogroup'
        className={cn(
          'flex flex-col md:flex-row md:space-x-2 space-y-2 md:space-y-0',
          className,
        )}
      >
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export function RadioItem({
  value,
  children,
  className,
}: {
  value: string
  children: React.ReactNode
  className?: string
}) {
  const ctx = React.useContext(RadioGroupContext)
  if (!ctx) throw new Error('RadioItem must be used within RadioGroup')

  const { value: selected, onChange, register, unregister } = ctx
  const ref = React.useRef<HTMLButtonElement | null>(null)

  React.useEffect(() => {
    if (ref.current) register(value, ref.current)
    return () => unregister(value)
  }, [value, register, unregister])

  const handleKeyDown: React.KeyboardEventHandler = e => {
    const key = e.key
    if (key === ' ' || key === 'Enter') {
      e.preventDefault()
      onChange(value)
      return
    }

    // Arrow navigation
    if (
      key === 'ArrowRight' ||
      key === 'ArrowDown' ||
      key === 'ArrowLeft' ||
      key === 'ArrowUp'
    ) {
      e.preventDefault()
      const items = (
        ref.current?.closest('[role="radiogroup"]') as HTMLElement | null
      )?.querySelectorAll('[role="radio"]')
      if (!items) return
      const arr = Array.from(items) as HTMLElement[]
      const idx = arr.indexOf(ref.current as HTMLElement)
      if (idx === -1) return
      let next = idx
      if (key === 'ArrowRight' || key === 'ArrowDown')
        next = (idx + 1) % arr.length
      if (key === 'ArrowLeft' || key === 'ArrowUp')
        next = (idx - 1 + arr.length) % arr.length
      arr[next].focus()
      const nextVal = arr[next].getAttribute('data-value')
      if (nextVal) onChange(nextVal)
    }
  }

  const isSelected = selected === value

  return (
    <Button asChild variant={isSelected ? 'default' : 'outline'}>
      <button
        ref={ref}
        role='radio'
        aria-checked={isSelected}
        data-value={value}
        tabIndex={isSelected ? 0 : -1}
        onClick={() => onChange(value)}
        onKeyDown={handleKeyDown}
        className={cn(className)}
      >
        {children}
      </button>
    </Button>
  )
}

export default RadioGroup
