import { useState } from 'react'
import { Dialog, DialogContent } from '../ui/dialog'

// Image assets from Figma
const imgFrame1686553080 = "http://localhost:3845/assets/94112899ef626c166b51f0af371c20748c3f5386.png"
const imgHome1 = "http://localhost:3845/assets/d76cd30487587ada0c1736c160d316ea17b8da1e.png"
const imgGroup = "http://localhost:3845/assets/af298919f1cf17deb2cde453abf4372e80aedb9d.svg"
const imgGroup1 = "http://localhost:3845/assets/8223287a0c8bcdd7941c72b3cc7ea05acb74aeef.svg"
const imgInfo = "http://localhost:3845/assets/b1ca62dbcb725bc9070d7a828d7ff30d62ceb4a9.svg"
const imgBusiness = "http://localhost:3845/assets/1884e5745703a218e3a7ea9864a7139057b77650.svg"
const imgBuilding = "http://localhost:3845/assets/c9bbcb9880591923042f58296ee01b3fdf21d4b2.svg"
const imgCreditCard = "http://localhost:3845/assets/cc86ea75bbe1cc7245c05264931f73e12fc33592.svg"
const imgLock = "http://localhost:3845/assets/6f9ddf7c798f338dd2c0b1de451c9a7dd8cf381d.svg"
const imgPriority = "http://localhost:3845/assets/463a235a3b145b1e261f1f8355514bd3a62d825f.svg"
const imgArrow = "http://localhost:3845/assets/e0bf1f6ea3a5839cca531ea155e3190f150682fe.svg"

interface SwitchToProductionModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

const SwitchToProductionModal = ({ isOpen, onClose, onConfirm }: SwitchToProductionModalProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirm = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    onConfirm()
    onClose()
  }

  const verificationSteps = [
    {
      icon: imgInfo,
      title: 'Provide your basic details'
    },
    {
      icon: imgBusiness,
      title: 'Tell us about your Business'
    },
    {
      icon: imgBuilding,
      title: 'Provide your business PAN'
    },
    {
      icon: imgCreditCard,
      title: 'Provide your GSTIN number'
    },
    {
      icon: imgLock,
      title: 'Verify Aadhaar via Digilocker'
    }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-[856px] max-h-[90vh] overflow-hidden p-0">
        <div className="bg-[#f7f7f8] flex flex-col gap-4 items-start p-4 relative rounded-2xl shadow-[0px_4px_131px_0px_rgba(19,27,49,0.25)] w-full">
          {/* Header */}
          <div className="flex items-start justify-between px-4 py-2 relative w-full">
            <div className="h-7 overflow-clip relative shrink-0 w-[52px]">
              <div className="absolute inset-[14.44%_69.16%_14.26%_7.78%]">
                <img alt="" className="block max-w-none size-full" src={imgGroup} />
              </div>
              <div className="absolute inset-[28.75%_7.98%_28.51%_38.52%]">
                <img alt="" className="block max-w-none size-full" src={imgGroup1} />
              </div>
            </div>
            <div className="flex gap-2 items-center px-3 py-1.5 relative rounded">
              <div className="overflow-clip relative shrink-0 size-4">
                <div className="absolute inset-[9.375%]">
                  <img alt="" className="block max-w-none size-full" src={imgInfo} />
                </div>
              </div>
              <p className="font-medium leading-[1.4] relative text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                Help
              </p>
            </div>
          </div>

          {/* Main Content */}
          <div className="border border-[#e7e8ea]  border-solid flex items-start justify-between relative rounded w-full">
            {/* Left Panel */}
            <div className="bg-white flex-1 flex flex-col gap-4 items-start p-6 relative rounded shrink-0">
              <div className="flex flex-col items-start relative shrink-0 w-full">
                <p className="font-bold leading-8 relative shrink-0 text-2xl text-[#616675] tracking-[-0.24px] w-full">
                  Hi, Welcome!
                </p>
                <div className="flex gap-2 items-center px-0 py-2 relative shrink-0">
                  <p className="font-normal text-wrap leading-[1.4] text-xs text-[#9296a0] tracking-[-0.12px]">
                    Finish these steps to verify your business and get dashboard access. Details are required for compliance.
                  </p>
                </div>
              </div>

              {/* Step-by-step guide */}
              <div className="border border-[#e7e8ea] border-solid flex flex-col gap-4 items-start p-4 relative rounded shrink-0 w-full">
                <p className="font-bold leading-6 min-w-full relative shrink-0 text-base text-[#131b31] tracking-[-0.16px] w-[min-content]">
                  Step-by-step guide
                </p>
                <div className="flex flex-col gap-2 items-start relative shrink-0 w-full">
                  {verificationSteps.map((step, index) => (
                    <div key={index} className="flex gap-2 items-center px-3 py-1.5 relative rounded shrink-0 w-full">
                      <div className="overflow-clip relative shrink-0 size-4">
                        <div className="absolute inset-[8.333%]">
                          <img alt="" className="block max-w-none size-full" src={step.icon} />
                        </div>
                      </div>
                      <p className="font-medium leading-[1.4] not-italic relative shrink-0 text-xs text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                        {step.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info section */}
              <div className="flex gap-2 items-start px-0 py-2 relative shrink-0 w-full">
                <div className="relative shrink-0 size-6">
                  <img alt="" className="block max-w-none size-full" src={imgPriority} />
                </div>
                <p className="font-normal leading-[1.4] text-xs text-[#9296a0] tracking-[-0.12px]">
                  Finish these steps to verify your business and get dashboard access. Details are required for compliance.
                </p>
              </div>

              {/* Action Button */}
              <div className="flex gap-10 items-center justify-end relative shrink-0 w-full">
                <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
                  <button
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-[inherit]"
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
            </div>

            {/* Right Panel */}
            <div className="bg-white flex-1 flex flex-col gap-4 items-start p-6 relative rounded shrink-0 h-full">
              <div className="grow min-h-px min-w-px overflow-clip relative rounded w-full">
                <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded">
                  <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded size-full" src={imgFrame1686553080} />
                  <div className="absolute inset-0 rounded" style={{ backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 364 469\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(6.0498e-15 23.45 -18.2 6.6237e-15 182 234.5)\\'><foreignObject x=\\'-190\\' y=\\'-190\\' width=\\'380\\' height=\\'380\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgba(138, 149, 255, 1) 0%, rgba(104, 118, 255, 1) 25%, rgba(69, 87, 255, 1) 50%, rgba(35, 56, 255, 1) 75%, rgba(17, 41, 255, 1) 87.5%, rgba(0, 25, 255, 1) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')" }} />
                </div>
                <div className="absolute h-[450.688px] left-[42px] rounded shadow-[0px_4px_100px_0px_rgba(0,0,0,0.25)] top-[calc(50%+163.844px)] translate-y-[-50%] w-[754.799px]">
                  <div aria-hidden="true" className="absolute inset-0 pointer-events-none rounded">
                    <img alt="" className="absolute max-w-none object-50%-50% object-cover rounded size-full" src={imgHome1} />
                    <div className="absolute inset-0 rounded" />
                  </div>
                </div>
                <p className="absolute bg-clip-text font-bold leading-8 left-1/2 text-2xl text-center top-[35px] tracking-[-0.24px] translate-x-[-50%] w-[364px]" style={{ WebkitTextFillColor: "transparent" }}>
                  All your insights.
                  <br aria-hidden="true" />
                  One clean dashboard
                </p>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SwitchToProductionModal
