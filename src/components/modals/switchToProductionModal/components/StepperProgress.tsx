import { Check } from 'lucide-react'

interface StepperStep {
  id: string
  title: string
  icon: React.ComponentType<{ className?: string }>
  isActive: boolean
  isCompleted: boolean
}

interface StepperProgressProps {
  steps: StepperStep[]
}

const StepperProgress = ({ steps }: StepperProgressProps) => {
  return (
    <div className="flex flex-col gap-4 items-start overflow-hidden relative rounded shrink-0 w-[290px] h-full">
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded shrink-0 w-full h-full flex flex-col overflow-hidden">
        <div className="flex flex-col gap-4 items-start p-4 relative rounded-[inherit] w-full overflow-y-auto">
          {/* Progress Header */}
          <div className="flex gap-1 items-center px-0 py-1 relative shrink-0 w-full">
            <p className="font-normal leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
              Progress
            </p>
            <div className="grow h-px min-h-px min-w-px relative shrink-0 bg-[#e7e8ea]"></div>
          </div>

          {/* Steps */}
          {steps.map((step) => (
            <div 
              key={step.id}
              className={`flex gap-2 items-center px-3 py-1.5 relative rounded shrink-0 w-full ${
                step.isCompleted 
                  ? 'bg-[#ebfaea]' 
                  : step.isActive 
                  ? 'bg-[#e6e8ff]' 
                  : 'hover:bg-gray-50'
              }`}
            >
              {step.isCompleted ? (
                <Check className="size-4 text-[#298e1c]" />
              ) : (
                <step.icon className={`size-4 ${
                  step.isActive ? 'text-[#0019ff]' : 'text-[#9296a0]'
                }`} />
              )}
              <p className={`font-medium leading-[1.4] relative shrink-0 text-xs text-nowrap tracking-[-0.12px] whitespace-pre ${
                step.isCompleted 
                  ? 'text-[#298e1c]' 
                  : step.isActive 
                  ? 'text-[#0019ff]' 
                  : 'text-[#9296a0]'
              }`}>
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StepperProgress
