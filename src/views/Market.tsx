import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Box, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import AlertDialog from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
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

// 定义设置类型
interface AppSettings {
  corsProxyEndpoint: string
  brickIndex: string
  repoUrl: string
}

// 从 localStorage 读取设置
const getSettings = (): AppSettings | null => {
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

export default function Market() {
  const navigate = useNavigate()
  const [showConfigDialog, setShowConfigDialog] = useState(false)
  const [apps, setApps] = useState<AppItem[]>([])
  const [filteredApps, setFilteredApps] = useState<AppItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [currentPage, setCurrentPage] = useState(1)

  // 检查设置
  useEffect(() => {
    const savedSettings = getSettings()
    console.log('Loaded settings:', savedSettings)
    if (
      !savedSettings ||
      !savedSettings.corsProxyEndpoint ||
      !savedSettings.brickIndex ||
      !savedSettings.repoUrl
    ) {
      console.log('Missing settings, showing dialog')
      setShowConfigDialog(true)
    } else {
      fetchIndex(savedSettings)
    }
  }, [])

  // 获取索引
  const fetchIndex = async (settings: AppSettings) => {
    setLoading(true)
    try {
      // 使用 corsProxyEndpoint 代理请求 brickIndex
      const proxy = settings.corsProxyEndpoint
      const indexUrl = settings.brickIndex
      const url = proxy ? `${proxy}/${indexUrl}` : indexUrl
      console.log('Fetching index from:', url)
      const response = await axios.get(url)
      setApps(response.data)
      setFilteredApps(response.data)
    } catch (error) {
      console.error('Failed to fetch index', error)
      // 加载失败，可能是配置问题，显示配置弹窗
      setShowConfigDialog(true)
    } finally {
      setLoading(false)
    }
  }

  // 搜索和筛选
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredApps(apps)
      return
    }
    const query = searchQuery.toLowerCase()
    const filtered = apps.filter(
      app =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query) ||
        app.author.toLowerCase().includes(query),
    )
    setFilteredApps(filtered)
    setCurrentPage(1) // 重置到第一页
  }, [searchQuery, apps])

  // 分页计算
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentApps = filteredApps.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const handleConfigure = () => {
    navigate('/settings')
  }

  const handleCardClick = (app: AppItem) => {
    navigate(`/market/${app.os}/${app.version}/${app.variant}`)
  }

  if (loading) {
    return (
      <div className='container mx-auto p-6'>
        {/* 配置缺失弹窗 */}
        <AlertDialog
          open={showConfigDialog}
          onOpenChange={setShowConfigDialog}
          title='缺少配置'
          description='检测到您尚未配置跨域代理地址、应用市场索引或仓库地址。请先完成配置以使用应用市场功能。'
          confirmText='前往配置'
          onConfirm={handleConfigure}
        />
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h1 className='text-3xl font-bold'>应用市场</h1>
            <p className='text-muted-foreground'>浏览可用模板</p>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className='h-6 w-3/4' />
                <Skeleton className='h-4 w-1/2' />
              </CardHeader>
              <CardContent>
                <Skeleton className='h-4 w-full mb-2' />
                <Skeleton className='h-4 w-full' />
              </CardContent>
              <CardFooter>
                <Skeleton className='h-10 w-full' />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto p-6'>
      {/* 配置缺失弹窗 */}
      <AlertDialog
        open={showConfigDialog}
        onOpenChange={setShowConfigDialog}
        title='缺少配置'
        description='检测到您尚未配置跨域代理地址、应用市场索引或仓库地址。请先完成配置以使用应用市场功能。'
        confirmText='前往配置'
        onConfirm={handleConfigure}
      />

      {/* 标题和搜索 */}
      <div className='flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4'>
        <div>
          <h1 className='text-3xl font-bold'>应用市场</h1>
          <p className='text-muted-foreground'>浏览可用模板</p>
        </div>
        <div className='flex items-center gap-4'>
          <div className='relative w-full md:w-64'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground' />
            <Input
              placeholder='搜索名称、描述或作者...'
              className='pl-10'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant='outline' className='gap-2'>
            <Filter className='h-4 w-4' />
            筛选
          </Button>
        </div>
      </div>

      {/* 结果统计和分页设置 */}
      <div className='flex flex-col md:flex-row justify-between items-center mb-6 gap-4'>
        <div className='text-sm text-muted-foreground'>
          共 <span className='font-semibold'>{filteredApps.length}</span> 个应用
          {searchQuery && (
            <span>
              ，搜索 "<span className='font-semibold'>{searchQuery}</span>"
              的结果
            </span>
          )}
        </div>
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-2'>
            <span className='text-sm'>每页显示</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' size='sm'>
                  {itemsPerPage}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setItemsPerPage(10)}>
                  10
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setItemsPerPage(20)}>
                  20
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setItemsPerPage(30)}>
                  30
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 应用卡片网格 */}
      {filteredApps.length === 0 ? (
        <div className='text-center py-12 border rounded-lg'>
          <Box className='h-12 w-12 mx-auto text-muted-foreground mb-4' />
          <h3 className='text-lg font-semibold'>未找到应用</h3>
          <p className='text-muted-foreground'>
            {searchQuery
              ? '尝试更换搜索关键词或清除搜索框'
              : '索引为空或加载失败'}
          </p>
        </div>
      ) : (
        <>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {currentApps.map((app, index) => (
              <Card
                key={index}
                className='cursor-pointer hover:shadow-lg transition-shadow'
                onClick={() => handleCardClick(app)}
              >
                <CardHeader>
                  <div className='flex items-start justify-between'>
                    <div>
                      <CardTitle className='flex items-center gap-2'>
                        <Box className='h-5 w-5 text-primary' />
                        {app.name}
                      </CardTitle>
                      <CardDescription>{app.description}</CardDescription>
                    </div>
                    <Badge variant='outline'>{app.release}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>系统</span>
                      <span className='font-medium'>
                        {app.os} {app.version}
                      </span>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>变体</span>
                      <span className='font-medium'>{app.variant}</span>
                    </div>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='text-muted-foreground'>作者</span>
                      <span className='font-medium'>{app.author}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className='w-full'>查看详情</Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* 分页 */}
          {totalPages > 1 && (
            <div className='mt-8 flex flex-col sm:flex-row items-center justify-between gap-4'>
              <div className='text-sm text-muted-foreground'>
                第 <span className='font-semibold'>{currentPage}</span> 页，共{' '}
                <span className='font-semibold'>{totalPages}</span> 页
              </div>
              <div className='flex items-center gap-2'>
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className='h-4 w-4' />
                  上一页
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size='sm'
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  ),
                )}
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  下一页
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
