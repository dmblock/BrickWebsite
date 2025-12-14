import { Settings2 } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function UserSettingsLayout() {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>用户设置</CardTitle>
        </CardHeader>
        <CardContent>
          <UserSettingsPanel />
        </CardContent>
        <CardFooter>
          <Button>保存</Button>
        </CardFooter>
      </Card>
    </>
  )
}

function DeveloperSettingsLayout() {
  return (
    <>
      {' '}
      <Card>
        <CardHeader>
          <CardTitle>开发者设置</CardTitle>
        </CardHeader>
        <CardContent>
          <DeveloperSettingsPanel />
        </CardContent>
        <CardFooter>
          <Button>保存</Button>
        </CardFooter>
      </Card>
    </>
  )
}
function UserSettingsPanel() {
  return (
    <>
      <div>user</div>
    </>
  )
}

function DeveloperSettingsPanel() {
  return (
    <>
      <div>dev</div>
    </>
  )
}
export default function Settings() {
  return (
    <>
      <div className='max-w-6xl mx-auto p-4 space-y-8'>
        <div className='space-y-6'>
          {/* 标题区域 */}
          <div className='flex items-center gap-3'>
            <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20'>
              <Settings2 className='h-5 w-5 text-primary' />
            </div>
            <div>
              <h3 className='text-xl font-semibold text-foreground'>
                创建模板索引
              </h3>
              <p className='text-sm text-muted-foreground'>
                配置项目信息和系统要求，生成完整的模板索引
              </p>
            </div>
          </div>
        </div>

        <UserSettingsLayout />
        <DeveloperSettingsLayout />
      </div>
    </>
  )
}
