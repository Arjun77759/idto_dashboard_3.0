import { useState, useEffect } from "react"
import { ArrowRight, AlertCircle } from "lucide-react"
import { z } from "zod"
import type { OnboardingStatus } from "@/hooks/useOnboardingStatus"
import type { OnboardingStepsStatus } from "@/hooks/useOnboardingSteps"
import { updateBusinessInfo } from "@/api/onboardingApi"
import { invalidateOnboardingSteps } from "@/store/onboardingStepsStore"
import { useIsMobile } from "@/hooks/use-mobile"

interface BusinessInfoFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
  initialData?: OnboardingStatus | null
  stepsStatus?: OnboardingStepsStatus
}

// Zod validation schemas
const businessInfoSchema = z.object({
  registered_name: z.string().min(1, 'Registered name is required').trim(),
  authorized_email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  authorized_mobile: z.string()
    .min(1, 'Mobile number is required')
    .regex(/^[0-9]{10}$/, 'Please enter a valid 10-digit mobile number'),
  office_address: z.string().min(1, 'Office address is required').trim(),
  pin_code: z.string()
    .min(1, 'Pin code is required')
    .regex(/^[0-9]{6}$/, 'Please enter a valid 6-digit pin code')
})

const BusinessInfoForm = ({ onNext, onPrevious: _onPrevious, showPrevious: _showPrevious = false, isLoading: externalLoading = false, initialData: _initialData }: BusinessInfoFormProps) => {
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    registered_name: '',
    authorized_email: '',
    authorized_mobile: '',
    office_address: '',
    pin_code: ''
  })

  const [errors, setErrors] = useState({
    registered_name: '',
    authorized_email: '',
    authorized_mobile: '',
    office_address: '',
    pin_code: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [apiError, setApiError] = useState('')

  // Note: initialData no longer contains registered_name
  // This would need to come from user profile or be fetched separately
  // For now, we'll just use the form's initial state

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [field]: '' }))
    setApiError('')
  }

  const validateField = (field: keyof typeof formData) => {
    // Validate the entire form but only show error for the specific field
    const result = businessInfoSchema.safeParse(formData)
    
    if (!result.success) {
      // Find error for this specific field
      const fieldError = result.error.issues.find(issue => issue.path[0] === field)
      if (fieldError) {
        setErrors(prev => ({ ...prev, [field]: fieldError.message }))
      } else {
        // No error for this field, clear it
        setErrors(prev => ({ ...prev, [field]: '' }))
      }
    } else {
      // No errors at all, clear this field's error
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    try {
      // Validate using Zod schema
      businessInfoSchema.parse(formData)
      
      // Clear all errors if validation passes
      setErrors({
        registered_name: '',
        authorized_email: '',
        authorized_mobile: '',
        office_address: '',
        pin_code: ''
      })
      
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = {
          registered_name: '',
          authorized_email: '',
          authorized_mobile: '',
          office_address: '',
          pin_code: ''
        }
        
        // Map Zod errors to form errors
        error.issues.forEach((err) => {
          const field = err.path[0] as keyof typeof newErrors
          if (field && !newErrors[field]) {
            newErrors[field] = err.message
          }
        })
        
        setErrors(newErrors)
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
        registered_name: formData.registered_name,
        email: formData.authorized_email,
        mobile: formData.authorized_mobile,
        address: formData.office_address,
        pin_code: formData.pin_code
      }
      await updateBusinessInfo(payload)
      invalidateOnboardingSteps() // Invalidate cache so it refetches
      onNext()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Failed to update business information. Please try again.'
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.registered_name && formData.authorized_email && formData.authorized_mobile && formData.office_address && formData.pin_code

  // Mobile layout matching Figma
  if (isMobile) {
    return (
      <div className="flex flex-col gap-8 w-full">
        {/* Title and Subtitle - Centered */}
        <div className="flex flex-col gap-2 items-center text-center w-full">
          <h2 className="text-[24px] font-[500] leading-[1.24] text-[#131b31] tracking-[-0.24px] w-full">
            Tell us about your Business
          </h2>
          <p className="text-[14px] font-medium leading-[20px] text-[#616675] tracking-[-0.14px] w-full">
            Provide your registered business information and office address for verification.
          </p>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-lg w-full">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">Error</p>
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-4 w-full">
          {/* Registered Name Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              <span>Registered Name of Business </span>
              <span className="text-[#b43e28]">*</span>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.registered_name ? 'border-red-500' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <input
                type="text"
                value={formData.registered_name}
                onChange={(e) => handleInputChange('registered_name', e.target.value)}
                onBlur={() => validateField('registered_name')}
                placeholder="e.g. XYZ Private Limited"
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {errors.registered_name && (
              <p className="text-xs text-red-600 mt-1">{errors.registered_name}</p>
            )}
          </div>

          {/* Email Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              <span>Authorized Signatory Email </span>
              <span className="text-[#b43e28]">*</span>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.authorized_email ? 'border-red-500' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <input
                type="email"
                value={formData.authorized_email}
                onChange={(e) => handleInputChange('authorized_email', e.target.value)}
                onBlur={() => validateField('authorized_email')}
                placeholder="Enter email"
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {errors.authorized_email && (
              <p className="text-xs text-red-600 mt-1">{errors.authorized_email}</p>
            )}
          </div>

          {/* Mobile Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              <span>Authorized Signatory Mobile Number </span>
              <span className="text-[#b43e28]">*</span>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.authorized_mobile ? 'border-red-500' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <span className="text-[16px] font-normal leading-[1.5] text-[#616675] tracking-[-0.16px]">+91</span>
              <input
                type="tel"
                value={formData.authorized_mobile}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  handleInputChange('authorized_mobile', value)
                }}
                onBlur={() => validateField('authorized_mobile')}
                placeholder="986XXXX854"
                maxLength={10}
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0] ml-2"
              />
            </div>
            {errors.authorized_mobile && (
              <p className="text-xs text-red-600 mt-1">{errors.authorized_mobile}</p>
            )}
          </div>

          {/* Office Address Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              <span>Office Address </span>
              <span className="text-[#b43e28]">*</span>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.office_address ? 'border-red-500' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <input
                type="text"
                value={formData.office_address}
                onChange={(e) => handleInputChange('office_address', e.target.value)}
                onBlur={() => validateField('office_address')}
                placeholder="3rd floor, Orchid center, Golf course road, Sec 53"
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {errors.office_address && (
              <p className="text-xs text-red-600 mt-1">{errors.office_address}</p>
            )}
          </div>

          {/* Pin Code Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              <span>Pin Code </span>
              <span className="text-[#b43e28]">*</span>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.pin_code ? 'border-red-500' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <input
                type="text"
                value={formData.pin_code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  handleInputChange('pin_code', value)
                }}
                onBlur={() => validateField('pin_code')}
                placeholder="122002"
                maxLength={6}
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {errors.pin_code && (
              <p className="text-xs text-red-600 mt-1">{errors.pin_code}</p>
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
            Tell us about your Business
          </p>
          <div className="flex gap-2 items-center px-0 py-2 relative shrink-0 w-full">
            <p className="font-normal leading-[1.4] grow min-h-px min-w-px relative shrink-0 text-xs text-[#9296a0] tracking-[-0.12px]">
              Provide your registered business information and office address for verification.
            </p>
          </div>
        </div>

        {/* API Error Message */}
        {apiError && (
          <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-lg w-full">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">Error</p>
              <p className="text-sm text-red-700">{apiError}</p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="grow flex flex-col gap-4 items-start min-h-px min-w-px relative shrink-0 w-full">
          {/* Registered Name Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                <span>Registered Name of Business </span>
                <span className="text-[#b43e28]">*</span>
              </p>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.registered_name ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
              <input
                type="text"
                value={formData.registered_name}
                onChange={(e) => handleInputChange('registered_name', e.target.value)}
                onBlur={() => validateField('registered_name')}
                placeholder="e.g. XYZ Private Limited"
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {errors.registered_name && (
              <p className="text-xs text-red-600 mt-1">{errors.registered_name}</p>
            )}
          </div>

          {/* Email and Mobile Row */}
          <div className="flex flex-col md:flex-row gap-5 items-start relative shrink-0 w-full">
            {/* Email Field */}
            <div className="flex-1 flex flex-col gap-1 items-start w-full">
              <label className="flex gap-2.5 items-center relative shrink-0 w-full">
                <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  <span>Authorized Signatory Email </span>
                  <span className="text-[#b43e28]">*</span>
                </p>
              </label>
              <div className={`bg-[#f7f7f8] border ${errors.authorized_email ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
                <input
                  type="email"
                  value={formData.authorized_email}
                  onChange={(e) => handleInputChange('authorized_email', e.target.value)}
                  onBlur={() => validateField('authorized_email')}
                  placeholder="Enter email"
                  className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
                />
              </div>
              {errors.authorized_email && (
                <p className="text-xs text-red-600 mt-1 w-full">{errors.authorized_email}</p>
              )}
            </div>

            {/* Mobile Field */}
            <div className="flex-1 flex flex-col gap-1 items-start w-full">
              <label className="flex gap-2.5 items-center relative shrink-0 w-full">
                <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  <span>Authorized Signatory Mobile Number </span>
                  <span className="text-[#b43e28]">*</span>
                </p>
              </label>
              <div className={`bg-[#f7f7f8] border ${errors.authorized_mobile ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
                <div className="flex gap-2 items-center justify-center relative shrink-0">
                  <p className="font-normal leading-6 relative shrink-0 text-base text-[#616675] text-nowrap tracking-[-0.16px] whitespace-pre">
                    +91
                  </p>
                </div>
                <input
                  type="tel"
                  value={formData.authorized_mobile}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '')
                    handleInputChange('authorized_mobile', value)
                  }}
                  onBlur={() => validateField('authorized_mobile')}
                  placeholder="986XXXX854"
                  maxLength={10}
                  className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
                />
              </div>
              {errors.authorized_mobile && (
                <p className="text-xs text-red-600 mt-1 w-full">{errors.authorized_mobile}</p>
              )}
            </div>
          </div>

          {/* Office Address Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                <span>Office Address </span>
                <span className="text-[#b43e28]">*</span>
              </p>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.office_address ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
              <input
                type="text"
                value={formData.office_address}
                onChange={(e) => handleInputChange('office_address', e.target.value)}
                onBlur={() => validateField('office_address')}
                placeholder="3rd floor, Orchid center, Golf course road, Sec 53"
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {errors.office_address && (
              <p className="text-xs text-red-600 mt-1">{errors.office_address}</p>
            )}
          </div>

          {/* Pin Code Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                <span>Pin Code </span>
                <span className="text-[#b43e28]">*</span>
              </p>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.pin_code ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
              <input
                type="text"
                value={formData.pin_code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '')
                  handleInputChange('pin_code', value)
                }}
                onBlur={() => validateField('pin_code')}
                placeholder="122002"
                maxLength={6}
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {errors.pin_code && (
              <p className="text-xs text-red-600 mt-1">{errors.pin_code}</p>
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

export default BusinessInfoForm
