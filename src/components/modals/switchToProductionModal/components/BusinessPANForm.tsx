import { useState } from "react"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { z } from "zod"

interface BusinessPANFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
}

// Zod validation schema for PAN
const panSchema = z.object({
  pan_number: z.string()
    .min(1, 'PAN number is required')
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Please enter a valid PAN number (e.g., ABCDE1234F)')
    .length(10, 'PAN number must be exactly 10 characters')
})

const BusinessPANForm = ({ onNext, onPrevious, showPrevious = false, isLoading = false }: BusinessPANFormProps) => {
  const [formData, setFormData] = useState({
    pan_number: ''
  })

  const [errors, setErrors] = useState({
    pan_number: ''
  })

  const handleInputChange = (value: string) => {
    // Convert to uppercase automatically
    const upperValue = value.toUpperCase()
    setFormData({ pan_number: upperValue })
    // Clear error when user starts typing
    setErrors({ pan_number: '' })
  }

  const validateField = () => {
    const result = panSchema.safeParse(formData)
    
    if (!result.success) {
      const fieldError = result.error.issues.find(issue => issue.path[0] === 'pan_number')
      if (fieldError) {
        setErrors({ pan_number: fieldError.message })
      }
    } else {
      setErrors({ pan_number: '' })
    }
  }

  const validateForm = (): boolean => {
    try {
      panSchema.parse(formData)
      setErrors({ pan_number: '' })
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = error.issues[0]?.message || ''
        setErrors({ pan_number: errorMessage })
      }
      return false
    }
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    // TODO: Wire up with POST /customers/verify-and-update-pan API endpoint
    // const payload = {
    //   pan_number: formData.pan_number
    // }
    console.log('PAN data:', formData)
    onNext()
  }

  const isFormValid = formData.pan_number.length === 10

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full min-h-px min-w-px relative rounded shrink-0">
      <div className="flex flex-col gap-4 items-start p-6 relative rounded-[inherit] size-full">
        {/* Header */}
        <div className="flex flex-col items-start relative shrink-0 w-full">
          <p className="font-bold leading-7 relative shrink-0 text-lg text-[#616675] tracking-[-0.18px] w-full">
            Enter PAN Number
          </p>
          <div className="flex gap-2 items-center px-0 py-2 relative shrink-0 w-full">
            <p className="font-normal leading-[1.4] grow min-h-px min-w-px relative shrink-0 text-xs text-[#9296a0] tracking-[-0.12px]">
              Please enter your PAN Number
            </p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grow flex flex-col gap-4 items-start min-h-px min-w-px relative shrink-0 w-full">
          {/* PAN Number Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <label className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                <span>Enter your 10-digit PAN Number </span>
                <span className="text-[#b43e28]">*</span>
              </p>
            </label>
            <div className={`bg-[#f7f7f8] border ${errors.pan_number ? 'border-red-500' : 'border-[#e7e8ea]'} border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full`}>
              <input
                type="text"
                value={formData.pan_number}
                onChange={(e) => handleInputChange(e.target.value)}
                onBlur={validateField}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0] uppercase"
              />
            </div>
            {errors.pan_number && (
              <p className="text-xs text-red-600 mt-1">{errors.pan_number}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 items-center justify-between relative shrink-0 w-full">
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

export default BusinessPANForm
