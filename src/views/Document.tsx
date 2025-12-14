import { useState, useEffect } from 'react'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import axios from 'axios'

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

// 设置类型
interface AppSettings {
  corsProxyEndpoint: string
  brickIndex: string
  repoUrl: string
  docBaseUrl: string
}

// 获取默认文档URL
const getDefaultDocUrl = (settings: AppSettings | null): string => {
  // 默认文档路径
  const defaultDocPath = '/docs/README.md'

  if (!settings || !settings.docBaseUrl) {
    // 使用默认URL作为后备
    return `https://codespace.lantian.pro/LantianCloud/Brick/raw/branch/main${defaultDocPath}`
  }

  // 构建文档URL
  let docUrl = settings.docBaseUrl
  if (!docUrl.endsWith('/')) {
    docUrl += '/'
  }
  docUrl += defaultDocPath.replace(/^\//, '') // 移除开头的斜杠

  // 如果有CORS代理，使用代理（参照MarketDetail.tsx的模式）
  if (settings.corsProxyEndpoint) {
    // 检查docUrl是否是完整URL
    try {
      const urlObj = new URL(docUrl)
      // 如果是完整URL，提取路径部分（从主机名后开始）
      const pathWithProtocol = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`
      docUrl = `${settings.corsProxyEndpoint}/${pathWithProtocol}`
    } catch {
      // 如果不是完整URL，直接拼接
      docUrl = `${settings.corsProxyEndpoint}/${docUrl}`
    }
  }

  return docUrl
}

export default function Doc() {
  const [content, setContent] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const fetchDocContent = async () => {
      setLoading(true)
      setError(null)

      try {
        const settings = getSettings() as AppSettings | null
        const docUrl = getDefaultDocUrl(settings)

        console.log('Fetching default doc from:', docUrl)
        const response = await axios.get(docUrl, {
          timeout: 10000,
          headers: {
            Accept: 'text/plain',
          },
        })

        if (response.status === 200 && typeof response.data === 'string') {
          setContent(response.data)
        } else {
          setError('文档内容格式错误')
        }
      } catch (error: unknown) {
        console.error('Failed to fetch document:', error)
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          setError('默认文档未找到: /docs/README.md')
        } else if (axios.isAxiosError(error) && error.code === 'ECONNABORTED') {
          setError('请求超时，请检查网络连接')
        } else {
          setError(
            '加载文档失败：' +
              (error instanceof Error ? error.message : '未知错误'),
          )
        }
      } finally {
        setLoading(false)
      }
    }

    fetchDocContent()
  }, [])

  if (error) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-2xl font-bold mb-4'>文档</h1>
          <div className='text-red-500 p-4 border border-red-200 rounded-lg bg-red-50'>
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-2xl font-bold mb-4'>文档</h1>
          <div className='text-muted-foreground'>加载中...</div>
        </div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className='min-h-screen bg-background p-8'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-2xl font-bold mb-4'>文档</h1>
          <div className='text-muted-foreground'>文档内容为空</div>
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <header className='border-b p-4'>
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-2xl font-bold'>文档</h1>
          <p className='text-muted-foreground'>/docs/README.md</p>
        </div>
      </header>
      <main className='p-4'>
        <div className='max-w-4xl mx-auto'>
          <div className='bg-card border rounded-lg shadow-sm overflow-hidden'>
            <MarkdownRenderer content={content} />
          </div>
        </div>
      </main>
    </div>
  )
}
