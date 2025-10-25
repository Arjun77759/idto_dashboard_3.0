import BasicDetailsForm from './BasicDetailsForm'
import BusinessInfoForm from './BusinessInfoForm'
import BusinessPANForm from './BusinessPANForm'
import GSTINForm from './GSTINForm'
import DirectorKYCForm from './DirectorKYCForm'

interface StepFormProps {
  currentStep: string
  onNext: () => void
  isLoading?: boolean
}

const StepForm = ({ currentStep, onNext, isLoading = false }: StepFormProps) => {
  const renderStepForm = () => {
    switch (currentStep) {
      case 'basic-details':
        return <BasicDetailsForm onNext={onNext} isLoading={isLoading} />
      case 'business-info':
        return <BusinessInfoForm onNext={onNext} isLoading={isLoading} />
      case 'business-pan':
        return <BusinessPANForm onNext={onNext} isLoading={isLoading} />
      case 'gstin':
        return <GSTINForm onNext={onNext} isLoading={isLoading} />
      case 'director-kyc':
        return <DirectorKYCForm onNext={onNext} isLoading={isLoading} />
      default:
        return <BasicDetailsForm onNext={onNext} isLoading={isLoading} />
    }
  }

  return (
    <div className="basis-0 grow h-full min-h-px min-w-px relative shrink-0">
      {renderStepForm()}
    </div>
  )
}

export default StepForm
