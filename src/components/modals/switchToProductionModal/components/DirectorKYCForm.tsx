import { useState } from 'react'
import { ArrowRight, AlertCircle } from "lucide-react"
import type { OnboardingStatus } from '@/hooks/useOnboardingStatus'
import type { OnboardingStepsStatus } from '@/hooks/useOnboardingSteps'

interface DirectorKYCFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
  initialData?: OnboardingStatus | null
  stepsStatus?: OnboardingStepsStatus
}

const DirectorKYCForm = ({ onNext: _onNext, onPrevious: _onPrevious, showPrevious: _showPrevious = false, isLoading: externalLoading = false, initialData: _initialData, stepsStatus: _stepsStatus }: DirectorKYCFormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleContinue = () => {
    try {
      setIsLoading(true)
      setError('')

      // Get current domain for redirect URL
      const redirectUri = encodeURIComponent(`${window.location.origin}/kyc-callback`)

      // Construct DigiLocker URL with required parameters
      const digilockerUrl = `https://digilocker.idto.ai/digilocker?client_id=28d04bf7-9fa4-46ea-ad39-9d466c1ca3bf&redirect_uri=${redirectUri}&redirect_to_signup=false&req_docs=ADHAR`

      // Redirect to DigiLocker authentication URL
      window.location.href = digilockerUrl
      
      // Note: User will be redirected away, so we don't call onNext() here
      // The callback page will handle the next step
    } catch (err: any) {
      console.error('DigiLocker initiation error:', err)
      setError(
        err?.message || 
        'Failed to initiate DigiLocker verification. Please try again.'
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full min-h-px min-w-px relative rounded shrink-0">
      <div className="flex flex-col gap-4 items-start p-6 relative rounded-[inherit] size-full">
        {/* Header */}
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <p className="font-bold leading-7 relative shrink-0 text-lg text-[#616675] tracking-[-0.18px] w-full">
            KYC with Digilocker
          </p>
          <div className="flex gap-2 items-center px-0 py-2 relative shrink-0 w-full">
            <p className="font-normal leading-[1.4] grow min-h-px min-w-px relative shrink-0 text-xs text-[#9296a0] tracking-[-0.12px]">
              You'll be redirected to Digilocker to verify your details securely.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="grow flex flex-col gap-4 items-center min-h-px min-w-px relative shrink-0 w-full">
          {/* Digilocker Image */}
          <div className="h-[213px] relative rounded-3xl shrink-0 w-[212px]">
            <img
              alt=""
              className="absolute inset-0 max-w-none object-50%-50% object-cover pointer-events-none rounded-3xl size-full"
              src={'https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/digilocker_preview.png'}
            />
          </div>

          {/* Security Badge */}
          <div className="flex gap-1 items-center relative shrink-0">
            <div className="overflow-clip relative shrink-0 size-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M10 19.275L1.25 14.6698V1.7605L2.46075 2.16408C4.53783 2.85644 6.81375 2.60661 8.69117 1.48016L10.0235 0.680786L10.9502 1.29866C12.8097 2.53828 15.1251 2.88413 17.2657 2.24197L18.75 1.79667V14.6698L10 19.275Z" fill="#44BD42" />
              </svg>
            </div>
            <p className="font-semibold leading-6 relative shrink-0 text-[#44bd42] text-sm text-nowrap tracking-[-0.28px] whitespace-pre">
              Secured by Govt. of India
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-lg w-full">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900 mb-1">Verification Failed</p>
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* Info Box */}
          <div className="flex gap-3 items-start p-4 bg-blue-50 border border-blue-200 rounded-lg w-full">
            <div className="flex items-center justify-center w-5 h-5 rounded-full bg-blue-600 flex-shrink-0 mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-blue-900 mb-1">What happens next?</p>
              <p className="text-sm text-blue-700">
                You'll be securely redirected to DigiLocker to verify your Aadhaar. After verification, you'll return here automatically to complete your KYB application.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-center justify-end relative shrink-0 w-full">
          <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
            <button
              onClick={handleContinue}
              disabled={isLoading || externalLoading}
              className="flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-[inherit] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#0019ff] border-t-transparent rounded-full animate-spin" />
                  <p className="font-bold leading-4 relative text-xs text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                    Processing...
                  </p>
                </div>
              ) : (
                <>
                  <p className="font-bold leading-4 relative text-xs text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                    Continue
                  </p>
                  <ArrowRight className="size-4 text-[#0019ff]" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DirectorKYCForm
