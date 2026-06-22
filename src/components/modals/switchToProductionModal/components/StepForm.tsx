import BasicDetailsForm from './BasicDetailsForm'
import BusinessInfoForm from './BusinessInfoForm'
import BusinessPANForm from './BusinessPANForm'
import GSTINForm from './GSTINForm'
import PANAndGSTForm from './PANAndGSTForm'
import DirectorKYCForm from './DirectorKYCForm'
import BankAccountForm from './BankAccountForm'
import type { OnboardingStatus } from '@/hooks/useOnboardingStatus'
import type { OnboardingStepsStatus } from '@/hooks/useOnboardingSteps'

interface StepFormProps {
  currentStep: string
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
  initialData?: OnboardingStatus | null
  stepsStatus?: OnboardingStepsStatus
}

const StepForm = ({ currentStep, onNext, onPrevious, showPrevious = false, isLoading = false, initialData, stepsStatus }: StepFormProps) => {
  const renderStepForm = () => {
    switch (currentStep) {
      case 'basic-details':
        return <BasicDetailsForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'business-info':
        return <BusinessInfoForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'pan-gst':
        return <PANAndGSTForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'signatory-choice':
        return <DirectorKYCForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'bank-account':
        return <BankAccountForm onNext={onNext} onPrevious={onPrevious} isLoading={isLoading} />
      // Keep old step names for backward compatibility if needed
      case 'business-pan':
        return <BusinessPANForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'gstin':
        return <GSTINForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'director-kyc':
        return <DirectorKYCForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      default:
        return <BasicDetailsForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
    }
  }

  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0">
      {renderStepForm()}
      <div className="min-h-[20px]" />
    </div>
  )
}

export default StepForm
