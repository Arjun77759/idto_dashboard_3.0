import { motion } from 'framer-motion'
import CurrentBalanceCard from '@/components/billing/CurrentBalanceCard'
import PaymentMethodsCard from '@/components/billing/PaymentMethodsCard'
import ApiUsageTable from '@/components/billing/ApiUsageTable'
import RecentInvoicesTable from '@/components/billing/RecentInvoicesTable'
import { CreditCard } from 'lucide-react'

const BillingPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start p-4 sm:p-6 relative rounded-2xl w-full h-full"
    >
      {/* Billing Header */}
      <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
        <CreditCard className="size-5 sm:size-6 text-[#131b31]" />
        <p className="font-medium leading-[1.4] relative text-lg sm:text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
          Billing
        </p>
      </div>

      {/* Top Section - Balance and Payment Cards */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 items-stretch relative w-full">
        <CurrentBalanceCard />
        {/* <PaymentMethodsCard /> */}
        <ApiUsageTable />
      </div>

      {/* Bottom Section - Tables */}
      <div className="flex gap-4 sm:gap-5 items-start relative w-full">
        <RecentInvoicesTable />
      </div>
    </motion.div>
  )
}

export default BillingPage
