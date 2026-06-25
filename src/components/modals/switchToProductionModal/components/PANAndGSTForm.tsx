import { useState, useEffect, useRef } from "react"
import { ArrowLeft, ArrowRight, AlertCircle, AlertTriangle, Check, CheckCircle2, FileText, FileUp, HelpCircle, Save, ShieldCheck, Timer, X } from "lucide-react"
import { z } from "zod"
import type { OnboardingStatus } from "@/hooks/useOnboardingStatus"
import type { OnboardingStepsStatus } from "@/hooks/useOnboardingSteps"
import { updatePAN, updateGST, updateProductionProgress } from "@/api/onboardingApi"
import { invalidateOnboardingSteps } from "@/store/onboardingStepsStore"
import { fetchOnboardingStatus } from "@/store/onboardingStore"
import { fetchUserProfile, invalidateUserProfile, useUserProfileStore } from "@/store/userProfileStore"
import { useIsMobile } from "@/hooks/use-mobile"
import idtoLogo from "@/assets/idto-logo.svg"
import { normalizeEntityType } from "@/lib/entityType"

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
  const isProprietorship = normalizeEntityType(userProfile?.entity_type) === 'proprietorship'
  
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
  const [noGstin, setNoGstin] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [isVerified, setIsVerified] = useState(false)
  const [hasNameMismatch, setHasNameMismatch] = useState(false)
  const [nameMismatchSource, setNameMismatchSource] = useState<'pan' | 'gst' | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Pre-fill form data from user profile if available
  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        pan_number: userProfile.pan_number || prev.pan_number,
        gst_number: userProfile.gst_number || prev.gst_number
      }))
    }
  }, [userProfile])

  useEffect(() => {
    const panVerified = Boolean(_initialData?.production_steps?.pan)
    const gstReady = Boolean(_initialData?.production_steps?.gst || isProprietorship)
    setIsVerified(panVerified && gstReady)
  }, [_initialData?.production_steps?.pan, _initialData?.production_steps?.gst, isProprietorship])

  const handlePANChange = (value: string) => {
    const upperValue = value.toUpperCase()
    setFormData(prev => ({ ...prev, pan_number: upperValue }))
    setErrors(prev => ({ ...prev, pan_number: '' }))
    setApiError('')
    setIsVerified(false)
    setHasNameMismatch(false)
    setNameMismatchSource(null)
  }

  const handleGSTChange = (value: string) => {
    const upperValue = value.toUpperCase().replace(/\s/g, '')
    setFormData(prev => ({ ...prev, gst_number: upperValue }))
    setErrors(prev => ({ ...prev, gst_number: '' }))
    if (upperValue) {
      setNoGstin(false)
    }
    setApiError('')
    setIsVerified(false)
    setHasNameMismatch(false)
    setNameMismatchSource(null)
  }

  const handleFileSelect = (file: File | undefined) => {
    if (!file) {
      return
    }

    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg']
    if (!allowedTypes.includes(file.type)) {
      setFileError('Upload a PDF, PNG or JPG file')
      setSelectedFile(null)
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setFileError('File must be 10 MB or less')
      setSelectedFile(null)
      return
    }

    setFileError('')
    setSelectedFile(file)
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
    if (noGstin || (isProprietorship && !hasGSTInput)) {
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
    if (isVerified) {
      onNext()
      return
    }

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setApiError('')

    try {
      // Submit PAN only if not already completed
      if (!_initialData?.production_steps?.pan) {
        const panPayload = { pan_number: formData.pan_number }
        const panResponse = await updatePAN(panPayload)

        if (!panResponse.success) {
          if (panResponse.verification_result?.matched === false) {
            setApiError("PAN holder name doesn't match the registered business name. Check the PAN or update the legal business name.")
          } else {
            setApiError(panResponse.message || 'PAN verification failed')
          }
          setIsLoading(false)
          return
        }

        if (!panResponse.verification_result?.matched) {
          setApiError("PAN holder name doesn't match the registered business name. Check the PAN or update the legal business name.")
          setIsLoading(false)
          return
        }
      }

      const storedGST = (userProfile?.gst_number || '').trim().toUpperCase()
      const shouldVerifyGST = !noGstin && hasGSTInput && (!_initialData?.production_steps?.gst || storedGST !== formData.gst_number)

      // If a GSTIN is provided, verify it even when proprietorship has marked GST as not applicable.
      if (shouldVerifyGST) {
        const gstPayload = { gst_number: formData.gst_number }
        const gstResponse = await updateGST(gstPayload)

        if (!gstResponse.success) {
          if (gstResponse.verification_result?.matched === false) {
            setApiError("GSTIN legal name doesn't match the registered business name. Check the GSTIN or update the legal business name.")
          } else {
            setApiError(gstResponse.message || 'GST verification failed')
          }
          setIsLoading(false)
          return
        }

        if (!gstResponse.verification_result?.matched) {
          setApiError("GSTIN legal name doesn't match the registered business name. Check the GSTIN or update the legal business name.")
          setIsLoading(false)
          return
        }
      }

      await updateProductionProgress('director-kyc')
      await fetchOnboardingStatus(true).catch(() => null)
      invalidateOnboardingSteps() // Invalidate cache so it refetches
      invalidateUserProfile()
      await fetchUserProfile().catch(() => null)
      setIsVerified(true)
      onNext()
    } catch (err: any) {
      const errorMessage = err?.response?.data?.message || err?.response?.data?.detail || err?.message || 'Failed to verify. Please check the details and try again.'
      setApiError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  // Proprietorship can proceed without GSTIN. If GSTIN is entered, it must be complete and verified.
  const isFormValid = formData.pan_number.length === 10 && (noGstin || (isProprietorship ? (!hasGSTInput || formData.gst_number.length === 15) : formData.gst_number.length === 15))

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

  const fieldClass = "h-10 w-full rounded-md border border-[#e0e5eb] bg-white px-3 text-[13px] leading-5 text-[#0c121a] outline-none transition focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10 placeholder:text-[#9aa3af]"
  const labelClass = "mb-1.5 flex h-[18px] items-center justify-between text-[12px] leading-[18px] text-[#0c121a]"
  const helperClass = "text-[11px] leading-[17px] text-[#6a727d]"
  const errorTextClass = "mt-1.5 inline-flex items-center gap-1 text-[11px] leading-[17px] text-[#d92d20]"
  const inputClass = (hasError: boolean) => `${fieldClass} ${hasError ? 'border-[#ef4444] pr-9 shadow-[0_0_0_3px_rgba(239,68,68,0.10)] focus:border-[#ef4444] focus:ring-[#ef4444]/10' : ''}`
  const verifiedNoteClass = "mt-2 flex h-[34px] items-center gap-2 rounded-lg bg-[#e9f8ef] px-3 text-[12px] leading-[18px] text-[#00875a]"
  const progressItems = [
    ['1', 'Company basics', true, false],
    ['2', 'PAN & GST', false, true],
    ['3', 'Authorized signatory', false, false],
    ['4', 'Bank & review', false, false],
  ] as const

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
              <span>28%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#f0f4f9]">
              <div className="h-full w-[28%] rounded-full bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)]" />
            </div>
          </div>

          <ol className="flex flex-col gap-1">
            {progressItems.map(([number, title, completed, active]) => (
              <li key={number} className={`flex h-[51px] items-center gap-3 rounded-xl px-2.5 py-2 ${active ? 'bg-[#e1f0ff]' : ''}`}>
                <span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold leading-[15px] ${active ? 'bg-[#0c121a] text-white' : completed ? 'bg-[#00a575] text-white' : 'border border-[#e0e5eb] bg-white text-[#6a727d]'}`}>
                  {completed ? <Check className="size-3.5" /> : number}
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
            <button type="button" onClick={_onPrevious} className="inline-flex items-center gap-2 text-[12px] leading-[18px] text-[#6a727d]">
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

          <div className="flex-1 overflow-hidden px-10 pb-7 pt-[31px]">
            <div className="max-w-[854px]">
              <div className="mb-7">
                <p className="text-[11px] leading-[17px] text-[#6a727d]">Step 2 of 4</p>
                <h2 className="mt-1.5 text-[26px] font-bold leading-[39px] tracking-[-0.35px] text-[#0c121a]">
                  Verify your entity
                </h2>
                <div className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] leading-[18px] text-[#6a727d]">
                  <Timer className="size-3" />
                  Auto-verified in seconds
                </div>
              </div>

              {apiError && (
                <div className="mb-5 flex gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
                  <AlertCircle className="mt-0.5 size-5 shrink-0 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Verification Failed</p>
                    <p className="text-sm text-red-700">{apiError}</p>
                  </div>
                </div>
              )}

              {hasNameMismatch ? (
                <div className="rounded-2xl border border-[#f4d49b] bg-[#fff8eb] p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[#b7791f]" />
                    <div className="min-w-0 flex-1">
                      <h3 className="text-[14px] font-bold leading-5 text-[#0c121a]">
                        {nameMismatchSource === 'gst'
                          ? "GSTIN legal name doesn't match your registered business name"
                          : "PAN holder name doesn't match your registered business name"}
                      </h3>
                      <p className="mt-1 text-[12px] leading-[18px] text-[#6a727d]">
                        {nameMismatchSource === 'gst'
                          ? 'The legal name returned by GST verification does not match the legal business name provided in company basics.'
                          : 'The holder name returned by PAN verification does not match the legal business name provided in company basics.'}
                      </p>
                      <p className="mt-1 text-[12px] leading-[18px] text-[#6a727d]">
                        You can still proceed by uploading both documents - your application will move to pending review with our onboarding team.
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                          className="hidden"
                          onChange={(e) => handleFileSelect(e.target.files?.[0])}
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex h-8 items-center justify-center gap-2 rounded-lg bg-[#0019ff] px-3 text-[12px] font-bold leading-[18px] text-white hover:opacity-90"
                        >
                          <FileUp className="size-3" />
                          Upload PAN & GST certificate
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setHasNameMismatch(false)
                            setNameMismatchSource(null)
                            setIsVerified(false)
                          }}
                          className="inline-flex h-8 items-center justify-center rounded-lg border border-[#e0e5eb] bg-white px-3 text-[12px] font-medium leading-[18px] text-[#0c121a] hover:bg-[#f8fafd]"
                        >
                          Edit PAN
                        </button>
                      </div>
                      {selectedFile && (
                        <div className="mt-3 flex h-9 max-w-[420px] items-center justify-between rounded-lg border border-[#e0e5eb] bg-white px-3 text-[12px] leading-[18px] text-[#0c121a]">
                          <span className="flex min-w-0 items-center gap-2">
                            <FileText className="size-3.5 shrink-0 text-[#3061ef]" />
                            <span className="truncate">{selectedFile.name}</span>
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedFile(null)
                              setFileError('')
                              if (fileInputRef.current) {
                                fileInputRef.current.value = ''
                              }
                            }}
                            className="ml-3 rounded p-1 text-[#6a727d] hover:bg-[#eef2f7]"
                            aria-label="Remove selected file"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>
                      )}
                      {fileError && (
                        <p className={errorTextClass}>
                          <AlertCircle className="size-3" />
                          {fileError}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ) : isVerified ? (
                <div className="grid grid-cols-2 gap-x-6">
                  <div>
                    <label className={labelClass}>
                      <span>Business PAN</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pan_number || userProfile?.pan_number || ''}
                        readOnly
                        className={`${fieldClass} pr-9 uppercase shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
                      />
                      <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#00a575]" />
                    </div>
                    <div className={verifiedNoteClass}>
                      <CheckCircle2 className="size-3 shrink-0" />
                      Verified{userProfile?.registered_name ? ` · ${userProfile.registered_name}` : ''}
                    </div>
                  </div>

                  <div>
                    <label className={labelClass}>
                      <span>GSTIN</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={noGstin ? 'Not applicable' : (formData.gst_number || userProfile?.gst_number || '')}
                        readOnly
                        className={`${fieldClass} pr-9 uppercase shadow-[0_1px_2px_rgba(0,0,0,0.04)]`}
                      />
                      <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#00a575]" />
                    </div>
                    <div className={verifiedNoteClass}>
                      <CheckCircle2 className="size-3 shrink-0" />
                      {noGstin ? 'Verified · Exemption proof received' : 'Verified'}
                    </div>
                  </div>
                </div>
              ) : noGstin ? (
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <label className={labelClass}>
                      <span>Business PAN</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pan_number}
                        onChange={(e) => handlePANChange(e.target.value)}
                        onBlur={validatePAN}
                        placeholder="Enter 10-character PAN"
                        maxLength={10}
                        className={`${inputClass(Boolean(errors.pan_number))} uppercase`}
                      />
                      {!errors.pan_number && formData.pan_number.length === 10 && <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#00a575]" />}
                      {errors.pan_number && <AlertCircle className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#ef4444]" />}
                    </div>
                    {errors.pan_number && (
                      <p className={errorTextClass}>
                        <AlertCircle className="size-3" />
                        {errors.pan_number}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2 flex min-h-[62px] items-start gap-2.5 rounded-xl border border-[#b8e6c8] bg-[#effaf3] px-3 py-3">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded border border-[#00a575] bg-[#00a575] text-white">
                      <Check className="size-2.5" />
                    </span>
                    <span>
                      <span className="block text-[12.5px] font-medium leading-[19px] text-[#0c121a]">
                        Confirmed as unregistered entity
                      </span>
                      <span className="block text-[12px] leading-[18px] text-[#6a727d]">
                        You can optionally upload an LUT or exemption certificate to speed up review.
                      </span>
                    </span>
                  </div>

                  <div className="col-span-2">
                    <label className={labelClass}>
                      <span>LUT / GST exemption proof <span className={helperClass}>(optional)</span></span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        handleFileSelect(e.dataTransfer.files?.[0])
                      }}
                      className="flex h-20 w-full items-center justify-center rounded-xl border border-dashed border-[#cfd6df] bg-white text-[12.5px] leading-[19px] text-[#3061ef] transition hover:border-[#3061ef] hover:bg-[#f8fafd]"
                    >
                      <span className="flex flex-col items-center gap-1">
                        <FileUp className="size-4" />
                        Drop file or browse
                      </span>
                    </button>
                    {selectedFile && (
                      <div className="mt-2 flex h-9 items-center justify-between rounded-lg border border-[#e0e5eb] bg-[#f8fafd] px-3 text-[12px] leading-[18px] text-[#0c121a]">
                        <span className="flex min-w-0 items-center gap-2">
                          <FileText className="size-3.5 shrink-0 text-[#3061ef]" />
                          <span className="truncate">{selectedFile.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null)
                            setFileError('')
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                          className="ml-3 rounded p-1 text-[#6a727d] hover:bg-[#eef2f7]"
                          aria-label="Remove selected file"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    )}
                    {fileError && (
                      <p className={errorTextClass}>
                        <AlertCircle className="size-3" />
                        {fileError}
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-x-6 gap-y-6">
                  <div>
                    <label className={labelClass}>
                      <span>Business PAN</span>
                      <span className={helperClass}>10-character PAN</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.pan_number}
                        onChange={(e) => handlePANChange(e.target.value)}
                        onBlur={validatePAN}
                        placeholder="AAAAA0000A"
                        maxLength={10}
                        className={`${inputClass(Boolean(errors.pan_number))} uppercase`}
                      />
                      {!errors.pan_number && formData.pan_number.length === 10 && <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#00a575]" />}
                      {errors.pan_number && <AlertCircle className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#ef4444]" />}
                    </div>
                    {errors.pan_number && (
                      <p className={errorTextClass}>
                        <AlertCircle className="size-3" />
                        {errors.pan_number}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className={labelClass}>
                      <span>GSTIN</span>
                      <span className={helperClass}>15-character GSTIN</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={formData.gst_number}
                        onChange={(e) => handleGSTChange(e.target.value)}
                        onBlur={validateGST}
                        placeholder="29AAAAA0000A1Z5"
                        maxLength={15}
                        disabled={noGstin}
                        className={`${inputClass(Boolean(errors.gst_number))} uppercase disabled:bg-[#f8fafd] disabled:text-[#9aa3af]`}
                      />
                      {!errors.gst_number && formData.gst_number.length === 15 && <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#00a575]" />}
                      {errors.gst_number && <AlertCircle className="pointer-events-none absolute right-3 top-1/2 size-3.5 -translate-y-1/2 text-[#ef4444]" />}
                    </div>
                    {errors.gst_number && (
                      <p className={errorTextClass}>
                        <AlertCircle className="size-3" />
                        {errors.gst_number}
                      </p>
                    )}
                  </div>

                  <label className="col-span-2 flex min-h-[63px] cursor-pointer items-start gap-2.5 rounded-xl border border-[#e0e5eb] bg-[#f8fafd] px-3 py-3">
                    <input
                      type="checkbox"
                      checked={noGstin}
                      onChange={(e) => {
                        setNoGstin(e.target.checked)
                        if (e.target.checked) {
                          setFormData(prev => ({ ...prev, gst_number: '' }))
                          setErrors(prev => ({ ...prev, gst_number: '' }))
                        }
                      }}
                      className="mt-0.5 size-4 rounded border-[#cfd6df] accent-[#0019ff]"
                    />
                    <span>
                      <span className="block text-[12.5px] leading-[19px] text-[#0c121a]">
                        I don't have a GSTIN - this is an unregistered entity
                      </span>
                      <span className="block text-[12px] leading-[18px] text-[#6a727d]">
                        You'll need to upload a GST exemption proof or LUT declaration instead.
                      </span>
                    </span>
                  </label>

                  <div className="col-span-2">
                    <label className={labelClass}>
                      <span>{noGstin ? 'GST exemption proof' : 'GST registration certificate'}</span>
                      <span className={helperClass}>PDF, PNG or JPG . max 10 MB</span>
                    </label>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
                      className="hidden"
                      onChange={(e) => handleFileSelect(e.target.files?.[0])}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => {
                        e.preventDefault()
                        handleFileSelect(e.dataTransfer.files?.[0])
                      }}
                      className="flex h-24 w-full items-center justify-center rounded-xl border border-dashed border-[#cfd6df] bg-white text-[12.5px] leading-[19px] text-[#3061ef] transition hover:border-[#3061ef] hover:bg-[#f8fafd]"
                    >
                      <span className="flex flex-col items-center gap-1.5">
                        <FileUp className="size-4" />
                        Drop file or browse
                      </span>
                    </button>
                    {selectedFile && (
                      <div className="mt-2 flex h-9 items-center justify-between rounded-lg border border-[#e0e5eb] bg-[#f8fafd] px-3 text-[12px] leading-[18px] text-[#0c121a]">
                        <span className="flex min-w-0 items-center gap-2">
                          <FileText className="size-3.5 shrink-0 text-[#3061ef]" />
                          <span className="truncate">{selectedFile.name}</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFile(null)
                            setFileError('')
                            if (fileInputRef.current) {
                              fileInputRef.current.value = ''
                            }
                          }}
                          className="ml-3 rounded p-1 text-[#6a727d] hover:bg-[#eef2f7]"
                          aria-label="Remove selected file"
                        >
                          <X className="size-3.5" />
                        </button>
                      </div>
                    )}
                    {fileError && (
                      <p className={errorTextClass}>
                        <AlertCircle className="size-3" />
                        {fileError}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <footer className="mx-10 flex h-[65px] shrink-0 items-center justify-between border-t border-[#e0e5eb]">
            <button
              onClick={_onPrevious}
              disabled={isLoading || externalLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e0e5eb] bg-white px-4 text-[13px] font-medium leading-5 text-[#6a727d] hover:bg-[#f8fafd] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="size-3.5" />
              Back
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || externalLoading || (!isVerified && !isFormValid)}
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

export default PANAndGSTForm
