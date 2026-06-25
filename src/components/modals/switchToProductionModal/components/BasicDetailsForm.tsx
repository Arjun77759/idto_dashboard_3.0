import { useEffect, useState } from "react"
import { ArrowLeft, ArrowRight, AlertCircle, Building2, CheckCircle2, Clock3, HelpCircle, LockKeyhole, Mail, MapPin, Phone, Save, ShieldCheck, Sparkles, Timer, Globe2 } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { OnboardingStatus } from "@/hooks/useOnboardingStatus"
import type { OnboardingStepsStatus } from "@/hooks/useOnboardingSteps"
import { updateBasicDetails, updateBusinessInfo, updateProductionProgress } from "@/api/onboardingApi"
import { invalidateOnboardingSteps } from "@/store/onboardingStepsStore"
import { fetchOnboardingStatus } from "@/store/onboardingStore"
import { fetchUserProfile, invalidateUserProfile } from "@/store/userProfileStore"
import { useIsMobile } from "@/hooks/use-mobile"
import { useUserProfile } from "@/hooks/useUserProfile"
import idtoLogo from "@/assets/idto-logo.svg"
import { normalizeEntityType } from "@/lib/entityType"

interface BasicDetailsFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
  initialData?: OnboardingStatus | null
  stepsStatus?: OnboardingStepsStatus
}

const industryOptions = [
  'Banking & Financial Services',
  'Fintech & Payments',
  'Insurance',
  'E-commerce & Retail',
  'Healthcare',
  'Education',
  'Travel & Hospitality',
  'Real Estate',
  'Gaming',
  'Telecommunications',
  'Logistics & Transportation',
  'Professional Services',
  'Technology & SaaS',
  'Government & Public Sector',
  'Other',
]

const BasicDetailsForm = ({ onNext, onPrevious: _onPrevious, showPrevious: _showPrevious = false, isLoading: externalLoading = false, initialData: _initialData, stepsStatus: _stepsStatus }: BasicDetailsFormProps) => {
  const isMobile = useIsMobile()
  const { data: userProfile } = useUserProfile()
  const [formData, setFormData] = useState({
    brand_name: '',
    website_url: '',
    entity_type: '',
    industry: '',
    pin_code: '',
    registered_name: '',
    business_address: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [websiteError, setWebsiteError] = useState('')

  useEffect(() => {
    if (!userProfile) return
    setFormData((current) => ({
      brand_name: current.brand_name || userProfile.brand_name || '',
      website_url: current.website_url || userProfile.website_url || '',
      entity_type: current.entity_type || normalizeEntityType(userProfile.entity_type),
      industry: current.industry || userProfile.industry || '',
      pin_code: current.pin_code || userProfile.pin_code || '',
      registered_name: current.registered_name || userProfile.registered_name || '',
      business_address: current.business_address || userProfile.business_address || '',
    }))
  }, [userProfile])

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
    setHasSubmitted(true)

    // Validate required fields
    if (!formData.brand_name.trim()) {
      return
    }

    if (!formData.entity_type) {
      return
    }

    if (!formData.industry) {
      return
    }

    if (!formData.registered_name.trim() || !formData.business_address.trim()) {
      return
    }

    if (!/^\d{6}$/.test(formData.pin_code.trim())) {
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
        entity_type: formData.entity_type,
        industry: formData.industry,
        pin_code: formData.pin_code,
      }
      await Promise.all([
        updateBasicDetails(payload),
        updateBusinessInfo({
          registered_name: formData.registered_name.trim(),
          email: userProfile?.authorized_signatory_email || userProfile?.email || '',
          mobile: userProfile?.mobile || '',
          address: formData.business_address.trim(),
          pin_code: formData.pin_code.trim(),
        }),
      ])
      await updateProductionProgress('pan-gst')
      await fetchOnboardingStatus(true).catch(() => null)
      invalidateOnboardingSteps() // Invalidate cache so it refetches
      invalidateUserProfile()
      await fetchUserProfile().catch(() => null)
      onNext()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Failed to update basic details. Please try again.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const brandNameError = hasSubmitted && !formData.brand_name.trim() ? 'Brand name is required' : ''
  const entityTypeError = hasSubmitted && !formData.entity_type ? 'Select an entity type' : ''
  const industryError = hasSubmitted && !formData.industry ? 'Select an industry' : ''
  const pinCodeError = hasSubmitted && !/^\d{6}$/.test(formData.pin_code.trim()) ? 'Enter a valid 6-digit PIN' : ''
  const registeredNameError = hasSubmitted && !formData.registered_name.trim() ? 'Legal business name is required' : ''
  const businessAddressError = hasSubmitted && !formData.business_address.trim() ? 'Registered office address is required' : ''
  
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
            <div className={`bg-[#f7f7f8] border ${brandNameError ? 'border-[#ef4444] shadow-[0_0_0_3px_rgba(239,68,68,0.10)]' : 'border-[#e7e8ea]'} flex h-12 items-center px-3 py-2 rounded-[6px] w-full`}>
              <input
                type="text"
                value={formData.brand_name}
                onChange={(e) => handleInputChange('brand_name', e.target.value)}
                placeholder="Enter your brand name"
                className="font-medium text-[16px] leading-[1.5] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
              {brandNameError && <AlertCircle className="size-4 shrink-0 text-[#ef4444]" />}
            </div>
            {brandNameError && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#d92d20]">
                <AlertCircle className="size-3" />
                {brandNameError}
              </p>
            )}
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
              <SelectTrigger className={`bg-[#f7f7f8] border ${entityTypeError ? 'border-[#ef4444] shadow-[0_0_0_3px_rgba(239,68,68,0.10)]' : 'border-[#e7e8ea]'} h-12 w-full rounded-[6px] text-[16px]`}>
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
            {entityTypeError && (
              <p className="mt-1 inline-flex items-center gap-1 text-xs text-[#d92d20]">
                <AlertCircle className="size-3" />
                {entityTypeError}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675]">
              Industry
            </label>
            <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
              <SelectTrigger className={`h-12 w-full rounded-[6px] bg-[#f7f7f8] text-[16px] ${industryError ? 'border-[#ef4444]' : 'border-[#e7e8ea]'}`}>
                <SelectValue placeholder="Select industry" />
              </SelectTrigger>
              <SelectContent>
                {industryOptions.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {industryError && <p className="text-xs text-[#d92d20]">{industryError}</p>}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675]">
              Legal business name
            </label>
            <input
              type="text"
              value={formData.registered_name}
              onChange={(e) => handleInputChange('registered_name', e.target.value)}
              placeholder="Enter legal business name"
              className={`h-12 rounded-[6px] border bg-[#f7f7f8] px-3 text-[16px] outline-none ${registeredNameError ? 'border-[#ef4444]' : 'border-[#e7e8ea]'}`}
            />
            {registeredNameError && <p className="text-xs text-[#d92d20]">{registeredNameError}</p>}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675]">
              Registered office address
            </label>
            <input
              type="text"
              value={formData.business_address}
              onChange={(e) => handleInputChange('business_address', e.target.value)}
              placeholder="Enter registered office address"
              className={`h-12 rounded-[6px] border bg-[#f7f7f8] px-3 text-[16px] outline-none ${businessAddressError ? 'border-[#ef4444]' : 'border-[#e7e8ea]'}`}
            />
            {businessAddressError && <p className="text-xs text-[#d92d20]">{businessAddressError}</p>}
          </div>

          <div className="flex flex-col gap-1 w-full">
            <label className="text-[12px] font-medium leading-[1.4] text-[#616675]">PIN code</label>
            <input
              type="text"
              inputMode="numeric"
              value={formData.pin_code}
              onChange={(e) => handleInputChange('pin_code', e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit PIN"
              className={`h-12 rounded-[6px] border bg-[#f7f7f8] px-3 text-[16px] outline-none ${pinCodeError ? 'border-[#ef4444]' : 'border-[#e7e8ea]'}`}
            />
            {pinCodeError && <p className="text-xs text-[#d92d20]">{pinCodeError}</p>}
          </div>
        </div>

        {/* Continue Button - Centered at bottom */}
        <div className="flex flex-col items-center justify-end w-full mt-auto">
          <button
            onClick={handleSubmit}
            disabled={isLoading || externalLoading}
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

  const fieldClass = "h-10 w-full rounded-md border border-[#e0e5eb] bg-white px-3 text-[13px] leading-5 text-[#0c121a] outline-none transition focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10 placeholder:text-[#9aa3af]"
  const readOnlyFieldClass = "flex h-10 w-full items-center gap-2 rounded-md border border-[#e0e5eb] bg-white px-3 text-[13px] leading-5 text-[#0c121a]"
  const labelClass = "mb-1.5 flex h-[18px] items-center justify-between text-[12px] leading-[18px] text-[#0c121a]"
  const helperClass = "text-[11px] leading-[17px] text-[#6a727d]"
  const errorTextClass = "mt-1.5 inline-flex items-center gap-1 text-[11px] leading-[17px] text-[#d92d20]"
  const inputClass = (hasError: boolean) => `${fieldClass} ${hasError ? 'border-[#ef4444] pr-9 shadow-[0_0_0_3px_rgba(239,68,68,0.10)] focus:border-[#ef4444] focus:ring-[#ef4444]/10' : ''}`
  const fieldShellClass = (hasError: boolean) => `flex h-10 items-center rounded-md border ${hasError ? 'border-[#ef4444] shadow-[0_0_0_3px_rgba(239,68,68,0.10)]' : 'border-[#e0e5eb]'} bg-white px-3`

  return (
    <div className="h-full w-full overflow-hidden rounded-[20px] border border-[#e0e5eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
      <div className="grid h-full grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex h-full flex-col gap-6 border-r border-[#e0e5eb] bg-[#f8fafd] px-5 py-5">
          <div className="flex h-10 items-center justify-between">
            <img src={idtoLogo} alt="idto" className="h-10 w-[70px]" />
            <div className="inline-flex h-[21px] items-center gap-1.5 rounded-full bg-[#e5f2ff] px-2.5 text-[11px] leading-[17px] text-[#1034b1]">
              <span className="size-1.5 rounded-full bg-[#3061ef]" />
              GO LIVE
            </div>
          </div>

          <div className="w-full">
            <div className="mb-1.5 flex items-center justify-between text-[11px] leading-[17px] text-[#6a727d]">
              <span>Production setup</span>
              <span>5%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#f0f4f9]">
              <div className="h-full w-[5%] rounded-full bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)]" />
            </div>
          </div>

          <ol className="flex flex-col gap-1">
            {[
              ['1', 'Company basics', true],
              ['2', 'PAN & GST', false],
              ['3', 'Authorized signatory', false],
              ['4', 'Bank & review', false],
            ].map(([number, title, active]) => (
              <li key={String(number)} className={`flex h-[51px] items-center gap-3 rounded-xl px-2.5 py-2 ${active ? 'bg-[#e1f0ff]' : ''}`}>
                <span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold leading-[15px] ${active ? 'bg-[#0c121a] text-white' : 'border border-[#e0e5eb] bg-white text-[#6a727d]'}`}>
                  {number}
                </span>
                <span className="min-w-0">
                  <span className={`block text-[12.5px] leading-[19px] ${active ? 'font-bold text-[#0c121a]' : 'text-[#6a727d]'}`}>{title}</span>
                  <span className="block text-[10.5px] leading-4 text-[#6a727d]">~ under 5 min</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl border border-[#e0e5eb] bg-white px-3 py-5">
            <div className="flex items-center gap-1.5 text-[11px] leading-[17px] text-[#0c121a]">
              <ShieldCheck className="size-3 text-[#3061ef]" />
              Bank-grade encryption
            </div>
            <p className="mt-2 text-[10.5px] leading-4 text-[#6a727d]">
              Your documents are encrypted at rest and only seen by our onboarding team.
            </p>
          </div>
        </aside>

        <main className="flex min-h-0 flex-col bg-white">
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#e0e5eb] px-6">
            <button type="button" className="inline-flex items-center gap-2 text-[12px] leading-[18px] text-[#6a727d]">
              <ArrowLeft className="size-3.5" />
              Save & exit
            </button>
            <div className="flex items-center gap-3 text-[11px] leading-[17px] text-[#6a727d]">
              <span className="inline-flex items-center gap-1">
                <Save className="size-3" />
                auto-saved 4s ago
              </span>
              <span aria-hidden="true">.</span>
              <button type="button" className="inline-flex items-center gap-1">
                <HelpCircle className="size-3" />
                Help
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden px-10 pb-8 pt-[31px]">
            <div className="max-w-[854px]">
              <div className="mb-7">
                <p className="text-[11px] leading-[17px] text-[#6a727d]">Step 1 of 4</p>
                <h2 className="mt-1.5 text-[26px] font-bold leading-[39px] tracking-[-0.35px] text-[#0c121a]">
                  Tell us about your company
                </h2>
                <p className="mt-1.5 text-[14px] leading-[21px] text-[#6a727d]">
                  We've pre-filled what we captured at signup. Edit anything that's off.
                </p>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] leading-[18px] text-[#6a727d]">
                  <Timer className="size-3" />
                  Takes about 2 minutes
                </div>
              </div>

              {error && (
                <div className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Error</p>
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div className="relative">
                  <label className={labelClass}>
                    <span>Brand name</span>
                    <span className={helperClass}>From signup, if provided</span>
                  </label>
                  <input
                    type="text"
                    value={formData.brand_name}
                    onChange={(e) => handleInputChange('brand_name', e.target.value)}
                    placeholder="Enter your brand name"
                    className={inputClass(Boolean(brandNameError))}
                  />
                  {brandNameError && <AlertCircle className="pointer-events-none absolute right-3 top-[33px] size-3.5 text-[#ef4444]" />}
                  {brandNameError && (
                    <p className={errorTextClass}>
                      <AlertCircle className="size-3" />
                      {brandNameError}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    <span>Legal business name</span>
                    <span className={helperClass}>As per incorporation docs</span>
                  </label>
                  <input
                    type="text"
                    value={formData.registered_name}
                    onChange={(e) => handleInputChange('registered_name', e.target.value)}
                    placeholder="Enter legal business name"
                    className={inputClass(Boolean(registeredNameError))}
                  />
                  {registeredNameError && <p className={errorTextClass}>{registeredNameError}</p>}
                </div>

                <div>
                  <label className={labelClass}>Entity type</label>
                  <Select value={formData.entity_type} onValueChange={(value) => handleInputChange('entity_type', value)}>
                    <SelectTrigger className={`h-10 w-full rounded-md bg-white text-[13px] text-[#0c121a] ${entityTypeError ? 'border-[#ef4444] shadow-[0_0_0_3px_rgba(239,68,68,0.10)] focus:ring-[#ef4444]/10' : 'border-[#e0e5eb]'}`}>
                      <SelectValue placeholder="Select entity type" />
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
                  {entityTypeError && (
                    <p className={errorTextClass}>
                      <AlertCircle className="size-3" />
                      {entityTypeError}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>Industry</label>
                  <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                    <SelectTrigger className={`h-10 w-full rounded-md bg-white text-[13px] text-[#0c121a] ${industryError ? 'border-[#ef4444] shadow-[0_0_0_3px_rgba(239,68,68,0.10)]' : 'border-[#e0e5eb]'}`}>
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industryOptions.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {industryError && <p className={errorTextClass}>{industryError}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <span>Website URL <span className={helperClass}>(optional)</span></span>
                  </label>
                  <div className={fieldShellClass(Boolean(websiteError))}>
                    <Globe2 className="mr-2 size-3.5 shrink-0 text-[#6a727d]" />
                    <input
                      type="text"
                      value={formData.website_url}
                      onChange={(e) => handleInputChange('website_url', e.target.value)}
                      onBlur={handleWebsiteBlur}
                      placeholder="Enter website URL"
                      className="min-w-0 flex-1 bg-transparent text-[13px] leading-5 text-[#0c121a] outline-none placeholder:text-[#9aa3af]"
                    />
                    {websiteError && <AlertCircle className="ml-2 size-3.5 shrink-0 text-[#ef4444]" />}
                  </div>
                  {websiteError && (
                    <p className={errorTextClass}>
                      <AlertCircle className="size-3" />
                      {websiteError}
                    </p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>PIN code</label>
                  <div className={fieldShellClass(Boolean(pinCodeError))}>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formData.pin_code}
                      onChange={(e) => handleInputChange('pin_code', e.target.value.replace(/\D/g, '').slice(0, 6))}
                      placeholder="Enter 6-digit PIN"
                      className="min-w-0 flex-1 bg-transparent text-[13px] leading-5 text-[#0c121a] outline-none placeholder:text-[#9aa3af]"
                    />
                    {pinCodeError ? (
                      <AlertCircle className="ml-2 size-3.5 shrink-0 text-[#ef4444]" />
                    ) : (
                      formData.pin_code.length === 6 && <CheckCircle2 className="ml-2 size-3.5 shrink-0 text-[#00a575]" />
                    )}
                  </div>
                  {pinCodeError && (
                    <p className={errorTextClass}>
                      <AlertCircle className="size-3" />
                      {pinCodeError}
                    </p>
                  )}
                </div>

                <div className="col-span-2">
                  <label className={labelClass}>Registered office address</label>
                  <div className={fieldShellClass(Boolean(businessAddressError))}>
                    <MapPin className="mr-2 size-3.5 text-[#6a727d]" />
                    <input
                      type="text"
                      value={formData.business_address}
                      onChange={(e) => handleInputChange('business_address', e.target.value)}
                      placeholder="Enter registered office address"
                      className="min-w-0 flex-1 bg-transparent text-[13px] outline-none placeholder:text-[#9aa3af]"
                    />
                  </div>
                  {businessAddressError && <p className={errorTextClass}>{businessAddressError}</p>}
                </div>

                <div>
                  <label className={labelClass}>
                    <span>Primary contact email</span>
                    <span className={helperClass}>from signup</span>
                  </label>
                  <div className={readOnlyFieldClass}>
                    <Mail className="size-3.5 text-[#6a727d]" />
                    {userProfile?.email || 'Not provided'}
                  </div>
                </div>

                <div>
                  <label className={labelClass}>
                    <span>Mobile</span>
                    <span className={helperClass}>Used for refunds & reconciliation</span>
                  </label>
                  <div className={readOnlyFieldClass}>
                    <Phone className="size-3.5 text-[#6a727d]" />
                    {userProfile?.mobile || 'Not provided'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <footer className="mx-10 flex h-[65px] shrink-0 items-center justify-end border-t border-[#e0e5eb]">
            <button
              onClick={handleSubmit}
              disabled={isLoading || externalLoading}
              className="flex h-10 w-[110px] items-center justify-center gap-2 rounded-lg bg-[#0019ff] text-[13px] font-bold leading-5 text-white shadow-[0_8px_18px_rgba(0,25,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {(isLoading || externalLoading) ? (
                <div className="size-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <>
                  Continue
                  <ArrowRight className="size-3.5" />
                </>
              )}
            </button>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default BasicDetailsForm
