import React from 'react'

// Image assets from Figma
const imgArrow = "http://localhost:3845/assets/e0bf1f6ea3a5839cca531ea155e3190f150682fe.svg"

interface ActionButtonProps {
  isLoading: boolean
  onConfirm: () => void
}

const ActionButton: React.FC<ActionButtonProps> = ({ isLoading, onConfirm }) => {
  return (
    <div className="flex gap-10 items-center justify-end relative shrink-0 w-full">
      <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-[inherit] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-[#0019ff] border-t-transparent rounded-full animate-spin" />
              <p className="font-bold leading-4 relative text-xs text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                Starting...
              </p>
            </div>
          ) : (
            <>
              <p className="font-bold leading-4 relative text-xs text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                Start Verification
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
  )
}

export default ActionButton
