import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Box, Download, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import axios from 'axios'

// 定义应用类型
interface AppItem {
  name: string
  description: string
  variant: string
  os: string
  version: string
  release: string
  contact: string
  author: string
}

// 从 localStorage 读取设置
const getSettings = () => {
  try {
    const saved = localStorage.getItem('app_settings')
    if (saved) {
      return JSON.parse(saved)
    }
  } catch (e) {
    console.error('Failed to parse settings', e)
  }
  return null
}

export default function MarketDetail() {
  const { os, version, variant } = useParams<{
    os: string
    version: string
    variant: string
  }>()
  const navigate = useNavigate()
  const [app, setApp] = useState<AppItem | null>(null)
  const [markdownContent, setMarkdownContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchAppDetails = async () => {
      setLoading(true)
      const settings = getSettings()
      if (!settings) {
        setError('请先配置设置')
        setLoading(false)
        return
      }

      try {
        // 获取索引列表
        const proxy = settings.corsProxyEndpoint
        const indexUrl = settings.brickIndex
        const url = proxy ? `${proxy}/${indexUrl}` : indexUrl
        const response = await axios.get(url)
        const apps: AppItem[] = response.data
        const found = apps.find(
          a => a.os === os && a.version === version && a.variant === variant,
        )
        if (!found) {
          setError('未找到该应用')
          setApp(null)
        } else {
          setApp(found)
          // 获取 README.md
          const repoUrl = settings.repoUrl
          const readmeUrl = `${proxy}/${repoUrl}/raw/branch/main/index/${os}/${version}/${variant}/README.md`
          try {
            const readmeResponse = await axios.get(readmeUrl)
            setMarkdownContent(readmeResponse.data)
          } catch (e) {
            console.warn('无法加载 README', e)
            setMarkdownContent('*暂无文档*')
          }
        }
      } catch (err) {
        console.error('获取应用详情失败', err)
        setError('加载失败，请检查网络和配置')
      } finally {
        setLoading(false)
      }
    }

    fetchAppDetails()
  }, [os, version, variant])

  const handleDownload = async () => {
    if (!app) return
    const settings = getSettings()
    if (!settings) {
      console.warn('未找到设置，请先配置')
      // 可以跳转到设置页面，这里先打开原始 URL
      const repoUrl = 'https://codespace.lantian.pro/LantianCloud/BrickHub'
      const downloadUrl = `${repoUrl}/raw/branch/main/index/${app.os}/${app.version}/${app.variant}/template.sh`
      window.open(downloadUrl, '_blank')
      return
    }
    const proxy = settings.corsProxyEndpoint
    const repoUrl =
      settings.repoUrl || 'https://codespace.lantian.pro/LantianCloud/BrickHub'
    // 构建下载 URL，如果存在代理则使用代理
    const downloadUrl = proxy
      ? `${proxy}/${repoUrl}/raw/branch/main/index/${app.os}/${app.version}/${app.variant}/template.sh`
      : `${repoUrl}/raw/branch/main/index/${app.os}/${app.version}/${app.variant}/template.sh`

    try {
      // 使用 fetch 获取文件内容
      console.log('下载 URL:', downloadUrl)
      const response = await fetch(downloadUrl)
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }
      const blob = await response.blob()
      // 创建临时链接
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `template.sh`
      document.body.appendChild(a)
      a.click()
      // 清理
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('下载失败，尝试打开新窗口', error)
      // 如果 fetch 失败，回退到打开新窗口
      window.open(downloadUrl, '_blank')
    }
  }

  const handleBack = () => {
    navigate('/market')
  }

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        <Button variant='outline' onClick={handleBack} className='mb-6 gap-2'>
          <ArrowLeft className='h-4 w-4' />
          返回市场
        </Button>
        <Card>
          <CardHeader>
            <Skeleton className='h-8 w-3/4' />
            <Skeleton className='h-4 w-1/2' />
          </CardHeader>
          <CardContent className='space-y-4'>
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-full' />
            <Skeleton className='h-4 w-2/3' />
          </CardContent>
          <CardFooter>
            <Skeleton className='h-10 w-32' />
          </CardFooter>
        </Card>
      </div>
    )
  }

  if (error || !app) {
    return (
      <div className='container mx-auto p-6'>
        <Button variant='outline' onClick={handleBack} className='mb-6 gap-2'>
          <ArrowLeft className='h-4 w-4' />
          返回市场
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>错误</CardTitle>
            <CardDescription>{error || '应用不存在'}</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleBack}>返回市场</Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      <Button variant='outline' onClick={handleBack} className='mb-6 gap-2'>
        <ArrowLeft className='h-4 w-4' />
        返回市场
      </Button>

      <Card className='mb-8'>
        <CardHeader>
          <div className='flex items-start justify-between'>
            <div>
              <CardTitle className='flex items-center gap-3 text-2xl'>
                <Box className='h-6 w-6 text-primary' />
                {app.name}
              </CardTitle>
              <CardDescription className='mt-2'>
                {app.description}
              </CardDescription>
            </div>
            <Badge variant='secondary'>{app.release}</Badge>
          </div>
        </CardHeader>
        <CardContent className='space-y-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>操作系统</p>
              <p className='font-semibold'>
                {app.os} {app.version}
              </p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>变体</p>
              <p className='font-semibold'>{app.variant}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>作者</p>
              <p className='font-semibold'>{app.author}</p>
            </div>
            <div className='space-y-1'>
              <p className='text-sm text-muted-foreground'>联系方式</p>
              <p className='font-semibold'>{app.contact}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className='text-lg font-semibold mb-4'>模板说明</h3>
            <div className='prose prose-sm dark:prose-invert max-w-none'>
              <MarkdownRenderer content={markdownContent} />
            </div>
          </div>
        </CardContent>
        <CardFooter className='flex justify-between'>
          <Button variant='outline' onClick={handleBack}>
            返回
          </Button>
          <Button onClick={handleDownload} className='gap-2'>
            <Download className='h-4 w-4' />
            下载模板
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
