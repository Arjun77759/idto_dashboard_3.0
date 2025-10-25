import React from 'react'

// Image assets from Figma
const imgPriority = "http://localhost:3845/assets/463a235a3b145b1e261f1f8355514bd3a62d825f.svg"

interface VerificationStep {
  icon: string
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
              <div className="overflow-clip relative shrink-0 size-4">
                <div className="absolute inset-[8.333%]">
                  <img alt="" className="block max-w-none size-full" src={step.icon} />
                </div>
              </div>
              <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-xs text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                {step.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Info section */}
      <div className="flex gap-2 items-start px-0 py-2 relative shrink-0 w-full">
        <div className="relative shrink-0 size-6">
          <img alt="" className="block max-w-none size-full" src={imgPriority} />
        </div>
        <p className="font-normal leading-[1.4] text-xs text-[#9296a0] tracking-[-0.12px]">
          Finish these steps to verify your business and get dashboard access. Details are required for compliance.
        </p>
      </div>
    </div>
  )
}

export default VerificationSteps
