import { useState, useEffect } from "react"
import { ArrowRight, AlertCircle } from "lucide-react"
import { z } from "zod"
import type { OnboardingStatus } from "@/hooks/useOnboardingStatus"
import type { OnboardingStepsStatus } from "@/hooks/useOnboardingSteps"
import { updatePAN, updateGST } from "@/api/onboardingApi"
import { invalidateOnboardingSteps } from "@/store/onboardingStepsStore"
import { fetchUserProfile, invalidateUserProfile, useUserProfileStore } from "@/store/userProfileStore"
import { useIsMobile } from "@/hooks/use-mobile"

interface PANAndGSTFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
  initialData?: OnboardingStatus | null
  stepsStatus?: OnboardingStepsStatus
}

// Zod validation schemas
const panSchema = z.object({
  pan_number: z.string()
    .min(1, 'PAN number is required')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number (e.g., ABCDE1234F)')
    .length(10, 'PAN number must be exactly 10 characters')
})

const gstinSchema = z.object({
  gst_number: z.string()
    .min(1, 'GSTIN is required')
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/, 'Please enter a valid 15-digit GSTIN (e.g., 22AAAAA0000A1Z5)')
    .length(15, 'GSTIN must be exactly 15 characters')
})

const PANAndGSTForm = ({ onNext, onPrevious: _onPrevious, showPrevious: _showPrevious = false, isLoading: externalLoading = false, initialData: _initialData, stepsStatus }: PANAndGSTFormProps) => {
  const isMobile = useIsMobile()
  const userProfile = useUserProfileStore((state) => state.data)
  const isProprietorship = userProfile?.entity_type === 'proprietorship'
  
  const [formData, setFormData] = useState({
    pan_number: '',
    gst_number: ''
  })
  const hasGSTInput = formData.gst_number.trim().length > 0

  const [errors, setErrors] = useState({
    pan_number: '',
    gst_number: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Pre-fill form data from user profile if available
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        pan_number: userProfile.pan_number || prev.pan_number,
        gst_number: userProfile.gst_number || prev.gst_number
      }))
    }
  }, [userProfile])

  const handlePANChange = (value: string) => {
    const upperValue = value.toUpperCase()
    setFormData(prev => ({ ...prev, pan_number: upperValue }))
    setErrors(prev => ({ ...prev, pan_number: '' }))
    setApiError('')
  }

  const handleGSTChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/\s/g, '')
    setFormData(prev => ({ ...prev, gst_number: upperValue }))
    setErrors(prev => ({ ...prev, gst_number: '' }))
    setApiError('')
  }

  const validatePAN = () => {
    const result = panSchema.safeParse({ pan_number: formData.pan_number })
    if (!result.success) {
      const fieldError = result.error.issues.find(issue => issue.path[0] === 'pan_number')
      if (fieldError) {
        setErrors(prev => ({ ...prev, pan_number: fieldError.message }))
      }
      return false
    } else {
      setErrors(prev => ({ ...prev, pan_number: '' }))
      return true
    }
  }

  const validateGST = () => {
    if (isProprietorship && !hasGSTInput) {
      setErrors(prev => ({ ...prev, gst_number: '' }))
      return true
    }

    const result = gstinSchema.safeParse({ gst_number: formData.gst_number })
    if (!result.success) {
      const fieldError = result.error.issues.find(issue => issue.path[0] === 'gst_number')
      if (fieldError) {
        setErrors(prev => ({ ...prev, gst_number: fieldError.message }))
      }
      return false
    } else {
      setErrors(prev => ({ ...prev, gst_number: '' }))
      return true
    }
  }

  const validateForm = (): boolean => {
    const panValid = validatePAN()
    const gstValid = validateGST()
    return panValid && gstValid
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setApiError('')

    try {
      // Submit PAN only if not already completed
      if (!stepsStatus?.businessPAN) {
        const panPayload = { pan_number: formData.pan_number }
        const panResponse = await updatePAN(panPayload)
        
        if (!panResponse.verification_result?.matched) {
          setApiError('PAN verification failed: Registered name does not match with PAN records. Please verify your registered business name.')
          setIsLoading(false)
          return
        }
      }

      const storedGST = (userProfile?.gst_number || '').trim().toUpperCase()
      const shouldVerifyGST = hasGSTInput && (!stepsStatus?.gstin || storedGST !== formData.gst_number)

      // If a GSTIN is provided, verify it even when proprietorship has marked GST as not applicable.
      if (shouldVerifyGST) {
        const gstPayload = { gst_number: formData.gst_number }
        const gstResponse = await updateGST(gstPayload)
        
        if (!gstResponse.verification_result?.matched) {
          setApiError('GST verification failed: Registered name does not match with GST records. Please verify your registered business name.')
          setIsLoading(false)
          return
        }
      }
      
      invalidateOnboardingSteps() // Invalidate cache so it refetches
      invalidateUserProfile()
      await fetchUserProfile().catch(() => null)
      onNext()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Failed to verify. Please check the details and try again.'
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Proprietorship can proceed without GSTIN. If GSTIN is entered, it must be complete and verified.
  const isFormValid = formData.pan_number.length === 10 && (isProprietorship ? (!hasGSTInput || formData.gst_number.length === 15) : formData.gst_number.length === 15)

  // Mobile layout matching Figma
  if (isMobile) {
    return (
      <div className="flex flex-col gap-8 w-full">
        {/* Title and Subtitle - Centered */}
        <div className="flex flex-col gap-2 items-center text-center w-full">
          <h2 className="text-[24px] font-[500] leading-[1.24] text-[#131b31] tracking-[-0.24px] w-full">
            Provide your Business PAN & GST
          </h2>
          <p className="text-[14px] font-medium leading-[20px] text-[#616675] tracking-[-0.14px] w-full">
            Please enter your Business PAN and GSTIN numbers
          </p>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-lg w-full">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">Verification Failed</p>
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-4 w-full">
          {/* PAN Number Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              <span>Enter your 10-digit Business PAN Number </span>
              <span className="text-[#b43e28]">*</span>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.pan_number ? 'border-red-500' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <input
                type="text"
                value={formData.pan_number}
                onChange={(e) => handlePANChange(e.target.value)}
                onBlur={validatePAN}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0] uppercase"
              />
            </div>
            {errors.pan_number && (
              <p className="text-xs text-red-600 mt-1">{errors.pan_number}</p>
            )}
          </div>

          {/* GSTIN Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              <span>Enter 15-digit GSTIN </span>
              {!isProprietorship && <span className="text-[#b43e28]">*</span>}
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.gst_number ? 'border-red-500' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <input
                type="text"
                value={formData.gst_number}
                onChange={(e) => handleGSTChange(e.target.value)}
                onBlur={validateGST}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0] uppercase"
              />
            </div>
            {errors.gst_number && (
              <p className="text-xs text-red-600 mt-1">{errors.gst_number}</p>
            )}
            {isProprietorship && !errors.gst_number && (
              <p className="text-xs text-[#9296a0] mt-1">Optional for sole proprietorship. If entered, it will be verified.</p>
            )}
          </div>
        </div>

        {/* Continue Button - Centered at bottom */}
        <div className="flex flex-col items-center justify-end w-full mt-auto">
          <button
            onClick={handleSubmit}
            disabled={isLoading || externalLoading || !isFormValid}
            className="flex h-12 w-full max-w-[353px] items-center justify-center gap-2 rounded-[8px] border border-[#e7e8ea] bg-[#E6E8FF] text-[12px] font-bold leading-[16px] text-[#0019FF] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 tracking-[-0.12px]"
          >
            {(isLoading || externalLoading) ? (
              <>
                <div className="w-4 h-4 border-2 border-[#0019ff] border-t-transparent rounded-full animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="size-4" strokeWidth={2} />
              </>
            )}
          </button>
        </div>
      </div>
    )
  }

  // Desktop layout (existing)
  return (
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full min-h-px min-w-px relative rounded shrink-0">
      <div className="flex flex-col gap-4 items-start p-6 relative rounded-[inherit] size-full">
        {/* Header */}
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <p className="font-bold leading-7 relative shrink-0 text-lg text-[#616675] tracking-[-0.18px] w-full">
            Business PAN & GST Verification
          </p>
          <div className="flex gap-2 items-center px-0 py-2 relative shrink-0 w-full">
            <p className="font-normal leading-[1.4] grow min-h-px min-w-px relative shrink-0 text-xs text-[#9296a0] tracking-[-0.12px]">
              Please enter your Business PAN and GSTIN numbers
            </p>
          </div>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-lg w-full mb-4">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">Verification Failed</p>
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grow flex flex-col gap-6 items-start min-h-px min-w-px relative shrink-0 w-full">
          {/* PAN Number Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                <span>Enter your 10-digit Business PAN Number </span>
                <span className="text-[#b43e28]">*</span>
              </p>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.pan_number ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
              <input
                type="text"
                value={formData.pan_number}
                onChange={(e) => handlePANChange(e.target.value)}
                onBlur={validatePAN}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0] uppercase"
              />
            </div>
            {errors.pan_number && (
              <p className="text-xs text-red-600 mt-1">{errors.pan_number}</p>
            )}
          </div>

          {/* GSTIN Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                <span>Enter 15-digit GSTIN </span>
                {!isProprietorship && <span className="text-[#b43e28]">*</span>}
              </p>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.gst_number ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
              <input
                type="text"
                value={formData.gst_number}
                onChange={(e) => handleGSTChange(e.target.value)}
                onBlur={validateGST}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0] uppercase"
              />
            </div>
            {errors.gst_number && (
              <p className="text-xs text-red-600 mt-1">{errors.gst_number}</p>
            )}
            {isProprietorship && !errors.gst_number && (
              <p className="text-xs text-[#9296a0] mt-1">Optional for sole proprietorship. If entered, it will be verified.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-center justify-end relative shrink-0 w-full">
          {_showPrevious && _onPrevious && (
            <button
              onClick={_onPrevious}
              disabled={isLoading || externalLoading}
              className="px-6 py-3.5 text-xs font-medium text-[#616675] border border-[#e7e8ea] rounded-lg hover:bg-[#f7f7f8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
          )}
          <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
            <button
              onClick={handleSubmit}
              disabled={isLoading || externalLoading || !isFormValid}
              className="flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-[inherit] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {(isLoading || externalLoading) ? (
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

export default PANAndGSTForm
