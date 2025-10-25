import { useState } from 'react'
import { Dialog, DialogContent } from '../../ui/dialog'
import { Sheet, SheetContent } from '../../ui/sheet'
import { useIsMobile } from '../../../hooks/use-mobile'
import { ModalHeader, StepperProgress, StepForm } from './components'
import { Info, Building2, Building, CreditCard, Lock, ArrowRight, Monitor, Smartphone } from 'lucide-react'

interface SwitchToProductionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const SwitchToProductionModal = ({ isOpen, onClose, onConfirm }: SwitchToProductionModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState('basic-details')
  const [isInStepperMode, setIsInStepperMode] = useState(false)
  const isMobile = useIsMobile()

  const handleStartVerification = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)
    setIsInStepperMode(true)
  }

  const handleStepNext = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)

    // Move to next step
    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1])
    } else {
      // All steps completed
      onConfirm()
      onClose()
    }
  }

  const stepOrder = ['basic-details', 'business-info', 'business-pan', 'gstin', 'director-kyc']
  const currentStepIndex = stepOrder.indexOf(currentStep)

  const stepperSteps = [
    {
      id: 'basic-details',
      title: 'Provide your basic details',
      icon: Info,
      isActive: currentStep === 'basic-details',
      isCompleted: currentStepIndex > 0
    },
    {
      id: 'business-info',
      title: 'Tell us about your Business',
      icon: Building2,
      isActive: currentStep === 'business-info',
      isCompleted: currentStepIndex > 1
    },
    {
      id: 'business-pan',
      title: 'Provide your business PAN',
      icon: Building,
      isActive: currentStep === 'business-pan',
      isCompleted: currentStepIndex > 2
    },
    {
      id: 'gstin',
      title: 'Provide your GSTIN number',
      icon: CreditCard,
      isActive: currentStep === 'gstin',
      isCompleted: currentStepIndex > 3
    },
    {
      id: 'director-kyc',
      title: 'Director KYC with Digilocker',
      icon: Lock,
      isActive: currentStep === 'director-kyc',
      isCompleted: currentStepIndex > 4
    }
  ]

  const verificationSteps = [
    {
      icon: Info,
      title: 'Provide your basic details'
    },
    {
      icon: Building2,
      title: 'Tell us about your Business'
    },
    {
      icon: Building,
      title: 'Provide your business PAN'
    },
    {
      icon: CreditCard,
      title: 'Provide your GSTIN number'
    },
    {
      icon: Lock,
      title: 'Verify Aadhaar via Digilocker'
    }
  ]

  // Mobile content - Desktop only message
  const MobileContent = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center h-full">
      <div className="flex flex-col items-center gap-6 max-w-sm">
        {/* Icons */}
        <div className="flex items-center gap-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <Smartphone className="w-8 h-8 text-orange-600" />
          </div>
          <div className="text-gray-400">
            <ArrowRight className="w-6 h-6" />
          </div>
          <div className="p-3 bg-blue-100 rounded-full">
            <Monitor className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">
            Desktop Only Feature
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Switch to Production verification is only available on desktop devices for security and compliance reasons.
          </p>
        </div>

        {/* Info box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 w-full">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="text-left">
              <p className="text-sm font-medium text-blue-900 mb-1">
                Why desktop only?
              </p>
              <p className="text-sm text-blue-700">
                This process requires secure document uploads and detailed form completion that work best on larger screens.
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Got it, I'll use desktop
        </button>
      </div>
    </div>
  )

  // Desktop content - Original modal
  const DesktopContent = () => (
    <div className="bg-[#f7f7f8] flex flex-col gap-4 items-start p-4 relative rounded-2xl shadow-[0px_4px_131px_0px_rgba(19,27,49,0.25)] w-full">
      {/* Header */}
      <ModalHeader />

      {/* Main Content */}
      {isInStepperMode ? (
        // Stepper Mode
        <div className="flex gap-4 grow items-start min-h-px min-w-px relative shrink-0 w-[824px]">
          {/* Left Sidebar - Progress */}
          <StepperProgress steps={stepperSteps} />

          {/* Right Panel - Step Form */}
          <StepForm
            currentStep={currentStep}
            onNext={handleStepNext}
            isLoading={isLoading}
          />
        </div>
      ) : (
        // Initial Welcome Mode
        <div className="border border-[#e7e8ea] border-solid flex items-start justify-between relative rounded w-full">
          {/* Left Panel */}
          <div className="bg-white flex-1 flex flex-col gap-4 items-start p-6 relative rounded shrink-0">
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
                {verificationSteps.map((step, index) => (
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

            {/* Action Button */}
            <div className="flex gap-10 items-center justify-end relative shrink-0 w-full">
              <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
                <button
                  onClick={handleStartVerification}
                  disabled={isLoading}
                  className="flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-[inherit] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#0019ff] border-t-transparent rounded-full animate-spin" />
                      <p className="font-bold leading-4 relative text-xs text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                        Starting...
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="font-bold leading-4 relative text-xs text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                        Start Verification
                      </p>
                      <ArrowRight className="size-4 text-[#0019ff]" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Panel - Dashboard Preview */}
          <div className="bg-white flex-1 flex flex-col gap-4 items-start p-6 relative rounded shrink-0 h-full">
            <img alt="" className="block max-w-none size-full" src={'https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/production_switch.png'} />
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="bottom" className="h-[70vh] p-0">
            <MobileContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-6xl w-[856px] h-[610px] max-h-[90vh] overflow-hidden p-0">
            <DesktopContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default SwitchToProductionModal
