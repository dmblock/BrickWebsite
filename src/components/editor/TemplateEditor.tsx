import Editor from '@monaco-editor/react'
import useLocalStorage from '@/lib/useLocalStorage'
import { Button } from '@/components/ui/button'
import { useCallback, useState } from 'react'
import AlertDialog from '@/components/ui/alert-dialog'

export default function TemplateEditor() {
  const [value, setValue, clear] = useLocalStorage<string>(
    'editor:template:draft',
    '',
    500,
  )

  const [openClearDialog, setOpenClearDialog] = useState(false)

  const handleClear = useCallback(() => {
    setOpenClearDialog(true)
  }, [])

  return (
    <div>
      <div className='flex justify-end mb-2'>
        <Button variant='outline' onClick={handleClear}>
          清除草稿
        </Button>
      </div>
      <AlertDialog
        open={openClearDialog}
        onOpenChange={setOpenClearDialog}
        title='清除模板草稿'
        description='确认要清除模板草稿吗？此操作不可撤销。'
        confirmText='清除'
        cancelText='取消'
        onConfirm={() => {
          clear()
          setValue('')
        }}
      />
      <Editor
        height='400px'
        language='shell'
        defaultLanguage='shell'
        theme='vs-dark'
        value={value}
        onChange={v => setValue(v || '')}
        loading={
          <div className='flex items-center justify-center h-32'>
            加载编辑器中...
          </div>
        }
        options={{
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          wordWrap: 'on',
          automaticLayout: true,
        }}
      />
    </div>
  )
}
