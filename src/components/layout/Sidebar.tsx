import {
  Home,
  Box,
  BookOpenText,
  Settings,
  LayoutGrid,
  Code,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
  SidebarInset,
} from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { useNavigate } from 'react-router-dom'

// 导航项类型
interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
  badge?: string | number
}

// 导航菜单项
const navItems: NavItem[] = [
  {
    title: '主页',
    url: '/',
    icon: Home,
  },
  {
    title: '使用文档',
    url: '/doc',
    icon: BookOpenText,
  },
  {
    title: '模板编辑器',
    url: '/editor',
    icon: Code,
  },
  {
    title: '应用市场',
    url: '/market',
    icon: LayoutGrid,
  },
]

// 系统设置项
const systemItems: NavItem[] = [
  {
    title: '系统设置',
    url: '/settings',
    icon: Settings,
  },
]

// 项目列表

export function AppSidebar() {
  const navigate = useNavigate()

  return (
    <Sidebar className='overflow-x-hidden'>
      <SidebarHeader>
        <div className='p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10'>
              <Box className='h-6 w-6 text-primary' />
            </div>
            <div className='flex flex-col'>
              <h1 className='text-lg font-bold'>BrickEngine</h1>
              <p className='text-xs text-muted-foreground'>v2.0.0</p>
            </div>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className='overflow-x-hidden'>
        {/* 主导航 */}
        <SidebarGroup>
          <SidebarGroupLabel>导航</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={item.title === '主页'}>
                    <button
                      onClick={() => navigate(item.url)}
                      className='w-full text-left flex items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md'
                    >
                      <item.icon className='h-4 w-4' />
                      <span>{item.title}</span>
                      {item.badge && (
                        <Badge variant='secondary' className='ml-auto'>
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* 系统设置 */}
        <SidebarGroup>
          <SidebarGroupLabel>设置</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => navigate(item.url)}
                      className='w-full text-left flex items-center gap-2 p-2 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground rounded-md'
                    >
                      <item.icon className='h-4 w-4' />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className='p-4 text-center'>
          <p className='text-xs text-muted-foreground'>
            © {new Date().getFullYear()} BrickEngine. 版权所有
          </p>
          <p className='text-xs text-muted-foreground mt-1'>v2.0.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}

// 主侧边栏组件，包含Provider
export default function SidebarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const defaultOpen = (() => {
    if (typeof window === 'undefined') return true
    const path = window.location.pathname
    // 侧边栏在首页、编辑器页面、文档页面默认关闭
    if (path === '/' || path.startsWith('/editor') || path.startsWith('/doc')) {
      return false
    }
    // 其他页面默认打开
    return true
  })()

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  )
}

// 独立的侧边栏触发器组件
export function SidebarToggle() {
  return <SidebarTrigger />
}
