import { useState } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { z } from "zod"

interface BusinessInfoFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
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

const BusinessInfoForm = ({ onNext, onPrevious, showPrevious = false, isLoading = false }: BusinessInfoFormProps) => {
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

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    setErrors(prev => ({ ...prev, [field]: '' }))
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

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    // TODO: Wire up with POST /onboard/business-info API endpoint
    // const payload = {
    //   registered_name: formData.registered_name,
    //   authorized_email: formData.authorized_email,
    //   authorized_mobile: formData.authorized_mobile,
    //   office_address: formData.office_address,
    //   pin_code: formData.pin_code
    // }
    console.log('Form data:', formData)
    onNext()
  }

  const isFormValid = formData.registered_name && formData.authorized_email && formData.authorized_mobile && formData.office_address && formData.pin_code

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
        <div className="flex gap-3 items-center justify-between relative shrink-0 w-full">
          {/* Previous Button */}
          {showPrevious && onPrevious && (
            <button
              onClick={onPrevious}
              className="flex gap-2 items-center px-6 py-3 text-[#616675] hover:bg-gray-100 rounded-lg transition-colors border border-[#e7e8ea]"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-medium text-xs tracking-[-0.12px]">Previous</span>
            </button>
          )}
          <div className="flex-1"></div>
          <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid}
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

export default BusinessInfoForm
