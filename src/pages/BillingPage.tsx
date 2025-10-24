import { motion } from 'framer-motion'
import CurrentBalanceCard from '@/components/billing/CurrentBalanceCard'
import PaymentMethodsCard from '@/components/billing/PaymentMethodsCard'
import ApiUsageTable from '@/components/billing/ApiUsageTable'
import RecentInvoicesTable from '@/components/billing/RecentInvoicesTable'

// Image assets from Figma
const imgCreditCard = "http://localhost:3845/assets/6e46ff48b78b96a2f20c3929d1588cedc44a03f8.svg"

const BillingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-5 items-start p-6 relative rounded-2xl w-full h-full"
    >
      {/* Billing Header */}
      <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
        <div className="overflow-hidden relative shrink-0 size-6">
          <div className="absolute inset-[13.54%_5.21%]">
            <img alt="" className="block max-w-none size-full" src={imgCreditCard} />
          </div>
        </div>
        <p className="font-medium leading-[1.4] relative text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
          Billing
        </p>
      </div>

      {/* Top Section - Balance and Payment Cards */}
      <div className="flex gap-5 items-start relative w-full h-full ">
        <CurrentBalanceCard />
        <PaymentMethodsCard />
        <ApiUsageTable />
      </div>

      {/* Bottom Section - Tables */}
      <div className="flex gap-5 items-start relative w-full">
        <RecentInvoicesTable />
      </div>
    </motion.div>
  )
}

export default BillingPage
