// Image assets from Figma
const imgArrow = "http://localhost:3845/assets/e0bf1f6ea3a5839cca531ea155e3190f150682fe.svg"
const imgDropdown = "http://localhost:3845/assets/30137de378bdc963371e80b29a30f19141a6ce5a.svg"

interface BasicDetailsFormProps {
  onNext: () => void
  isLoading?: boolean
}

const BasicDetailsForm = ({ onNext, isLoading = false }: BasicDetailsFormProps) => {
  return (
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full min-h-px min-w-px relative rounded shrink-0">
      <div className="flex flex-col gap-4 items-start p-6 relative rounded-[inherit] size-full">
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

        {/* Form Fields */}
        <div className="grow flex flex-col gap-4 items-start min-h-px min-w-px relative shrink-0 w-full">
          {/* Brand Name Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <div className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                Brand Name of the Business
              </p>
            </div>
            <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full">
              <div className="grow flex gap-2 items-center justify-center min-h-px min-w-px relative shrink-0">
                <p className="font-medium grow leading-6 relative shrink-0 text-base text-[#9296a0] tracking-[-0.16px]">
                  e.g., Zomato, Razorpay
                </p>
              </div>
            </div>
          </div>

          {/* Website URL Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <div className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                Website URL
              </p>
            </div>
            <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full">
              <div className="grow flex gap-2 items-center justify-center min-h-px min-w-px relative shrink-0">
                <p className="font-medium grow leading-6 relative shrink-0 text-base text-[#9296a0] tracking-[-0.16px]">
                  Company website or landing page (if any)
                </p>
              </div>
            </div>
          </div>

          {/* Entity Type Field */}
          <div className="flex gap-5 items-start relative shrink-0 w-full">
            <div className="grow flex flex-col gap-1 items-start min-h-px min-w-px relative shrink-0">
              <div className="flex gap-2.5 items-center relative shrink-0 w-full">
                <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  <span>Entity Type </span>
                  <span className="text-[#b43e28]">*</span>
                </p>
              </div>
              <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full">
                <div className="grow flex gap-2 items-center justify-center min-h-px min-w-px relative shrink-0">
                  <p className="font-medium grow leading-6 relative shrink-0 text-base text-[#9296a0] tracking-[-0.16px]">
                    Select Entity Type
                  </p>
                </div>
                <div className="overflow-clip relative shrink-0 size-6">
                  <div className="absolute bottom-[37.5%] left-1/4 right-1/4 top-[37.5%]">
                    <div className="absolute inset-[-8.84%_-4.42%_-17.67%_-4.42%]">
                      <img alt="" className="block max-w-none size-full" src={imgDropdown} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="flex gap-10 items-center justify-end relative shrink-0 w-full">
          <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
            <button
              onClick={onNext}
              disabled={isLoading}
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
                  <div className="overflow-clip relative shrink-0 size-4">
                    <div className="absolute inset-[29.17%_16.67%]">
                      <img alt="" className="block max-w-none size-full" src={imgArrow} />
                    </div>
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
