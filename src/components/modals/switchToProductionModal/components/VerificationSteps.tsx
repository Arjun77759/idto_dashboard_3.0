import React from 'react'
import { Info } from 'lucide-react'

interface VerificationStep {
  icon: React.ComponentType<{ className?: string }>
  title: string
}

interface VerificationStepsProps {
  steps: VerificationStep[]
}

const VerificationSteps: React.FC<VerificationStepsProps> = ({ steps }) => {
  return (
    <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
      {/* Welcome Section */}
      <div className="flex flex-col items-start relative shrink-0 w-full">
        <p className="font-bold leading-8 relative shrink-0 text-2xl text-[#616675] tracking-[-0.24px] w-full">
          Hi, Welcome!
        </p>
        <div className="flex gap-2 items-center px-0 py-2 relative shrink-0">
          <p className="font-normal text-wrap leading-[1.4] text-xs text-[#9296a0] tracking-[-0.12px]">
            Finish these steps to verify your business and get dashboard access. Details are required for compliance.
          </p>
        </div>
      </div>

      {/* Step-by-step guide */}
      <div className="border border-[#e7e8ea] border-solid flex flex-col gap-4 items-start p-4 relative rounded shrink-0 w-full">
        <p className="font-bold leading-6 min-w-full relative shrink-0 text-base text-[#131b31] tracking-[-0.16px] w-[min-content]">
          Step-by-step guide
        </p>
        <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
          {steps.map((step, index) => (
            <div key={index} className="flex gap-2 items-center px-3 py-1.5 relative rounded shrink-0 w-full">
              <step.icon className="size-4 text-[#9296a0]" />
              <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-xs text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info section */}
      <div className="flex gap-2 items-start px-0 py-2 relative shrink-0 w-full">
        <Info className="size-6 text-[#9296a0]" />
        <p className="font-normal leading-[1.4] text-xs text-[#9296a0] tracking-[-0.12px]">
          Finish these steps to verify your business and get dashboard access. Details are required for compliance.
        </p>
      </div>
    </div>
  )
}

export default VerificationSteps
