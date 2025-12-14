import {
  Settings2,
  Globe,
  Package,
  GitBranch,
  FileText,
  Save,
  RotateCcw,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useState } from 'react'

// 默认值（使用 placeholder 中的值）
const DEFAULT_VALUES = {
  corsProxyEndpoint: 'https://corsproxy.lantian.pro',
  brickIndex:
    'https://codespace.lantian.pro/LantianCloud/BrickHub/raw/branch/main/index.json',
  repoUrl: 'https://codespace.lantian.pro/LantianCloud/BrickHub',
  docBaseUrl:
    'https://codespace.lantian.pro/LantianCloud/Brick/raw/branch/main/docs',
} as const

// 从环境变量读取默认值（备用）
const ENV_CORS_PROXY_ENDPOINT =
  import.meta.env.VITE_CORS_PROXY_ENDPOINT || DEFAULT_VALUES.corsProxyEndpoint
const ENV_BRICK_INDEX =
  import.meta.env.VITE_BRICK_INDEX || DEFAULT_VALUES.brickIndex
const ENV_REPO_URL = import.meta.env.VITE_REPO_URL || DEFAULT_VALUES.repoUrl
const ENV_DOC_BASE_URL =
  import.meta.env.VITE_DOC_BASE_URL || DEFAULT_VALUES.docBaseUrl

// localStorage 键名
const SETTINGS_KEY = 'app_settings'

interface AppSettings {
  corsProxyEndpoint: string
  brickIndex: string
  repoUrl: string
  docBaseUrl: string
}

export default function Settings() {
  // 从 localStorage 加载初始设置
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error('Failed to parse saved settings', e)
    }
    // 如果 localStorage 中没有，则使用环境变量默认值
    return {
      corsProxyEndpoint: ENV_CORS_PROXY_ENDPOINT,
      brickIndex: ENV_BRICK_INDEX,
      repoUrl: ENV_REPO_URL,
      docBaseUrl: ENV_DOC_BASE_URL,
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>(
    'idle',
  )

  const handleSave = () => {
    setIsSaving(true)
    setSaveStatus('idle')
    try {
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings))
      setSaveStatus('success')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (e) {
      console.error('Failed to save settings', e)
      setSaveStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setSettings({
      corsProxyEndpoint: DEFAULT_VALUES.corsProxyEndpoint,
      brickIndex: DEFAULT_VALUES.brickIndex,
      repoUrl: DEFAULT_VALUES.repoUrl,
      docBaseUrl: DEFAULT_VALUES.docBaseUrl,
    })
  }

  const handleChange =
    (field: keyof AppSettings) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSettings(prev => ({ ...prev, [field]: e.target.value }))
    }

  return (
    <div className='max-w-4xl mx-auto p-6 space-y-8'>
      {/* 标题区域 */}
      <div className='flex items-center gap-4'>
        <div className='flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 dark:bg-primary/20'>
          <Settings2 className='h-6 w-6 text-primary' />
        </div>
        <div>
          <h1 className='text-3xl font-bold tracking-tight text-foreground'>
            系统设置
          </h1>
          <p className='text-muted-foreground'>配置应用商店所需内容</p>
        </div>
      </div>

      <Separator />

      {/* 设置卡片 */}
      <Card>
        <CardHeader>
          <CardTitle>基础配置</CardTitle>
          <CardDescription>
            以下配置用于系统核心功能,若您不知道如何修改，请使用默认值
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* 跨域代理地址 */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5'>
                <Globe className='h-5 w-5 text-primary' />
              </div>
              <div className='flex-1'>
                <Label
                  htmlFor='corsProxyEndpoint'
                  className='text-base font-medium'
                >
                  跨域代理地址
                </Label>
                <p className='text-sm text-muted-foreground'>
                  用于跨域请求的代理地址，可以解决跨域策略问题
                </p>
              </div>
            </div>
            <Input
              id='corsProxyEndpoint'
              value={settings.corsProxyEndpoint}
              onChange={handleChange('corsProxyEndpoint')}
              placeholder={DEFAULT_VALUES.corsProxyEndpoint}
              className='text-foreground'
            />
          </div>

          <Separator />

          {/* 应用市场索引 */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5'>
                <Package className='h-5 w-5 text-primary' />
              </div>
              <div className='flex-1'>
                <Label htmlFor='brickIndex' className='text-base font-medium'>
                  应用市场索引
                </Label>
                <p className='text-sm text-muted-foreground'>
                  应用市场索引地址
                </p>
              </div>
            </div>
            <Input
              id='brickIndex'
              value={settings.brickIndex}
              onChange={handleChange('brickIndex')}
              placeholder={DEFAULT_VALUES.brickIndex}
              className='text-foreground'
            />
          </div>

          <Separator />

          {/* 仓库地址 */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5'>
                <GitBranch className='h-5 w-5 text-primary' />
              </div>
              <div className='flex-1'>
                <Label htmlFor='repoUrl' className='text-base font-medium'>
                  仓库地址
                </Label>
                <p className='text-sm text-muted-foreground'>模板仓库地址</p>
              </div>
            </div>
            <Input
              id='repoUrl'
              value={settings.repoUrl}
              onChange={handleChange('repoUrl')}
              placeholder={DEFAULT_VALUES.repoUrl}
              className='text-foreground'
            />
          </div>

          <Separator />

          {/* 文档基础地址 */}
          <div className='space-y-4'>
            <div className='flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5'>
                <FileText className='h-5 w-5 text-primary' />
              </div>
              <div className='flex-1'>
                <Label htmlFor='docBaseUrl' className='text-base font-medium'>
                  文档基础地址
                </Label>
                <p className='text-sm text-muted-foreground'>
                  文档基础地址，用于加载帮助文档（如：
                  {DEFAULT_VALUES.docBaseUrl}/intro.md）
                </p>
              </div>
            </div>
            <Input
              id='docBaseUrl'
              value={settings.docBaseUrl}
              onChange={handleChange('docBaseUrl')}
              placeholder={DEFAULT_VALUES.docBaseUrl}
              className='text-foreground'
            />
          </div>
        </CardContent>
        <CardFooter className='flex flex-col items-start gap-4 border-t bg-muted/50 px-6 py-4'>
          <div className='text-sm text-muted-foreground'>
            <p>
              • 设置仅保存在当前浏览器的本地存储中，清除浏览器数据会丢失设置
            </p>
            <p>• 如果您遇到了问题，可以点击"恢复默认值"按钮重置</p>
          </div>
          <div className='flex w-full items-center justify-between'>
            <div className='text-sm'>
              <span className='font-medium'>当前存储状态：</span>
              {saveStatus === 'success' ? (
                <span className='text-green-600'>已同步到本地存储</span>
              ) : saveStatus === 'error' ? (
                <span className='text-red-600'>同步失败</span>
              ) : (
                <span className='text-amber-600'>未保存更改</span>
              )}
            </div>
            <div className='flex items-center gap-3'>
              <Button onClick={handleReset} variant='outline' className='gap-2'>
                <RotateCcw className='h-4 w-4' />
                恢复默认值
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                size='lg'
                className='gap-2'
              >
                <Save className='h-4 w-4' />
                {isSaving ? '保存中...' : '保存'}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
