import { Info } from "lucide-react"


const ModalHeader = () => {
  return (
    <div className="flex items-start justify-between px-4 py-2 relative w-full">
      {/* Logo */}
      <div className="h-7 overflow-clip relative shrink-0 w-[52px]">
        <img alt="" className="block max-w-none size-full" src={'https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/dashboard_2.0/idto_color_logo.png'} />
      </div>

      {/* Help Button */}
      <div className="flex gap-2 items-center px-3 py-1.5 relative rounded">
        <div className="overflow-clip relative shrink-0 size-4">
          <div className="absolute inset-[9.375%]">
            <Info className="block max-w-none size-full" />
          </div>
        </div>
        <p className="font-medium leading-[1.4] relative text-xs text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
          Help
        </p>
      </div>
    </div>
  )
}

export default ModalHeader
