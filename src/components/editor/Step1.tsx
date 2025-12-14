import MarkDownEditor from '@/components/editor/MarkdownEditor'
import TemplateEditor from '@/components/editor/TemplateEditor'
import { FileText, Code, BookOpen, Terminal } from 'lucide-react'

export default function Step1() {
  return (
    <div className='space-y-8 px-2 sm:px-4 md:px-0'>
      {/* 使用文档编辑区域 */}
      <div className='space-y-4'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 mb-2 sm:mb-0'>
            <BookOpen className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h3 className='text-lg sm:text-xl font-semibold text-foreground'>
              编辑使用文档
            </h3>
            <p className='text-xs sm:text-sm text-muted-foreground'>
              在此处编写详细的使用说明和文档
            </p>
          </div>
        </div>
        <div className='rounded-lg border bg-card p-2 sm:p-4 shadow-sm'>
          <MarkDownEditor />
        </div>
      </div>

      {/* 启动模板编辑区域 */}
      <div className='space-y-4'>
        <div className='flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3'>
          <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20 mb-2 sm:mb-0'>
            <Terminal className='h-5 w-5 text-primary' />
          </div>
          <div>
            <h3 className='text-lg sm:text-xl font-semibold text-foreground'>
              编辑启动模板
            </h3>
            <p className='text-xs sm:text-sm text-muted-foreground'>
              配置项目的启动脚本和模板代码
            </p>
          </div>
        </div>
        <div className='rounded-lg border bg-card p-2 sm:p-4 shadow-sm'>
          <TemplateEditor />
        </div>
      </div>

      {/* 功能提示区域 */}
      <div className='grid grid-cols-1 gap-2 sm:gap-4 md:grid-cols-2'>
        <div className='flex items-start gap-2 sm:gap-3 rounded-lg border bg-muted/50 p-3 sm:p-4'>
          <FileText className='h-5 w-5 text-primary mt-0.5' />
          <div className='space-y-1'>
            <p className='text-xs sm:text-sm font-medium'>文档暂存</p>
            <p className='text-[11px] sm:text-xs text-muted-foreground'>
              支持实时保存和恢复编辑内容
            </p>
          </div>
        </div>
        <div className='flex items-start gap-2 sm:gap-3 rounded-lg border bg-muted/50 p-3 sm:p-4'>
          <Code className='h-5 w-5 text-primary mt-0.5' />
          <div className='space-y-1'>
            <p className='text-xs sm:text-sm font-medium'>模板预览</p>
            <p className='text-[11px] sm:text-xs text-muted-foreground'>
              实时预览模板效果和语法高亮
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
