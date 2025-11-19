import { useState, useEffect } from 'react'
import { ArrowRight, AlertCircle } from 'lucide-react'
import { z } from 'zod'
import type { OnboardingStatus } from '@/hooks/useOnboardingStatus'
import type { OnboardingStepsStatus } from '@/hooks/useOnboardingSteps'
import { updateGST } from '@/api/onboardingApi'
import { invalidateOnboardingSteps } from '@/store/onboardingStepsStore'

interface GSTINFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
  initialData?: OnboardingStatus | null
  stepsStatus?: OnboardingStepsStatus
}

// Zod validation schema for GSTIN
const gstinSchema = z.object({
  gst_number: z.string()
    .min(1, 'GSTIN is required')
    .regex(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[0-9]{1}[A-Z]{1}[0-9A-Z]{1}$/, 'Please enter a valid 15-digit GSTIN (e.g., 22AAAAA0000A1Z5)')
    .length(15, 'GSTIN must be exactly 15 characters')
})

const GSTINForm = ({ onNext, onPrevious, showPrevious = false, isLoading: externalLoading = false, initialData }: GSTINFormProps) => {
  const [formData, setFormData] = useState({
    gst_number: ''
  })

  const [errors, setErrors] = useState({
    gst_number: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Note: initialData no longer contains gst_number
  // This would need to come from user profile or be fetched separately
  // For now, we'll just use the form's initial state

  const handleInputChange = (value: string) => {
    // Convert to uppercase automatically and remove spaces
    const upperValue = value.toUpperCase().replace(/\s/g, '')
    setFormData({ gst_number: upperValue })
    // Clear error when user starts typing
    setErrors({ gst_number: '' })
    setApiError('')
  }

  const validateField = () => {
    const result = gstinSchema.safeParse(formData)
    
    if (!result.success) {
      const fieldError = result.error.issues.find(issue => issue.path[0] === 'gst_number')
      if (fieldError) {
        setErrors({ gst_number: fieldError.message })
      }
    } else {
      setErrors({ gst_number: '' })
    }
  }

  const validateForm = (): boolean => {
    try {
      gstinSchema.parse(formData)
      setErrors({ gst_number: '' })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0]?.message || ''
        setErrors({ gst_number: errorMessage })
      }
      return false
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setApiError('')

    try {
      const payload = {
        gst_number: formData.gst_number
      }
      const response = await updateGST(payload)
      
      // Check if verification matched
      if (!response.verification_result?.matched) {
        setApiError('GST verification failed: Registered name does not match with GST records. Please verify your registered business name.')
        return
      }
      
      invalidateOnboardingSteps() // Invalidate cache so it refetches
      onNext()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Failed to verify GST. Please check the GST number and try again.'
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.gst_number.length === 15

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full min-h-px min-w-px relative rounded shrink-0">
      <div className="flex flex-col gap-4 items-start p-6 relative rounded-[inherit] size-full">
        {/* Header */}
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <p className="font-bold leading-7 relative shrink-0 text-lg text-[#616675] tracking-[-0.18px] w-full">
            GSTIN Verification
          </p>
          <div className="flex gap-2 items-center px-0 py-2 relative shrink-0 w-full">
            <p className="font-normal leading-[1.4] grow min-h-px min-w-px relative shrink-0 text-xs text-[#9296a0] tracking-[-0.12px]">
              Please provide your GSTIN number
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
        <div className="grow flex flex-col gap-4 items-start min-h-px min-w-px relative shrink-0 w-full">
          {/* GSTIN Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                <span>Enter 15-digit GSTIN </span>
                <span className="text-[#b43e28]">*</span>
              </p>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.gst_number ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
              <input
                type="text"
                value={formData.gst_number}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={validateField}
                placeholder="22AAAAA0000A1Z5"
                maxLength={15}
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0] uppercase"
              />
            </div>
            {errors.gst_number && (
              <p className="text-xs text-red-600 mt-1">{errors.gst_number}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-center justify-end relative shrink-0 w-full">
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

export default GSTINForm
