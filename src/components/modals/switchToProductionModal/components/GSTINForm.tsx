import { ArrowRight } from 'lucide-react'

interface GSTINFormProps {
  onNext: () => void
  isLoading?: boolean
}

const GSTINForm = ({ onNext, isLoading = false }: GSTINFormProps) => {
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

        {/* Form Fields */}
        <div className="grow flex flex-col gap-4 items-start min-h-px min-w-px relative shrink-0 w-full">
          {/* GSTIN Field */}
          <div className="flex flex-col gap-1 items-start relative shrink-0 w-full">
            <div className="flex gap-2.5 items-center relative shrink-0 w-full">
              <p className="font-medium leading-[1.4] relative shrink-0 text-xs text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                Enter GSTIN
              </p>
            </div>
            <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-1 h-12 items-center px-3 py-2 relative rounded-md shrink-0 w-full">
              <div className="grow flex gap-2 items-center justify-center min-h-px min-w-px relative shrink-0">
                <p className="font-medium grow leading-6 relative shrink-0 text-base text-[#9296a0] tracking-[-0.16px]">
                  DDXXXXXX9J
                </p>
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
