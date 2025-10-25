
// Image assets from Figma
const imgGroup = "http://localhost:3845/assets/af298919f1cf17deb2cde453abf4372e80aedb9d.svg"
const imgGroup1 = "http://localhost:3845/assets/8223287a0c8bcdd7941c72b3cc7ea05acb74aeef.svg"
const imgInfo = "http://localhost:3845/assets/b1ca62dbcb725bc9070d7a828d7ff30d62ceb4a9.svg"

const ModalHeader = () => {
  return (
    <div className="flex items-start justify-between px-4 py-2 relative w-full">
      {/* Logo */}
      <div className="h-7 overflow-clip relative shrink-0 w-[52px]">
        <div className="absolute inset-[14.44%_69.16%_14.26%_7.78%]">
          <img alt="" className="block max-w-none size-full" src={imgGroup} />
        </div>
        <div className="absolute inset-[28.75%_7.98%_28.51%_38.52%]">
          <img alt="" className="block max-w-none size-full" src={imgGroup1} />
        </div>
      </div>
      
      {/* Help Button */}
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
  )
}

export default ModalHeader
