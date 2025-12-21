import { useState } from "react"
import { ArrowRight, AlertCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OnboardingStatus } from "@/hooks/useOnboardingStatus"
import type { OnboardingStepsStatus } from "@/hooks/useOnboardingSteps"
import { updateBasicDetails } from "@/api/onboardingApi"
import { invalidateOnboardingSteps } from "@/store/onboardingStepsStore"
import { useIsMobile } from "@/hooks/use-mobile"

interface BasicDetailsFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
  initialData?: OnboardingStatus | null
  stepsStatus?: OnboardingStepsStatus
}

const BasicDetailsForm = ({ onNext, onPrevious: _onPrevious, showPrevious: _showPrevious = false, isLoading: externalLoading = false, initialData: _initialData, stepsStatus: _stepsStatus }: BasicDetailsFormProps) => {
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    brand_name: '',
    website_url: '',
    entity_type: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [websiteError, setWebsiteError] = useState('')

  // Note: initialData no longer contains brand_name or industry
  // These would need to come from user profile or be fetched separately
  // For now, we'll just use the form's initial state

  const validateWebsiteUrl = (url: string): string => {
    if (!url.trim()) {
      return '' // Empty URL is allowed (optional field)
    }
    
    // Try to create a URL object to validate
    try {
      // Add protocol if missing
      let urlToValidate = url.trim()
      if (!urlToValidate.match(/^https?:\/\//i)) {
        urlToValidate = `https://${urlToValidate}`
      }
      
      new URL(urlToValidate)
      
      // Additional validation: must have a valid domain
      const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/i
      if (!urlPattern.test(urlToValidate)) {
        return 'Please enter a valid website URL (e.g., example.com or https://example.com)'
      }
      
      return ''
    } catch {
      return 'Please enter a valid website URL (e.g., example.com or https://example.com)'
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    
    // Validate website URL in real-time
    if (field === 'website_url') {
      setWebsiteError(validateWebsiteUrl(value))
    }
  }

  const handleWebsiteBlur = () => {
    setWebsiteError(validateWebsiteUrl(formData.website_url))
  }

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.entity_type) {
      setError('Please select an Entity Type before continuing')
      return
    }

    // Validate website URL
    const websiteValidationError = validateWebsiteUrl(formData.website_url)
    if (websiteValidationError) {
      setWebsiteError(websiteValidationError)
      return
    }

    setIsLoading(true)
    setError('')
    setWebsiteError('')

    try {
      const payload = {
        brand_name: formData.brand_name,
        website_url: formData.website_url,
        entity_type: formData.entity_type
      }
      await updateBasicDetails(payload)
      invalidateOnboardingSteps() // Invalidate cache so it refetches
      onNext()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Failed to update basic details. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = formData.entity_type !== ''
  
  // Mobile layout matching Figma
  if (isMobile) {
    return (
      <div className="flex flex-col gap-8 w-full">
        {/* Title and Subtitle - Centered */}
        <div className="flex flex-col gap-2 items-center text-center w-full">
          <h2 className="text-[24px] font-[500] leading-[1.24] text-[#131b31] tracking-[-0.24px] w-full">
            Provide your basic details
          </h2>
          <p className="text-[14px] font-medium leading-[20px] text-[#616675] tracking-[-0.14px] w-full">
            Enter your brand details and primary contact information to get started.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-lg w-full">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form Fields */}
        <div className="flex flex-col gap-4 w-full">
          {/* Brand Name Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              Brand Name of the Business
            </label>
            <div className="bg-[#f7f7f8] border border-[#e7e8ea] flex h-12 items-center px-3 py-2 rounded-[6px] w-full">
              <input
                type="text"
                value={formData.brand_name}
                onChange={(e) => handleInputChange('brand_name', e.target.value)}
                placeholder="e.g., Zomato, Razorpay"
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
          </div>

          {/* Website URL Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              Website URL
            </label>
            <div className={`bg-[#f7f7f8] border ${websiteError ? 'border-red-500' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <input
                type="text"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                onBlur={handleWebsiteBlur}
                placeholder="Company website or landing page (if any)"
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {websiteError && (
              <p className="text-xs text-red-600 mt-1">{websiteError}</p>
            )}
          </div>

          {/* Entity Type Field */}
          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675] tracking-[-0.12px]">
              <span>Entity Type </span>
              <span className="text-[#b43e28]">*</span>
            </label>
            <Select value={formData.entity_type} onValueChange={(value) => handleInputChange('entity_type', value)}>
              <SelectTrigger className="bg-[#f7f7f8] border border-[#e7e8ea] h-12 w-full rounded-[6px] text-[16px]">
                <SelectValue placeholder="Select Entity Type" className="text-[#9296a0]" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="private_limited">Private Limited Company</SelectItem>
                <SelectItem value="public_limited">Public Limited Company</SelectItem>
                <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                <SelectItem value="partnership">Partnership Firm</SelectItem>
                <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                <SelectItem value="opc">One Person Company (OPC)</SelectItem>
                <SelectItem value="trust">Trust</SelectItem>
                <SelectItem value="society">Society</SelectItem>
                <SelectItem value="ngo">NGO</SelectItem>
              </SelectContent>
            </Select>
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
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full min-h-0 relative rounded shrink-0 flex flex-col overflow-hidden">
      <div className="flex flex-col gap-4 items-start p-6 relative rounded-[inherit] w-full h-full overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <p className="font-bold leading-7 relative shrink-0 text-lg text-[#616675] tracking-[-0.18px] w-full">
            Provide your basic details
          </p>
          <div className="flex gap-2 items-center px-0 py-2 relative shrink-0 w-full">
            <p className="font-normal leading-[1.4] grow min-h-px min-w-px relative shrink-0 text-xs text-[#9296a0] tracking-[-0.12px]">
              Enter your brand details and primary contact information to get started.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="flex gap-3 items-start p-4 bg-red-50 border border-red-200 rounded-lg w-full">
            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">Error</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Form Fields - Scrollable */}
        <div className="flex-1 min-h-0 flex flex-col gap-4 items-start relative shrink-0 w-full overflow-y-auto pr-2">
          {/* Brand Name Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                Brand Name of the Business
              </p>
            </label>
            <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full">
              <input
                type="text"
                value={formData.brand_name}
                onChange={(e) => handleInputChange('brand_name', e.target.value)}
                placeholder="e.g., Zomato, Razorpay"
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
          </div>

          {/* Website URL Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                Website URL
              </p>
            </label>
            <div className={`bg-[#f7f7f8] border ${websiteError ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
              <input
                type="text"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                onBlur={handleWebsiteBlur}
                placeholder="Company website or landing page (if any)"
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
            {websiteError && (
              <p className="text-xs text-red-600 mt-1">{websiteError}</p>
            )}
          </div>

          {/* Entity Type Field */}
          <div className="flex gap-5 items-start relative shrink-0 w-full">
            <div className="grow flex flex-col gap-1 items-start min-h-px min-w-px relative shrink-0">
              <label className="flex gap-2.5 items-center relative shrink-0 w-full">
                <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  <span>Entity Type </span>
                  <span className="text-[#b43e28]">*</span>
                </p>
              </label>
              <Select value={formData.entity_type} onValueChange={(value) => handleInputChange('entity_type', value)}>
                <SelectTrigger className="bg-[#f7f7f8] border border-[#e7e8ea] h-12 w-full rounded-md text-base">
                  <SelectValue placeholder="Select Entity Type" className="text-[#9296a0]" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private_limited">Private Limited Company</SelectItem>
                  <SelectItem value="public_limited">Public Limited Company</SelectItem>
                  <SelectItem value="llp">Limited Liability Partnership (LLP)</SelectItem>
                  <SelectItem value="partnership">Partnership Firm</SelectItem>
                  <SelectItem value="proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="opc">One Person Company (OPC)</SelectItem>
                  <SelectItem value="trust">Trust</SelectItem>
                  <SelectItem value="society">Society</SelectItem>
                  <SelectItem value="ngo">NGO</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-center justify-end relative shrink-0 w-full">
          {/* Continue Button */}
          <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
            <button
              onClick={handleSubmit}
              disabled={isLoading || externalLoading || !isFormValid}
              className="flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-[inherit] disabled:opacity-50 disabled:cursor-not-allowed">
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
                  <div className="relative shrink-0 size-4 flex items-center justify-center">
                    <ArrowRight className="w-4 h-4 text-[#0019ff]" />
                  </div>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BasicDetailsForm
