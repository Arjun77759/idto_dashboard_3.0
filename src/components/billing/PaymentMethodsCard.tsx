import { motion } from 'framer-motion'
import { useState } from 'react'

// Image assets from Figma
const imgVisaIncLogoSvg = "http://localhost:3845/assets/ee687c1cd732e9d3de025c64303253277d85f6c5.svg"
const imgEdit = "http://localhost:3845/assets/1b0258a2d19a34c50713f3c3d72fa433899049a0.svg"
const imgToggleOn = "http://localhost:3845/assets/35a819250a419045542d34f13a38cb74c4c7db97.svg"
const imgPlus = "http://localhost:3845/assets/159cf5ad90ce0de038b333a6e8361c10004c921e.svg"

const PaymentMethodsCard = () => {
  const [autoPayEnabled, setAutoPayEnabled] = useState(true)

  const handleEditPayment = () => {
    console.log('Edit payment method')
  }

  const handleAddPaymentMethod = () => {
    console.log('Add payment method')
  }

  const toggleAutoPay = () => {
    setAutoPayEnabled(!autoPayEnabled)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl h-full  w-[281px]"
    >
      <div className="flex flex-col gap-4 h-full items-start overflow-hidden p-6 relative rounded-[inherit] w-[281px]">
        <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
          Payment Methods
        </p>

        {/* Payment Method Details */}
        <div className="border-[1px_0px] border-[#e7e8ea] border-solid relative shrink-0 w-full">
          <div className="flex flex-col gap-2 items-start overflow-hidden px-0 py-3.5 relative rounded-[inherit] w-full">
            <div className="flex items-center justify-between relative shrink-0 w-[217px]">
              <div className="flex gap-2 items-center relative shrink-0">
                <div className="h-2.5 relative shrink-0 w-8">
                  <img alt="" className="block max-w-none size-full" src={imgVisaIncLogoSvg} />
                </div>
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  ending in 1234
                </p>
              </div>
              <div className="overflow-hidden relative shrink-0 size-4">
                <div className="absolute inset-[8.33%_8.33%_8.33%_8.34%]">
                  <div className="absolute inset-[-5.63%_-5.63%_-5.62%_-5.63%]">
                    <img alt="" className="block max-w-none size-full" src={imgEdit} />
                  </div>
                </div>
              </div>
            </div>
            <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Expires 01/05/2025
            </p>
          </div>
        </div>

        <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
          Auto-pay keeps your service active. Your default card is charged automatically.
        </p>

        {/* Auto-pay Toggle */}
        <div className="flex h-10 items-center justify-between overflow-hidden px-0 py-3.5 relative rounded-lg shrink-0 w-full">
          <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Auto-pay
          </p>
          <button
            onClick={toggleAutoPay}
            className="overflow-hidden relative shrink-0 size-6"
          >
            <div className="absolute inset-[21.88%_5.21%]">
              <img alt="" className="block max-w-none size-full" src={imgToggleOn} />
            </div>
          </button>
        </div>

        {/* Add Payment Method Button */}
        <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0 w-full">
          <button
            onClick={handleAddPaymentMethod}
            className="flex gap-2 h-10 items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit] w-full"
          >
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              Add Payment Method
            </p>
            <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
              <div className="flex-none rotate-[90deg]">
                <div className="overflow-hidden relative size-4">
                  <div className="absolute inset-[16.667%]">
                    <img alt="" className="block max-w-none size-full" src={imgPlus} />
                  </div>
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default PaymentMethodsCard
