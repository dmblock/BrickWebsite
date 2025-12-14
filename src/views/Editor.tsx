import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Stepper,
  StepperList,
  StepperContent,
  StepperActions,
} from '@/components/ui/stepper'
import Step1 from '@/components/editor/Step1'
import Step2 from '@/components/editor/Step2'
import Step3 from '@/components/editor/Step3'
import AlertDialog from '@/components/ui/alert-dialog'

export default function Editor() {
  const [currentStep, setCurrentStep] = useState(0)
  const stepComponents = [<Step1 />, <Step2 />, <Step3 />]
  const stepLabels = ['编辑模板', '生成索引', '下载文件']

  const nextStep = () => {
    // Validation before advancing
    if (currentStep === 0) {
      const md = localStorage.getItem('editor:markdown:draft') || ''
      const tpl = localStorage.getItem('editor:template:draft') || ''
      if (md.trim() === '' || tpl.trim() === '') {
        setErrMessage('请先填写文档和模板内容，才能进入下一步。')
        setErrOpen(true)
        return
      }
    }

    if (currentStep === 1) {
      try {
        const raw = localStorage.getItem('editor:brick:draft') || '{}'
        const brick = JSON.parse(raw)
        const required = [
          'name',
          'description',
          'os',
          'version',
          'variant',
          'release',
          'author',
          'contact',
        ]
        const missing = required.filter(
          k => !brick || !String(brick[k] || '').trim(),
        )
        if (missing.length > 0) {
          setErrMessage('请完整填写索引信息，缺少：' + missing.join(', '))
          setErrOpen(true)
          return
        }
      } catch {
        setErrMessage('索引数据格式错误，请检查 Step2 表单。')
        setErrOpen(true)
        return
      }
    }

    if (currentStep < stepComponents.length - 1) {
      setCurrentStep(currentStep + 1)
      return
    }

    // If we're on the last step, trigger download action in Step3 via custom event
    if (currentStep === stepComponents.length - 1) {
      window.dispatchEvent(new Event('download:build'))
    }
  }

  const [errOpen, setErrOpen] = useState(false)
  const [errMessage, setErrMessage] = useState('')

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className='max-w-6xl mx-auto p-4 space-y-8'>
      <Stepper currentStep={currentStep} steps={stepLabels}>
        <StepperList />
        <StepperContent>
          <div className='p-6 border rounded-lg bg-card'>
            {stepComponents[currentStep]}
          </div>
        </StepperContent>
        <StepperActions>
          <Button
            variant='outline'
            onClick={prevStep}
            disabled={currentStep === 0}
          >
            上一步
          </Button>
          <Button onClick={nextStep}>
            {currentStep === stepComponents.length - 1 ? '下载' : '下一步'}
          </Button>
        </StepperActions>
      </Stepper>
      <AlertDialog
        open={errOpen}
        onOpenChange={setErrOpen}
        title='校验失败'
        description={errMessage}
        confirmText='我知道了'
      />
    </div>
  )
}
