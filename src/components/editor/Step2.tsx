import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  FolderOpen,
  FileText,
  Code,
  Package,
  Tag,
  User,
  Mail,
} from 'lucide-react'
import useLocalStorage from '@/lib/useLocalStorage'
import { useCallback, useState } from 'react'
import AlertDialog from '@/components/ui/alert-dialog'

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

function IndexGenerator() {
  // No default values for Step2; start with an empty draft
  const [brick, setBrick, clear] = useLocalStorage<Brick>(
    'editor:brick:draft',
    {},
    300,
  )

  const [openClearDialog, setOpenClearDialog] = useState(false)

  const update = useCallback(
    (key: string, val: string) => {
      setBrick((prev: Brick) => ({ ...(prev || {}), [key]: val }))
    },
    [setBrick],
  )

  const generateJSON = useCallback(() => {
    try {
      const json = JSON.stringify(brick || {}, null, 2)
      return json
    } catch {
      return '{}'
    }
  }, [brick])

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* 项目基本信息组 */}
        <div className='space-y-4'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <FolderOpen className='w-4 h-4 text-primary' />
              <Label htmlFor='projectName'>项目名称</Label>
            </div>
            <Textarea
              placeholder='请输入您的项目名称，仅限英文及英文字符'
              id='projectName'
              className='mt-1'
              value={brick?.name || ''}
              onChange={e => update('name', e.target.value)}
            />
          </div>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <FileText className='w-4 h-4 text-primary' />
              <Label htmlFor='projectDescription'>项目描述</Label>
            </div>
            <Textarea
              placeholder='请输入您的项目描述，填入字符串'
              id='projectDescription'
              className='mt-1'
              rows={3}
              value={brick?.description || ''}
              onChange={e => update('description', e.target.value)}
            />
          </div>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Code className='w-4 h-4 text-primary' />
              <Label htmlFor='projectVariant'>项目变种</Label>
            </div>
            <Textarea
              placeholder='请输入您的项目变种，仅限英文小写及下划线，如(game_minecraft_java_server_paper)'
              id='projectVariant'
              className='mt-1'
              value={brick?.variant || ''}
              onChange={e => update('variant', e.target.value)}
            />
          </div>
        </div>

        {/* 系统信息组 */}
        <div className='space-y-4'>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Package className='w-4 h-4 text-primary' />
              <Label htmlFor='baseSystem'>基本系统</Label>
            </div>
            <Textarea
              placeholder='输入基本系统，必须为存在于lxc镜像站中的系统'
              id='baseSystem'
              className='mt-1'
              value={brick?.os || ''}
              onChange={e => update('os', e.target.value)}
            />
          </div>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Tag className='w-4 h-4 text-primary' />
              <Label htmlFor='systemVersion'>系统版本</Label>
            </div>
            <Textarea
              placeholder='请输入系统版本，仅限数字'
              id='systemVersion'
              className='mt-1'
              value={brick?.version || ''}
              onChange={e => update('version', e.target.value)}
            />
          </div>
          <div>
            <div className='flex items-center gap-2 mb-1'>
              <Tag className='w-4 h-4 text-primary' />
              <Label htmlFor='releaseVersion'>发行版本</Label>
            </div>
            <Textarea
              placeholder='请输入您的项目发行版本，仅限英文或数字,如(v1.0,1.0,v1.0-beta)'
              id='releaseVersion'
              className='mt-1'
              value={brick?.release || ''}
              onChange={e => update('release', e.target.value)}
            />
          </div>
        </div>

        {/* 作者信息组 - 全宽 */}
        <div className='md:col-span-2 space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <User className='w-4 h-4 text-primary' />
                <Label htmlFor='author'>作者</Label>
              </div>
              <Textarea
                placeholder='请输入项目作者，要求括号中为git仓库用户名，如:(lantiancloud)蓝天云技术团队'
                id='author'
                className='mt-1'
                value={brick?.author || ''}
                onChange={e => update('author', e.target.value)}
              />
            </div>
            <div>
              <div className='flex items-center gap-2 mb-1'>
                <Mail className='w-4 h-4 text-primary' />
                <Label htmlFor='contact'>联系方式</Label>
              </div>
              <Textarea
                placeholder='请输入您的联系方式，可填入任意字符串'
                id='contact'
                className='mt-1'
                value={brick?.contact || ''}
                onChange={e => update('contact', e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <Label>brick.json 预览</Label>
        <pre className='p-4 mt-2 rounded bg-muted/20 text-sm overflow-auto'>
          {generateJSON()}
        </pre>
        <div className='mt-3 flex gap-2'>
          <Button variant='outline' onClick={() => setOpenClearDialog(true)}>
            清空草稿
          </Button>
          <AlertDialog
            open={openClearDialog}
            onOpenChange={setOpenClearDialog}
            title='清空 brick 草稿'
            description='确认要清空 brick 草稿吗？此操作会删除本地保存的所有 brick 字段。'
            confirmText='清空'
            cancelText='取消'
            onConfirm={() => {
              clear()
              setBrick({})
            }}
          />
        </div>
      </div>
    </>
  )
}

export default function Step2() {
  return (
    <>
      <div className='space-y-6'>
        {/* 标题区域 */}
        <div className='flex items-center gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20'>
            <FileText className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h3 className='text-xl font-semibold text-foreground'>
              创建模板索引
            </h3>
            <p className='text-sm text-muted-foreground'>
              配置项目信息和系统要求，生成完整的模板索引
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>索引生成器</CardTitle>
            <CardDescription>
              使用索引生成器，可以轻松创建模板索引
            </CardDescription>
          </CardHeader>
          <CardContent>
            <IndexGenerator />
          </CardContent>
          <Separator />
        </Card>
      </div>
    </>
  )
}
