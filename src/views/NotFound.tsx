import { Button } from '@/components/ui/button'
import { Rocket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-background p-4'>
      <div className='max-w-md text-center space-y-6'>
        <div className='relative'>
          <div className='text-9xl font-bold text-muted-foreground'>404</div>
          <div className='absolute inset-0 flex items-center justify-center'>
            <Rocket className='w-32 h-32 text-primary animate-bounce' />
          </div>
        </div>

        <h1 className='text-3xl font-bold text-foreground'>页面飞走啦！</h1>
        <p className='text-muted-foreground'>
          我们似乎找不到你要找的页面。可能它已经飞向太空，或者从未存在过。
        </p>

        <div className='pt-4'>
          <Button onClick={() => navigate('/')} className='gap-2'>
            <Rocket className='w-4 h-4 text-current' />
            返回主页
          </Button>
        </div>
      </div>
    </div>
  )
}
