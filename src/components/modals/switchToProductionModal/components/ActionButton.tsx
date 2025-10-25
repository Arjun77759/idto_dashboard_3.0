import { ArrowRight } from 'lucide-react'
import React from 'react'

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
              <ArrowRight className="size-4 text-[#0019ff]" />
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default ActionButton
