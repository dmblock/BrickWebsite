import { useRef, useState } from 'react'
import MDEditor from '@uiw/react-md-editor'
import '@uiw/react-md-editor/markdown-editor.css'
import '@uiw/react-markdown-preview/markdown.css'
import {
  Bold,
  Italic,
  Heading1,
  Code,
  SquareCode,
  List,
  Eye,
  Edit3,
} from 'lucide-react'

import useLocalStorage from '@/lib/useLocalStorage'
import { Button } from '@/components/ui/button'
import AlertDialog from '@/components/ui/alert-dialog'

export default function MarkDownEditor() {
  const defaultText = ''
  const [value, setValue, clear] = useLocalStorage<string>(
    'editor:markdown:draft',
    defaultText,
    500,
  )
  const [openClearDialog, setOpenClearDialog] = useState(false)
  const [isPreview, setIsPreview] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null)

  const insertMarkdown = (syntax: string) => {
    if (editorRef.current) {
      const textarea = editorRef.current.textarea
      if (textarea) {
        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const selectedText = value.substring(start, end)
        const newText =
          value.substring(0, start) +
          syntax +
          selectedText +
          syntax +
          value.substring(end)
        setValue(newText)

        // 设置光标位置
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(
            start + syntax.length,
            start + syntax.length + selectedText.length,
          )
        }, 0)
      }
    }
  }

  const insertBlock = (syntax: string) => {
    const newValue = value + '\n' + syntax + '\n'
    setValue(newValue)
  }

  const insertHeading = () => {
    if (editorRef.current) {
      const textarea = editorRef.current.textarea
      if (textarea) {
        const start = textarea.selectionStart
        const newText =
          value.substring(0, start) + '# ' + value.substring(start)
        setValue(newText)

        // 设置光标位置
        setTimeout(() => {
          textarea.focus()
          textarea.setSelectionRange(start + 2, start + 2)
        }, 0)
      }
    }
  }

  return (
    <div className='w-full'>
      <div className='flex flex-col gap-2 sm:flex-row sm:justify-between mb-4 p-4 border rounded-lg shadow-md bg-card'>
        {/* 工具栏按钮组，移动端可横向滚动 */}
        <div className='flex overflow-x-auto flex-nowrap max-w-full min-w-0 sm:overflow-visible sm:flex-wrap sm:max-w-none'>
          <div className='flex gap-2 min-w-max'>
            {!isPreview && (
              <>
                <button
                  className='px-3 py-2 border rounded hover:bg-accent flex items-center gap-1 whitespace-nowrap'
                  onClick={() => insertMarkdown('**')}
                  title='加粗'
                >
                  <Bold size={16} className='text-primary' />
                  <span className='text-sm'>加粗</span>
                </button>
                <button
                  className='px-3 py-2 border rounded hover:bg-accent flex items-center gap-1 whitespace-nowrap'
                  onClick={() => insertMarkdown('*')}
                  title='斜体'
                >
                  <Italic size={16} className='text-primary' />
                  <span className='text-sm'>斜体</span>
                </button>
                <button
                  className='px-3 py-2 border rounded hover:bg-accent flex items-center gap-1 whitespace-nowrap'
                  onClick={insertHeading}
                  title='标题'
                >
                  <Heading1 size={16} className='text-primary' />
                  <span className='text-sm'>标题</span>
                </button>
                <button
                  className='px-3 py-2 border rounded hover:bg-accent flex items-center gap-1 whitespace-nowrap'
                  onClick={() => insertMarkdown('`')}
                  title='行内代码'
                >
                  <Code size={16} className='text-primary' />
                  <span className='text-sm'>代码</span>
                </button>
                <button
                  className='px-3 py-2 border rounded hover:bg-accent flex items-center gap-1 whitespace-nowrap'
                  onClick={() => insertBlock('```\n\n```')}
                  title='代码块'
                >
                  <SquareCode size={16} className='text-primary' />
                  <span className='text-sm'>代码块</span>
                </button>
                <button
                  className='px-3 py-2 border rounded hover:bg-accent flex items-center gap-1 whitespace-nowrap'
                  onClick={() => insertMarkdown('- ')}
                  title='列表'
                >
                  <List size={16} className='text-primary' />
                  <span className='text-sm'>列表</span>
                </button>
              </>
            )}
          </div>
        </div>
        <div className='flex space-x-2 items-center mt-2 sm:mt-0'>
          <div className='flex items-center gap-2'>
            <Button
              className='flex items-center space-x-2'
              onClick={() => setIsPreview(false)}
            >
              <Edit3 size={16} className='text-current' />
              <span>编辑</span>
            </Button>
            <Button
              variant={isPreview ? 'default' : 'outline'}
              className='flex items-center space-x-2'
              onClick={() => setIsPreview(true)}
            >
              <Eye size={16} className='text-current' />
              <span>预览</span>
            </Button>
          </div>
        </div>
      </div>
      {/* 新增：清除草稿按钮单独一行 */}
      <div className='w-full mb-4'>
        <Button
          variant='outline'
          onClick={() => setOpenClearDialog(true)}
          className='w-full'
        >
          清除草稿
        </Button>
        <AlertDialog
          open={openClearDialog}
          onOpenChange={setOpenClearDialog}
          title='清除本地草稿'
          description='确认要清除本地草稿并恢复默认吗？此操作不可撤销。'
          confirmText='清除'
          cancelText='取消'
          onConfirm={() => {
            clear()
            setValue('')
          }}
        />
      </div>
      {isPreview ? (
        <div
          data-color-mode='light'
          className='border rounded-lg p-4 min-h-[200px] bg-card'
        >
          <MDEditor.Markdown source={value} />
        </div>
      ) : (
        <MDEditor
          className='w-full'
          height={400}
          value={value}
          onChange={newValue => setValue(newValue || '')}
          hideToolbar
          preview='edit'
          ref={editorRef}
        />
      )}
    </div>
  )
}
