import '@/App.css'
import { RouterProvider } from 'react-router-dom'
import { Suspense, useEffect, useState } from 'react'
import { routes } from '@/router'
import { ThemeProvider } from '@/components/theme-provider'
import { Rocket } from 'lucide-react'

// 加载中文本的点动画组件
function LoadingDots() {
  const [dots, setDots] = useState('')

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 3) return ''
        return prev + '.'
      })
    }, 500)
    return () => clearInterval(interval)
  }, [])

  return <span>{dots}</span>
}

// 自定义加载骨架屏
function LoadingFallback() {
  return (
    <div className='flex h-screen flex-col items-center justify-center animate-fade-in'>
      <div className='w-full max-w-md space-y-8'>
        {/* 火箭动画 */}
        <div className='flex justify-center'>
          <Rocket className='w-24 h-24 md:w-32 md:h-32 text-primary animate-bounce' />
        </div>

        {/* 不确定进度条 - 修复移动端x方向过长 */}
        <div className='w-full space-y-4'>
          <div className='relative h-2 w-full overflow-hidden rounded-full bg-secondary'>
            <div className='absolute inset-y-0 left-0 w-1/4 md:w-1/3 animate-indeterminate-progress rounded-full bg-primary' />
          </div>
          <div className='text-center text-lg font-medium text-foreground'>
            加载中
            <LoadingDots />
          </div>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <Suspense fallback={<LoadingFallback />}>
        <RouterProvider router={routes} />
      </Suspense>
    </ThemeProvider>
  )
}
