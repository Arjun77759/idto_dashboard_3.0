import BasicDetailsForm from './BasicDetailsForm'
import BusinessInfoForm from './BusinessInfoForm'
import BusinessPANForm from './BusinessPANForm'
import GSTINForm from './GSTINForm'
import PANAndGSTForm from './PANAndGSTForm'
import SignatoryChoiceForm from './SignatoryChoiceForm'
import BankAccountForm from './BankAccountForm'
import BankVerificationInFlightForm from './BankVerificationInFlightForm'
import BankVerificationFailedForm from './BankVerificationFailedForm'
import KYCFinalReviewForm from './KYCFinalReviewForm'
import type { OnboardingStatus } from '@/hooks/useOnboardingStatus'
import type { OnboardingStepsStatus } from '@/hooks/useOnboardingSteps'
import type { UserProfile } from '@/store/userProfileStore'

interface StepFormProps {
  currentStep: string
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
  initialData?: OnboardingStatus | null
  stepsStatus?: OnboardingStepsStatus
  userProfile?: UserProfile | null
  onSkipBank?: () => void
  completedSteps?: {
    basic_details: boolean
    pan: boolean
    gst: boolean
    digilocker: boolean
    bank: boolean
  }
}

const StepForm = ({ currentStep, onNext, onPrevious, showPrevious = false, isLoading = false, initialData, stepsStatus, userProfile, onSkipBank, completedSteps }: StepFormProps) => {
  const renderStepForm = () => {
    switch (currentStep) {
      case 'basic-details':
        return <BasicDetailsForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'business-info':
        return <BusinessInfoForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'pan-gst':
        return <PANAndGSTForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'signatory-choice':
        return <SignatoryChoiceForm onNext={onNext} onPrevious={onPrevious} isLoading={isLoading} />
      case 'bank-account':
        return <BankAccountForm onNext={onNext} onSkip={onSkipBank} onPrevious={onPrevious} isLoading={isLoading} userProfile={userProfile} completedSteps={completedSteps} />
      case 'bank-verification':
        return <BankVerificationInFlightForm onComplete={onNext} onPrevious={onPrevious} />
      case 'bank-verification-failed':
        return <BankVerificationFailedForm onNext={() => onNext()} onPrevious={onPrevious} isLoading={isLoading} userProfile={userProfile} />
      case 'bank-final-review':
        return <KYCFinalReviewForm onSubmit={onNext} onPrevious={onPrevious} isLoading={isLoading} userProfile={userProfile} />
      // Keep old step names for backward compatibility if needed
      case 'business-pan':
        return <BusinessPANForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'gstin':
        return <GSTINForm onNext={onNext} onPrevious={onPrevious} showPrevious={showPrevious} isLoading={isLoading} initialData={initialData} stepsStatus={stepsStatus} />
      case 'director-kyc':
        return <SignatoryChoiceForm onNext={onNext} onPrevious={onPrevious} isLoading={isLoading} />
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
