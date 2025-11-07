import { motion } from 'framer-motion'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import StatsGrid from '@/components/dashboard/StatsGrid'
import ActionCards from '@/components/dashboard/ActionCards'
import ChartSection from '@/components/dashboard/ChartSection'
import InvoicesTable from '@/components/dashboard/InvoicesTable'

const DashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-5 items-start relative w-full"
    >
      {/* Welcome Section */}
      <WelcomeSection />

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 grow items-start min-h-0 min-w-0 overflow-hidden p-4 sm:p-6 relative rounded-2xl w-full"
      >
        <div className="flex gap-2 items-center px-2 sm:px-3 py-1.5 relative rounded w-full">
          <div className="overflow-hidden relative shrink-0 size-5 sm:size-6">
            <div className="absolute inset-[9.38%_7.29%]">
              <span className="text-xl sm:text-2xl">👋</span>
            </div>
          </div>
          <p className="font-medium leading-[1.4] relative text-[16px] sm:text-[18px] lg:text-[20px] text-[#131b31] text-nowrap tracking-[-0.16px] sm:tracking-[-0.18px] lg:tracking-[-0.2px] whitespace-pre">
            Welcome— Here's What's New
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Action Cards */}
        <ActionCards />

        {/* Bottom Section - Chart and Table */}
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 items-start relative w-full">
          <ChartSection />
          <InvoicesTable />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPage
