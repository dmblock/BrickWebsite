import { Button } from '@/components/ui/button'
import { Rocket, Code } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export const Hero = () => {
  const navigate = useNavigate()
  return (
    <section className='container grid lg:grid-cols-2 place-items-center py-12 md:py-24 gap-10'>
      <div className='text-center lg:text-start space-y-6 animate-slide-up'>
        <main className='text-3xl sm:text-4xl md:text-6xl font-bold'>
          <h1 className='inline'>
            <span className='text-primary'>BrickContainer</span>
            <br />
            轻量应用容器引擎
          </h1>
        </main>

        <p className='text-base sm:text-lg md:text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0 leading-relaxed'>
          一个轻量级应用容器引擎。通过简化的配置和部署流程，帮助用户快速构建和管理容器化应用环境。
        </p>

        <div className='flex flex-col sm:flex-row gap-4 justify-center lg:justify-start'>
          <Button
            size='lg'
            className='px-8 py-6 hover-lift hover-glow transition-all duration-300'
            onClick={() => {
              navigate('/market')
            }}
          >
            <Rocket className='mr-2 h-5 w-5' />
            开始使用
          </Button>

          <Button
            variant='outline'
            size='lg'
            className='px-8 py-6 hover-lift transition-all duration-300'
            onClick={() => {
              navigate('/doc')
            }}
          >
            <Code className='mr-2 h-5 w-5' />
            查看文档
          </Button>
        </div>
      </div>
      {/* Optional: Add a visual element or illustration */}
      <div className='hidden lg:flex justify-center items-center animate-float'>
        <div className='w-64 h-64 bg-linear-to-br from-primary/10 to-secondary/20 rounded-full blur-3xl opacity-70'></div>
      </div>
    </section>
  )
}
