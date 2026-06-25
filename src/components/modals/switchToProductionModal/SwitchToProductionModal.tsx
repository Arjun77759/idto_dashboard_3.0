import { useState, useEffect } from 'react'
import { Dialog, DialogContent } from '../../ui/dialog'
import { Sheet, SheetContent } from '../../ui/sheet'
import { useIsMobile } from '../../../hooks/use-mobile'
import { useOnboardingStatus } from '../../../hooks/useOnboardingStatus'
import { useOnboardingSteps } from '../../../hooks/useOnboardingSteps'
import { useUserProfile } from '@/hooks/useUserProfile'
import { ModalHeader, StepperProgress, StepForm } from './components'
import BasicDetailsForm from './components/BasicDetailsForm'
import PANAndGSTForm from './components/PANAndGSTForm'
import SignatoryChoiceForm from './components/SignatoryChoiceForm'
import BankAccountForm from './components/BankAccountForm'
import BankVerificationInFlightForm from './components/BankVerificationInFlightForm'
import BankVerificationFailedForm, { type BankRecoveryMethod } from './components/BankVerificationFailedForm'
import KYCFinalReviewForm from './components/KYCFinalReviewForm'
import { fetchUserProfile, useUserProfileStore } from '@/store/userProfileStore'
import { ArrowRight, BadgeCheck, Building, Building2, Check, Clock3, Landmark, Lock, Monitor, RotateCcw, ShieldCheck, Smartphone, Sparkles, UserRoundCheck, Info } from 'lucide-react'
import { normalizeEntityType } from '@/lib/entityType'
import { updateProductionProgress } from '@/api/onboardingApi'
import { fetchOnboardingStatus } from '@/store/onboardingStore'
import { fetchOnboardingSteps } from '@/store/onboardingStepsStore'

const productionHighlights = [
  {
    icon: ShieldCheck,
    title: 'End-to-end encrypted',
    description: 'Documents never leave our compliance vault.'
  },
  {
    icon: Clock3,
    title: '24h TAT',
    description: 'Approved within one business day, typically faster.'
  },
  {
    icon: RotateCcw,
    title: 'Resume anytime',
    description: 'Drop off, come back, pick up where you left.'
  }
]

const productionRequirements = [
  {
    icon: Building2,
    title: 'Company basics',
    description: 'Brand name, legal name, registered address'
  },
  {
    icon: BadgeCheck,
    title: 'Business PAN & GSTIN',
    description: 'Auto-verified via NSDL & GST portal'
  },
  {
    icon: UserRoundCheck,
    title: 'Authorized signatory',
    description: 'DigiLocker pull + board resolution'
  },
  {
    icon: Landmark,
    title: 'Bank account',
    description: 'Verified via penny-drop'
  }
]

interface SwitchToProductionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  initialStep?: string | null
}

const stepOrder = ['basic-details', 'pan-gst', 'director-kyc', 'bank-account', 'bank-verification']
const resumableSteps = [...stepOrder, 'bank-final-review']

const SwitchToProductionModal = ({ isOpen, onClose, onConfirm, initialStep = null }: SwitchToProductionModalProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshingStatus, setIsRefreshingStatus] = useState(false)
  const [currentStep, setCurrentStep] = useState('basic-details')
  const [isInStepperMode, setIsInStepperMode] = useState(false)
  const isMobile = useIsMobile()
  const onboardingData = useOnboardingStatus()
  const stepsStatus = useOnboardingSteps()
  useUserProfile()
  const userProfile = useUserProfileStore((state) => state.data)
  const isProprietorship = normalizeEntityType(userProfile?.entity_type) === 'proprietorship'

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false
    setIsRefreshingStatus(true)
    Promise.all([
      fetchOnboardingStatus(true),
      fetchOnboardingSteps(true),
      fetchUserProfile(true),
    ])
      .catch(() => null)
      .finally(() => {
        if (!cancelled) setIsRefreshingStatus(false)
      })

    return () => {
      cancelled = true
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setIsInStepperMode(false)
      return
    }

    if (isRefreshingStatus || onboardingData.loading || !onboardingData.data) {
      return
    }

    const persistedStep = onboardingData.data?.production_onboarding_step
    if (persistedStep && resumableSteps.includes(persistedStep)) {
      setCurrentStep(persistedStep)
      setIsInStepperMode(true)
      return
    }

    if (isInStepperMode) {
      return
    }

    if (!stepsStatus.loading && isOpen) {
      let firstIncompleteStep = 'basic-details'

      if (!stepsStatus.basicDetails) {
        firstIncompleteStep = 'basic-details'
      } else if (!stepsStatus.businessPAN || (!isProprietorship && !stepsStatus.gstin)) {
        // Combined step: PAN is required; GST is optional for sole proprietorship.
        firstIncompleteStep = 'pan-gst'
      } else {
        firstIncompleteStep = 'director-kyc'
      }

      setCurrentStep(firstIncompleteStep)
      setIsInStepperMode(true)
    }
  }, [stepsStatus, isOpen, isProprietorship, isInStepperMode, initialStep, isRefreshingStatus, onboardingData.loading, onboardingData.data])

  const handleStartVerification = async () => {
    setCurrentStep('basic-details')
    setIsInStepperMode(true)
  }

  const handleStepNext = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsLoading(false)

    // BankAccountForm only calls onNext after the real v2 penny-drop API succeeds.
    if (currentStep === 'bank-account') {
      setCurrentStep('bank-final-review')
      return
    }

    const currentIndex = stepOrder.indexOf(currentStep)
    const nextIndex = currentIndex + 1

    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex])
    } else if (onboardingData.data?.is_onboarded) {
      onConfirm()
      onClose()
    } else {
      setCurrentStep('director-kyc')
    }
  }

  const handleStepPrevious = () => {
    if (currentStep === 'bank-final-review') {
      setCurrentStep('bank-verification-failed')
      return
    }

    if (currentStep === 'bank-verification' || currentStep === 'bank-verification-failed') {
      setCurrentStep('bank-account')
      return
    }

    const currentIndex = stepOrder.indexOf(currentStep)
    if (currentIndex > 0) {
      // Go to previous step
      setCurrentStep(stepOrder[currentIndex - 1])
    } else {
      // If on first step, go back to welcome screen
      setIsInStepperMode(false)
    }
  }

  const currentStepIndex = stepOrder.indexOf(currentStep)
  const isFigmaStepOne = isInStepperMode && currentStep === 'basic-details'
  const isFigmaStepTwo = isInStepperMode && currentStep === 'pan-gst'
  const isFigmaStepThree = isInStepperMode && currentStep === 'director-kyc'
  const isFigmaStepFour = isInStepperMode && currentStep === 'bank-account'
  const isFigmaBankVerifying = isInStepperMode && currentStep === 'bank-verification'
  const isFigmaBankFailure = isInStepperMode && currentStep === 'bank-verification-failed'
  const isFigmaFinalReview = isInStepperMode && currentStep === 'bank-final-review'
  const isFigmaStepperCard = isFigmaStepOne || isFigmaStepTwo || isFigmaStepThree || isFigmaStepFour || isFigmaBankVerifying || isFigmaBankFailure || isFigmaFinalReview

  const handleBankVerificationComplete = () => {
    setCurrentStep('bank-final-review')
  }

  const handleBankFailureNext = (method: BankRecoveryMethod) => {
    if (method === 'different-account') {
      setCurrentStep('bank-account')
      return
    }

    setCurrentStep('bank-final-review')
  }

  const handleFinalReviewSubmit = async () => {
    setIsLoading(true)
    try {
      await updateProductionProgress('completed')
      await fetchOnboardingStatus(true).catch(() => null)
      onConfirm()
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSkipBankVerification = async () => {
    setIsLoading(true)
    try {
      await updateProductionProgress('completed')
      await fetchOnboardingStatus(true).catch(() => null)
      onConfirm()
      onClose()
    } finally {
      setIsLoading(false)
    }
  }

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
      isActive: false,
      isCompleted: currentStepIndex > 0
    },
    {
      id: 'pan-gst',
      title: 'Provide your Business PAN & GST',
      icon: Building,
      isActive: currentStep === 'pan-gst',
      isCompleted: currentStepIndex > 1
    },
    {
      id: 'director-kyc',
      title: 'Authorized signatory',
      icon: Lock,
      isActive: currentStep === 'director-kyc',
      isCompleted: currentStepIndex > 2
    },
    {
      id: 'bank-account',
      title: 'Bank & review',
      icon: Landmark,
      isActive: currentStep === 'bank-account',
      isCompleted: currentStepIndex > 3
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

  const DesktopContent = () => (
    isFigmaStepperCard ? (
      isFigmaStepOne ? (
      <BasicDetailsForm
        onNext={handleStepNext}
        onPrevious={handleStepPrevious}
        showPrevious={true}
        isLoading={isLoading}
        initialData={onboardingData.data}
        stepsStatus={stepsStatus}
      />
      ) : isFigmaStepThree ? (
      <SignatoryChoiceForm
        onNext={handleStepNext}
        onPrevious={handleStepPrevious}
        isLoading={isLoading}
      />
      ) : isFigmaStepFour ? (
      <BankAccountForm
        onNext={handleStepNext}
        onSkip={handleSkipBankVerification}
        onPrevious={handleStepPrevious}
        isLoading={isLoading}
        userProfile={userProfile}
        completedSteps={onboardingData.data?.production_steps}
      />
      ) : isFigmaBankVerifying ? (
      <BankVerificationInFlightForm
        onComplete={handleBankVerificationComplete}
        onPrevious={handleStepPrevious}
      />
      ) : isFigmaBankFailure ? (
      <BankVerificationFailedForm
        onNext={handleBankFailureNext}
        onPrevious={handleStepPrevious}
        isLoading={isLoading}
        userProfile={userProfile}
      />
      ) : isFigmaFinalReview ? (
      <KYCFinalReviewForm
        onSubmit={handleFinalReviewSubmit}
        onPrevious={handleStepPrevious}
        onSaveAndExit={onClose}
        isLoading={isLoading}
        userProfile={userProfile}
      />
      ) : (
      <PANAndGSTForm
        onNext={handleStepNext}
        onPrevious={handleStepPrevious}
        showPrevious={true}
        isLoading={isLoading}
        initialData={onboardingData.data}
        stepsStatus={stepsStatus}
      />
      )
    ) : (
    <div className="bg-[#f7f7f8] flex flex-col gap-4 items-start p-5 relative rounded-[12px] shadow-[0px_4px_131px_0px_rgba(19,27,49,0.25)] w-full overflow-hidden">
      <ModalHeader />

      <div className="w-full overflow-auto">
        {isInStepperMode ? (
          // Stepper Mode
          <div className="flex gap-4 items-start relative w-full">
            {/* Left Sidebar - Progress */}
            <StepperProgress steps={stepperSteps} />

            {/* Right Panel - Step Form */}
            <StepForm
              currentStep={currentStep}
              onNext={handleStepNext}
              onPrevious={handleStepPrevious}
              showPrevious={true}
              isLoading={isLoading}
              initialData={onboardingData.data}
              stepsStatus={stepsStatus}
              userProfile={userProfile}
              onSkipBank={handleSkipBankVerification}
              completedSteps={onboardingData.data?.production_steps}
            />
          </div>
        ) : (
          // Initial Welcome Mode
          <div className="grid h-[506px] w-full grid-cols-2 overflow-hidden rounded-[20px] border border-[#e0e5eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
            <div className="flex h-full flex-col items-start px-10 pb-[106px] pt-[41px] text-white bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)]">
              <div className="inline-flex h-[21px] items-center gap-1.5 rounded-full bg-[#e5f2ff] px-2.5 text-[11px] leading-[17px] text-[#1034b1]">
                <Sparkles className="size-3" />
                AI-native identity
              </div>

              <div className="mt-3 flex w-full flex-col items-start">
                <h2 className="w-full text-[34px] font-bold leading-[42.5px] text-white">
                  Verify smarter.
                  <br />
                  Decide faster.
                </h2>
                <p className="mt-3 max-w-[384px] text-[13px] leading-[19.5px] text-white/90">
                  DigiLocker-first KYC. No paper. No follow-ups. Your team is approved in 24 business hours.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3">
                {productionHighlights.map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                      <item.icon className="size-3" />
                    </span>
                    <span>
                      <span className="block text-[13px] leading-5">{item.title}</span>
                      <span className="block text-[11.5px] leading-[17px] text-white/80">{item.description}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex h-full flex-col items-start bg-white p-10">
              <div className="w-full">
                <h3 className="text-[20px] font-bold leading-[30px] tracking-[-0.5px] text-[#0c121a]">
                  Here's what we'll need
                </h3>
                <p className="mt-1 text-[13px] leading-5 text-[#6a727d]">
                  Keep these ready. Most are auto-pulled from government sources.
                </p>
              </div>

              <div className="flex w-full flex-col gap-2.5 pt-[18px]">
                {productionRequirements.map((item) => (
                  <div key={item.title} className="flex h-16 w-full items-start gap-3 rounded-2xl border border-[#e0e5eb] p-[13px]">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f0f4f9] text-[#131b31]">
                      <item.icon className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] leading-5 text-[#0c121a]">{item.title}</span>
                      <span className="block text-[11.5px] leading-[17px] text-[#6a727d]">{item.description}</span>
                    </span>
                    <Check className="mt-1 size-4 text-[#00a575]" />
                  </div>
                ))}
              </div>

              <div className="mt-auto flex h-[58px] w-full items-end justify-between gap-4">
                <div className="flex max-w-[212px] items-center gap-1.5 pb-[11px] text-[0px] leading-[18px] text-[#6a727d]">
                  <Lock className="size-3.5" />
                  <span className="text-[12px] leading-[18px]">~20 minutes · auto-saves as you go</span>
                  ~20 minutes · auto-saves as you go
                </div>
                <div className="h-10 w-[156px] shrink-0 rounded-lg border border-[#0019ff] bg-[#0019ff] shadow-[0_8px_18px_rgba(0,25,255,0.18)]">
                  <button
                    onClick={handleStartVerification}
                    disabled={isLoading}
                    className="flex size-full items-center justify-center gap-2 rounded-[inherit] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <p className="text-nowrap text-xs font-bold leading-4 tracking-[-0.12px] text-white">
                          Starting...
                        </p>
                      </div>
                    ) : (
                      <>
                        <p className="text-nowrap text-xs font-bold leading-4 tracking-[-0.12px] text-white">
                          Start Verification
                        </p>
                        <ArrowRight className="size-4 text-white" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
    )
  )

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={(open) => {
          if (!open) onClose()
        }}>
          <SheetContent side="bottom" className="h-[70vh] p-0 flex flex-col overflow-hidden">
            <MobileContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={(open) => {
          if (!open) onClose()
        }}>
          <DialogContent className={`w-[min(1216px,calc(100vw-80px))] max-w-none overflow-hidden p-0 flex flex-col ${isFigmaStepperCard ? `${isFigmaStepOne ? 'h-[min(759px,calc(100vh-80px))]' : isFigmaStepFour ? 'h-[min(738px,calc(100vh-80px))]' : isFigmaFinalReview ? 'h-[min(837px,calc(100vh-40px))]' : 'h-[min(602px,calc(100vh-80px))]'} border-0 bg-transparent shadow-none [&>button:last-child]:hidden` : 'max-h-[90vh]'}`}>
            <DesktopContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default SwitchToProductionModal
