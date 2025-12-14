import { Hero } from '@/components/index/Hero'
import { Features } from '@/components/index/Features'
import { useNavigate } from 'react-router-dom'

export default function Index() {
  const navigate = useNavigate()
  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Background decorative elements */}
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl'></div>
        <div className='absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl'></div>
      </div>

      <div className='relative z-10'>
        <Hero />
        <Features />
      </div>

      {/* Footer */}
      <footer className='border-t py-10 md:py-12 text-center text-muted-foreground bg-background/80 backdrop-blur-sm'>
        <div className='container mx-auto px-4'>
          <div className='flex flex-col md:flex-row justify-between items-center gap-6'>
            <div className='text-left'>
              <h3 className='text-lg font-semibold text-foreground'>
                BrickContainer
              </h3>
              <p className='text-sm mt-1'>轻量应用容器引擎</p>
            </div>
            <div className='flex flex-wrap justify-center gap-6'>
              <button
                onClick={() => navigate('/doc')}
                className='text-sm hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer'
              >
                文档
              </button>
              <a
                href='http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=kZNJY8LZqxYm6O45m6KWWh8TGiX98Y3K&authKey=9tZDzGJtsUQ40HzvmS07%2FRa9iPMZpfoTvBi38d%2Fr7wVyJt5xd%2Bj%2FHXvtmheiWFK3&noverify=0&group_code=1046054360'
                className='text-sm hover:text-primary transition-colors'
              >
                社区
              </a>
              <a
                href='https://codespace.lantian.pro/LantianCloud'
                className='text-sm hover:text-primary transition-colors'
              >
                源码
              </a>
            </div>
            <div className='text-right'>
              <p className='text-sm md:text-base'>
                BrickEngine 版本 2.0.0 | MIT 许可证
              </p>
              <p className='text-xs md:text-sm mt-2'>
                © {new Date().getFullYear()} BrickContainer 项目。保留所有权利。
              </p>
            </div>
          </div>
          <div className='mt-8 pt-6 border-t text-xs text-muted-foreground/70'>
            <p>
              本产品为开源项目，遵循 MIT
              许可证。我们致力于提供安全可靠的容器化解决方案。
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
