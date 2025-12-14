import { Box, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ModeToggle } from '@/components/mode-toggle'
import { useSidebar } from '@/components/ui/sidebar'
import { useNavigate } from 'react-router-dom'

export default function Header() {
  const { toggleSidebar } = useSidebar()
  const navigate = useNavigate()

  return (
    <header className='sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 animate-fade-in'>
      <div className='w-full flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8'>
        {/* Left: Sidebar toggle and Logo */}
        <div className='flex items-center gap-3'>
          <Button
            variant='outline'
            size='icon'
            className='h-9 w-9 sm:h-10 sm:w-10 border-border hover-lift transition-all duration-300'
            onClick={toggleSidebar}
            aria-label='Open sidebar'
          >
            <Menu className='h-4 w-4 sm:h-5 sm:w-5' />
          </Button>
          <button
            onClick={() => navigate('/')}
            className='bg-transparent border-none p-0 cursor-pointer'
          >
            <div className='flex items-center gap-3'>
              <div className='flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 hover-lift transition-all duration-300'>
                <Box className='h-5 w-5 sm:h-6 sm:w-6 text-primary' />
              </div>
              <div className='flex flex-col'>
                <h1 className='text-lg sm:text-xl font-bold tracking-tight text-foreground'>
                  BrickEngine
                </h1>
                <p className='text-xs text-muted-foreground hidden xs:block'>
                  轻量应用容器引擎(LCAC)
                </p>
              </div>
            </div>
          </button>
        </div>

        {/* Right: Theme toggle and optional navigation */}
        <div className='flex items-center gap-2 sm:gap-3'>
          <nav className='hidden md:flex items-center gap-4 mr-4'>
            <button
              onClick={() => navigate('/')}
              className='text-sm font-medium hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer'
            >
              首页
            </button>
            <button
              onClick={() => navigate('/editor')}
              className='text-sm font-medium hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer'
            >
              编辑器
            </button>
            <button
              onClick={() => navigate('/settings')}
              className='text-sm font-medium hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer'
            >
              设置
            </button>
            <button
              onClick={() => navigate('/doc')}
              className='text-sm font-medium hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer'
            >
              文档
            </button>
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}
