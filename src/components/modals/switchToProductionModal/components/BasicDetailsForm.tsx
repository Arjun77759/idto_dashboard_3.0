import { useState } from "react"
import { ChevronDown, ArrowRight, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface BasicDetailsFormProps {
  onNext: () => void
  onPrevious?: () => void
  showPrevious?: boolean
  isLoading?: boolean
}

const BasicDetailsForm = ({ onNext, onPrevious, showPrevious = false, isLoading = false }: BasicDetailsFormProps) => {
  const [formData, setFormData] = useState({
    brand_name: '',
    website_url: '',
    entity_type: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.entity_type) {
      alert('Please select an Entity Type before continuing')
      return
    }

    // TODO: Wire up with POST /onboard/ API endpoint
    // const payload = {
    //   brand_name: formData.brand_name,
    //   website_url: formData.website_url,
    //   entity_type: formData.entity_type
    // }
    console.log('Form data:', formData)
    onNext()
  }

  const isFormValid = formData.entity_type !== ''
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
            <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full">
              <input
                type="url"
                value={formData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
                placeholder="Company website or landing page (if any)"
                className="font-medium grow leading-6 relative shrink-0 text-base text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full placeholder:text-[#9296a0]"
              />
            </div>
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
          
          {/* Spacer */}
          <div className="flex-1"></div>
          
          {/* Continue Button */}
          <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
            <button
              onClick={handleSubmit}
              disabled={isLoading || !isFormValid}
              className="flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-[inherit] disabled:opacity-50 disabled:cursor-not-allowed">
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
