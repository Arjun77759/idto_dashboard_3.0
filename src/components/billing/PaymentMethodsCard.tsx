import { motion } from 'framer-motion'
import { useState } from 'react'
import { CreditCard, Edit, Plus } from 'lucide-react'

const PaymentMethodsCard = () => {
  const [autoPayEnabled, setAutoPayEnabled] = useState(true)

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
      className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl h-full w-full lg:w-[281px]"
    >
      <div className="flex flex-col gap-4 h-full items-start overflow-hidden p-6 relative rounded-[inherit] w-full">
        <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
          Payment Methods
        </p>

        {/* Payment Method Details */}
        <div className="border-[1px_0px] border-[#e7e8ea] border-solid relative shrink-0 w-full">
          <div className="flex flex-col gap-2 items-start overflow-hidden px-0 py-3.5 relative rounded-[inherit] w-full">
            <div className="flex items-center justify-between relative shrink-0 w-[217px]">
              <div className="flex gap-2 items-center relative shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="10" viewBox="0 0 32 10" fill="none">
                  <path d="M20.8494 0C18.5803 0 16.5429 1.14118 16.5429 3.23529C16.5429 5.64706 20.1418 5.81176 20.1418 7.01176C20.1418 7.51765 19.5318 7.97647 18.5071 7.97647C17.0431 7.97647 15.9451 7.34118 15.9451 7.34118L15.4815 9.45882C15.4815 9.45882 16.7381 10 18.4217 10C20.9104 10 22.8624 8.81176 22.8624 6.67059C22.8624 4.12941 19.2512 3.96471 19.2512 2.84706C19.2512 2.44706 19.7514 2.01176 20.7762 2.01176C21.9352 2.01176 22.8868 2.47059 22.8868 2.47059L23.3504 0.423529C23.3382 0.423529 22.3012 0 20.8494 0ZM0.0609989 0.152941L0 0.458824C0 0.458824 0.951582 0.623529 1.81777 0.964706C2.92795 1.35294 3.00114 1.57647 3.19634 2.27059L5.2337 9.83529H7.96645L12.151 0.152941H9.43042L6.73427 6.74118L5.63629 1.15294C5.5387 0.517647 5.02631 0.152941 4.39192 0.152941H0.0609989ZM13.249 0.152941L11.114 9.83529H13.7125L15.8353 0.152941H13.249ZM27.7179 0.152941C27.0957 0.152941 26.7663 0.470588 26.5223 1.03529L22.716 9.83529H25.4365L25.9611 8.36471H29.2795L29.5966 9.83529H32L29.9138 0.152941H27.7179ZM28.0717 2.77647L28.8769 6.41176H26.7175L28.0717 2.77647Z" fill="url(#paint0_linear_265_11770)" />
                  <defs>
                    <linearGradient id="paint0_linear_265_11770" x1="0" y1="5" x2="32" y2="5" gradientUnits="userSpaceOnUse">
                      <stop stop-color="#0019FF" />
                      <stop offset="1" stop-color="#3B5397" />
                    </linearGradient>
                  </defs>
                </svg>
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  ending in 1234
                </p>
              </div>
              <Edit className="size-4 text-[#9296a0]" />
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
            className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${autoPayEnabled ? 'bg-[#0019ff]' : 'bg-gray-300'
              }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${autoPayEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
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
            <Plus className="size-4 text-[#0019ff]" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default PaymentMethodsCard
