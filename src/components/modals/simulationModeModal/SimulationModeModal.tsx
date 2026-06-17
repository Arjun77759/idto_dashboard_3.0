import { Dialog, DialogContent } from '../../ui/dialog'
import { Sheet, SheetContent } from '../../ui/sheet'
import { useIsMobile } from '../../../hooks/use-mobile'
import { ArrowRight, CheckCircle2, FlaskConical, Lock, X } from 'lucide-react'

interface SimulationModeModalProps {
  isOpen: boolean
  onClose: () => void
  onMoveToProduction: () => void
}

const SimulationModeModal = ({ isOpen, onClose, onMoveToProduction }: SimulationModeModalProps) => {
  const isMobile = useIsMobile()

  const handleMoveToProduction = () => {
    onMoveToProduction()
  }

  const ModalContent = () => (
    <div className="w-full overflow-hidden rounded-[18px] bg-white shadow-[0_0_0_1px_rgba(0,25,255,0.1),0_30px_80px_-20px_rgba(0,25,255,0.25)]">
      <div className="flex flex-col gap-[11.2px] bg-[linear-gradient(160.78deg,#2c67ce_0%,#0493c9_50.48%,#02afb9_100%)] p-7">
        <div className="flex w-full items-start justify-between gap-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[10px] font-normal leading-4 text-[#fcfcfc] backdrop-blur">
            <FlaskConical className="size-[14px]" strokeWidth={1.8} />
            Sandbox Mode
          </div>
          <button
            type="button"
            onClick={onClose}
            className="-mr-1 -mt-1 flex size-7 items-center justify-center rounded-full p-1 text-[#90a1b9] transition hover:bg-white/10 hover:text-white"
            aria-label="Close sandbox preview"
          >
            <X className="size-5" strokeWidth={1.8} />
          </button>
        </div>

        <div className="pt-[8.8px]">
          <h2 className="text-[30px] font-semibold leading-9 tracking-[-0.75px] text-white">
            This is a sandbox preview
          </h2>
        </div>
        <p className="max-w-[498px] pb-[0.565px] text-[12px] font-normal leading-[24.38px] text-[#e1e4f3]">
          Actions are disabled here - everything you see uses simulated data so you can explore safely.
        </p>
      </div>

      <div className="h-px w-full bg-[#f1f5f9]" />

      <div className="flex flex-col gap-4 p-7">
        <div className="flex w-full flex-col gap-3">
          <div className="flex w-full items-center gap-3">
            <CheckCircle2 className="size-4 shrink-0 text-[#00e59e]" strokeWidth={2} />
            <p className="text-[12px] font-normal leading-[22.5px] text-[#314158]">
              Browse the full dashboard with sample verifications, invoices and APIs.
            </p>
          </div>
          <div className="flex w-full items-center gap-3">
            <CheckCircle2 className="size-4 shrink-0 text-[#00e59e]" strokeWidth={2} />
            <p className="text-[12px] font-normal leading-[22.5px] text-[#314158]">
              Test API calls return dummy responses - nothing is charged.
            </p>
          </div>
          <div className="flex w-full items-center gap-3">
            <Lock className="size-4 shrink-0 text-[#62748e]" strokeWidth={1.8} />
            <p className="text-[12px] font-normal leading-[22.5px] text-[#62748e]">
              Buttons, forms and live actions are locked until you go live.
            </p>
          </div>
        </div>

        <div className="flex w-full flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 items-center justify-center rounded-[12px] border border-[#e2e8f0] bg-white px-[21px] py-[11px] text-center text-[14px] font-normal leading-5 text-[#314158] transition hover:bg-[#f8fafc]"
          >
            Keep exploring
          </button>
          <button
            type="button"
            onClick={handleMoveToProduction}
            className="flex h-9 items-center justify-center gap-1 rounded-[12px] bg-[#435bcf] px-4 py-2 text-center text-[14px] font-normal leading-5 text-[#fcfcfc] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] transition hover:bg-[#344ac1]"
          >
            Switch to production
            <ArrowRight className="size-4" strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <SheetContent
            side="bottom"
            onEscapeKeyDown={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}
            className="h-auto border-0 bg-transparent p-4 shadow-none [&>button]:hidden"
          >
            <ModalContent />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
          <DialogContent
            onEscapeKeyDown={(event) => event.preventDefault()}
            onInteractOutside={(event) => event.preventDefault()}
            className="w-[calc(100vw-48px)] max-w-[577px] border-0 bg-transparent p-0 shadow-none sm:rounded-[18px] [&>button]:hidden"
          >
            <ModalContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default SimulationModeModal

