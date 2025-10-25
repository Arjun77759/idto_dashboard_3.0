// Image assets from Figma
const imgLine2 = "http://localhost:3845/assets/7bf94f2791c2e5cf11a0e4e95783d314a37852d7.svg"
const imgTick = "http://localhost:3845/assets/9db5a5cc55a75311970fa85a13f54301fb2214cb.svg"
const imgInfo = "http://localhost:3845/assets/dd73afcd31659ad8365e150d0a3fd170460adb60.svg"
const imgBusiness = "http://localhost:3845/assets/b2b8c51703f5b20cfe782cae4f821d97fb963d24.svg"
const imgBuilding = "http://localhost:3845/assets/065d94ad66519dcc779b1a600da8fb0201c128c9.svg"
const imgCreditCard = "http://localhost:3845/assets/6f9ddf7c798f338dd2c0b1de451c9a7dd8cf381d.svg"
const imgLock = "http://localhost:3845/assets/4ffc919aa48b1c2274e4c551eb6fdd98cab07d68.svg"

interface StepperStep {
  id: string
  title: string
  icon: string
  isActive: boolean
  isCompleted: boolean
}

interface StepperProgressProps {
  currentStep: string
  steps: StepperStep[]
}

const StepperProgress = ({ currentStep, steps }: StepperProgressProps) => {
  return (
    <div className="flex flex-col gap-4 items-start overflow-clip relative rounded shrink-0 w-[290px]">
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded shrink-0 w-full">
        <div className="flex flex-col gap-4 items-start p-4 relative rounded-[inherit] w-full">
          {/* Progress Header */}
          <div className="flex gap-1 items-center px-0 py-1 relative shrink-0 w-full">
            <p className="font-normal leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
              Progress
            </p>
            <div className="grow h-0 min-h-px min-w-px relative shrink-0">
              <div className="absolute bottom-0 left-0 right-0 top-[-1px]" style={{ "--stroke-0": "rgba(231, 232, 234, 1)" } as React.CSSProperties}>
                <img alt="" className="block max-w-none size-full" src={imgLine2} />
              </div>
            </div>
          </div>

          {/* Steps */}
          {steps.map((step, index) => (
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
              <div className="overflow-clip relative shrink-0 size-4">
                <div className="absolute inset-[16.67%_8.33%]">
                  <img 
                    alt="" 
                    className="block max-w-none size-full" 
                    src={step.isCompleted ? imgTick : step.icon} 
                  />
                </div>
              </div>
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
