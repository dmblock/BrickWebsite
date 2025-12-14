import * as React from 'react'
import { cn } from '@/lib/utils'

const StepperContext = React.createContext<{
  currentStep: number
  steps: string[]
} | null>(null)

function useStepper() {
  const context = React.useContext(StepperContext)
  if (!context) {
    throw new Error('useStepper must be used within a Stepper')
  }
  return context
}

interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  currentStep: number
  steps: string[]
  children: React.ReactNode
}

function Stepper({
  className,
  currentStep,
  steps,
  children,
  ...props
}: StepperProps) {
  return (
    <StepperContext.Provider value={{ currentStep, steps }}>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        {children}
      </div>
    </StepperContext.Provider>
  )
}

function StepperList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  const { currentStep, steps } = useStepper()

  return (
    <div
      className={cn('flex items-center justify-between', className)}
      {...props}
    >
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <div className='flex flex-col items-center gap-2'>
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors',
                index < currentStep &&
                  'bg-primary border-primary text-primary-foreground',
                index === currentStep &&
                  'border-primary bg-primary text-primary-foreground',
                index > currentStep &&
                  'border-muted-foreground/30 text-muted-foreground',
              )}
            >
              {index < currentStep ? (
                <svg
                  width='16'
                  height='16'
                  viewBox='0 0 16 16'
                  fill='none'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M12.5 4.5L6.5 10.5L3.5 7.5'
                    stroke='currentColor'
                    strokeWidth='2'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <span
              className={cn(
                'text-sm font-medium',
                index <= currentStep
                  ? 'text-foreground'
                  : 'text-muted-foreground',
              )}
            >
              {step}
            </span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'h-0.5 flex-1 mx-4',
                index < currentStep ? 'bg-primary' : 'bg-muted-foreground/30',
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

function StepperContent({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('min-h-[200px]', className)} {...props} />
}

function StepperActions({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex justify-between', className)} {...props} />
}

export { Stepper, StepperList, StepperContent, StepperActions }
