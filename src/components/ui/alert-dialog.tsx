import * as React from 'react'
import { Button } from './button'

type AlertDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: React.ReactNode
  description?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
}

export default function AlertDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
}: AlertDialogProps) {
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) onOpenChange(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center'>
      <div
        className='absolute inset-0 bg-black/50'
        onClick={() => onOpenChange(false)}
      />
      <div className='relative z-10 w-full max-w-lg rounded-lg bg-card p-6 shadow-lg'>
        {title && <h3 className='text-lg font-semibold'>{title}</h3>}
        {description && (
          <p className='mt-2 text-sm text-muted-foreground'>{description}</p>
        )}
        <div className='mt-6 flex justify-end gap-2'>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            {cancelText}
          </Button>
          <Button
            onClick={() => {
              onConfirm?.()
              onOpenChange(false)
            }}
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  )
}
