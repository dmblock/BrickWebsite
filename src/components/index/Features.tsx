import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Zap, Cpu, Globe, Code, Rocket, Shield } from 'lucide-react'

const features = [
  {
    icon: <Zap className='h-8 w-8' />,
    title: '开箱即用',
    description: '预配置多种应用环境模板，快速部署',
  },
  {
    icon: <Cpu className='h-8 w-8' />,
    title: '轻量高效',
    description: '基于容器技术，资源占用低，性能优异',
  },
  {
    icon: <Globe className='h-8 w-8' />,
    title: '跨平台支持',
    description: '兼容主流操作系统和云环境',
  },
  {
    icon: <Code className='h-8 w-8' />,
    title: '模板生态',
    description: '丰富的社区模板，持续更新扩展',
  },
  {
    icon: <Rocket className='h-8 w-8' />,
    title: '简易部署',
    description: '简化配置流程，降低使用门槛',
  },
  {
    icon: <Shield className='h-8 w-8' />,
    title: '安全可靠',
    description: '企业级安全防护，保障应用稳定运行',
  },
]

const featureList = ['容器化部署', '多环境支持', '一键启动', '模板市场']

export const Features = () => {
  return (
    <section
      id='features'
      className='container py-12 md:py-16 space-y-10 animate-fade-in'
    >
      <div className='text-center space-y-4'>
        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight'>
          众多 <span className='text-primary'>强大功能</span>
        </h2>
        <p className='text-muted-foreground text-lg max-w-2xl mx-auto'>
          提供全面的容器化解决方案，满足从开发到生产的各种需求
        </p>
      </div>

      <div className='flex flex-wrap justify-center gap-3'>
        {featureList.map((feature: string) => (
          <div
            key={feature}
            className='animate-scale-in'
            style={{
              animationDelay: `${featureList.indexOf(feature) * 100}ms`,
            }}
          >
            <Badge
              variant='secondary'
              className='text-sm px-4 py-2 hover-lift transition-all duration-300'
            >
              {feature}
            </Badge>
          </div>
        ))}
      </div>

      <div className='grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
        {features.map(({ icon, title, description }, index) => (
          <Card
            key={title}
            className='hover-lift transition-all duration-300 hover:shadow-xl border-border/50 animate-slide-up'
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <CardHeader>
              <div className='flex items-center gap-4'>
                <div className='p-3 rounded-lg bg-primary/10 text-primary animate-pulse-slow'>
                  {icon}
                </div>
                <CardTitle className='text-xl'>{title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className='text-muted-foreground leading-relaxed'>
                {description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
