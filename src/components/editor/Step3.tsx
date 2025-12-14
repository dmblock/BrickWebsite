import { useState, useEffect, useCallback } from 'react'
// radio component previously used; not needed for current download UI
import { Button } from '@/components/ui/button'
import useLocalStorage from '@/lib/useLocalStorage'
import AlertDialog from '@/components/ui/alert-dialog'
import JSZip from 'jszip'

interface Brick {
  name?: string
  description?: string
  variant?: string
  os?: string
  version?: string
  release?: string
  author?: string
  contact?: string
}

export default function Step3() {
  // downloadOption (content selection) removed; keep downloadMode for packaging
  const [template] = useLocalStorage<string>('editor:template:draft', '', 200)
  const [markdown] = useLocalStorage<string>('editor:markdown:draft', '', 200)
  const [brick] = useLocalStorage<Brick | null>('editor:brick:draft', null, 200)
  const [openAfter, setOpenAfter] = useState(false)
  const [downloadMode, setDownloadMode] = useState<'multiple' | 'zip'>(
    'multiple',
  )

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  const handleDownload = useCallback(() => {
    // prepare contents
    const tpl = template || ''
    const md = markdown || ''
    const b = brick || {
      name: '',
      os: '',
      version: '',
      variant: '',
      description: '',
      release: '',
      author: '',
      contact: '',
    }

    if (downloadMode === 'multiple') {
      downloadFile('template.sh', tpl)
      downloadFile('README.md', md)
      downloadFile('brick.json', JSON.stringify(b, null, 2))
      setOpenAfter(true)
      return
    }

    // zip
    const zip = new JSZip()
    zip.file('template.sh', tpl)
    zip.file('README.md', md)
    zip.file('brick.json', JSON.stringify(b, null, 2))
    const safeName = ((b && b.name) || 'brick').replace(/[^a-zA-Z0-9-_.]/g, '_')
    const safeRelease = ((b && b.release) || 'release').replace(
      /[^a-zA-Z0-9-_.]/g,
      '_',
    )
    const zipName = `brick_${safeName}_${safeRelease}.zip`
    zip.generateAsync({ type: 'blob' }).then((blob: Blob) => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = zipName
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
      setOpenAfter(true)
    })
  }, [template, markdown, brick, downloadMode])

  useEffect(() => {
    const onDownload = () => {
      handleDownload()
    }
    window.addEventListener('download:build', onDownload as EventListener)
    return () =>
      window.removeEventListener('download:build', onDownload as EventListener)
  }, [handleDownload])

  return (
    <div className='space-y-4'>
      <h3 className='text-lg font-semibold'>下载构建产物</h3>
      <div className='space-y-4'>
        <div className='p-4 border rounded-lg bg-muted/50'>
          <h4 className='font-medium mb-2'>构建状态</h4>
          <div className='flex items-center space-x-2'>
            <div className='w-3 h-3 bg-primary rounded-full animate-pulse'></div>
            <span className='text-sm'>构建完成</span>
          </div>
        </div>

        <div className='space-y-2'>
          <label className='text-sm font-medium'>下载方式</label>
          <div className='flex items-center gap-2'>
            <Button
              variant={downloadMode === 'multiple' ? 'default' : 'outline'}
              onClick={() => setDownloadMode('multiple')}
            >
              多个文件
            </Button>
            <Button
              variant={downloadMode === 'zip' ? 'default' : 'outline'}
              onClick={() => setDownloadMode('zip')}
            >
              压缩包
            </Button>
          </div>
        </div>

        {/* 下载由外部触发（Editor 的完成/下载按钮）控制 */}
        <AlertDialog
          open={openAfter}
          onOpenChange={setOpenAfter}
          title='已生成文件'
          description={
            <>
              <p>
                三份文件已准备下载：`template.sh`、`README.md`、`brick.json`。
              </p>
              <p className='mt-2'>
                请手动将这些文件上传到仓库的目标路径（示例）：
              </p>
              <pre className='mt-2 p-2 bg-muted/20 rounded'>
                /index/{brick?.os || '<os>'}/{brick?.version || '<version>'}/
                {brick?.variant || '<variant>'}
              </pre>
              <p className='mt-2'>
                注意：上传必须由用户手动完成，前端无法直接推送到仓库。
              </p>
            </>
          }
          confirmText='我已知晓'
        />
      </div>
    </div>
  )
}
