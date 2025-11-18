import { Dialog, DialogContent } from '../../ui/dialog'
import { Sheet, SheetContent } from '../../ui/sheet'
import { useIsMobile } from '../../../hooks/use-mobile'
import { AlertTriangle, X, ArrowRight } from 'lucide-react'

interface SimulationModeModalProps {
  isOpen: boolean
  onClose: () => void
  onMoveToProduction: () => void
}

const SimulationModeModal = ({ isOpen, onClose, onMoveToProduction }: SimulationModeModalProps) => {
  const isMobile = useIsMobile()

  const handleMoveToProduction = () => {
    onMoveToProduction()
    onClose()
  }

  // Mobile content
  const MobileContent = () => (
    <div className="bg-white flex flex-col gap-6 items-center px-4 py-6 relative rounded-lg w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-6 items-center pb-2 pt-0 px-0 relative shrink-0 w-full border-b border-[#e7e8ea]">
        <div className="relative shrink-0 size-8">
          <AlertTriangle className="size-8 text-[#b47d1f]" />
        </div>
        <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-[20px] text-[#131b31] text-center tracking-[-0.2px]">
          <span>You're in </span>
          <span className="text-[#b47d1f]">Simulation Mode</span>
        </p>
      </div>

      {/* Body Text */}
      <div className="flex flex-col gap-1 items-start pb-2 pt-0 px-0 relative shrink-0 w-full">
        <p className="font-normal leading-6 not-italic relative shrink-0 text-base text-[#616675] text-center tracking-[-0.16px] w-full">
          All data shown here is sample data to help you explore the dashboard and test features safely. To run real verifications or see live results, please switch to Production Mode.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
        <div className="flex gap-2 items-start relative shrink-0 w-full">
          <button
            onClick={onClose}
            className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0 w-[146px] h-10 flex gap-2 items-center justify-center px-2"
          >
            <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-xs text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Cancel
            </p>
            <X className="size-4 text-[#9296a0]" />
          </button>
          <button
            onClick={handleMoveToProduction}
            className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid grow min-h-0 min-w-0 relative rounded-lg shrink-0 h-10 flex gap-2 items-center justify-center px-2"
          >
            <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-xs text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              Move to Production
            </p>
            <ArrowRight className="size-4 text-[#0019ff]" />
          </button>
        </div>
      </div>
    </div>
  )

  // Desktop content
  const DesktopContent = () => (
    <div className="bg-white border border-[#e7e8ea] border-solid flex flex-col gap-12 items-center px-4 py-6 relative rounded-lg w-full">
      {/* Header Section */}
      <div className="flex flex-col gap-6 items-center pb-2 pt-0 px-0 relative shrink-0 w-full border-b border-[#e7e8ea]">
        <div className="relative shrink-0 size-8">
          <AlertTriangle className="size-8 text-[#b47d1f]" />
        </div>
        <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-[20px] text-[#131b31] text-center tracking-[-0.2px]">
          <span>You're in </span>
          <span className="text-[#b47d1f]">Simulation Mode</span>
        </p>
      </div>

      {/* Body Text */}
      <div className="flex flex-col gap-1 items-start pb-2 pt-0 px-0 relative shrink-0 w-full">
        <p className="font-normal leading-6 not-italic relative shrink-0 text-base text-[#616675] text-center tracking-[-0.16px] w-full">
          All data shown here is sample data to help you explore the dashboard and test features safely. To run real verifications or see live results, please switch to Production Mode.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-4 items-start relative shrink-0 w-full">
        <div className="flex gap-2 items-start relative shrink-0 w-full">
          <button
            onClick={onClose}
            className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0 w-[146px] h-10 flex gap-2 items-center justify-center px-2"
          >
            <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-xs text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Cancel
            </p>
            <X className="size-4 text-[#9296a0]" />
          </button>
          <button
            onClick={handleMoveToProduction}
            className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid grow min-h-0 min-w-0 relative rounded-lg shrink-0 h-10 flex gap-2 items-center justify-center px-2"
          >
            <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-xs text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              Move to Production
            </p>
            <ArrowRight className="size-4 text-[#0019ff]" />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="bottom" className="h-auto p-0 flex flex-col overflow-hidden">
            <MobileContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-[485px] w-full p-0 flex flex-col">
            <DesktopContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default SimulationModeModal

