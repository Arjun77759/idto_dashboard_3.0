import AnalyticsFilters from '@/components/analytics/AnalyticsFilters'
import AnalyticsPieChart from '@/components/analytics/AnalyticsPieChart'
import AnalyticsStatsGrid from '@/components/analytics/AnalyticsStatsGrid'
import BarChart from '@/components/analytics/BarChart'
import MonthlyTransactionsChart from '@/components/analytics/MonthlyTransactionsChart'
import VerificationVolumeChart from '@/components/analytics/VerificationVolumeChart'
import { AnalyticsFilterProvider } from '@/contexts/AnalyticsFilterContext'
import { motion } from 'framer-motion'

const AnalyticsPage = () => {
  return (
    <AnalyticsFilterProvider>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start overflow-hidden p-4 sm:p-6 relative rounded-2xl w-full overflow-y-auto"
      >
        {/* Analytics Header */}
        <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M3.70178 2.63984C5.59174 0.995556 8.06105 0 10.7629 0C16.4547 0 21.1145 4.41814 21.5 10.012H14.6974C14.3459 8.15913 12.718 6.7581 10.7629 6.7581C9.92837 6.7581 9.15346 7.01335 8.51198 7.45005L3.70178 2.63984Z" fill="#131B31" />
            <path d="M2.63984 3.70178C0.995556 5.59174 0 8.06105 0 10.7629C0 16.4547 4.41814 21.1145 10.012 21.5V14.6974C8.15913 14.3459 6.7581 12.718 6.7581 10.7629C6.7581 9.92837 7.01335 9.15346 7.45005 8.51198L2.63984 3.70178Z" fill="#131B31" />
            <path d="M11.5138 14.6974V21.5C16.8596 21.1316 21.1316 16.8596 21.5 11.5138H14.6974C14.3921 13.1234 13.1234 14.3921 11.5138 14.6974Z" fill="#131B31" />
          </svg>
          <p className="font-medium leading-[1.4] relative text-lg sm:text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
            Analytics
          </p>
        </div>

        {/* Filters */}
        <AnalyticsFilters />

        {/* Stats Grid */}
        <AnalyticsStatsGrid />

        {/* Charts Row 1 */}
        <div className="flex flex-wrap gap-5 items-start relative w-full">
          <VerificationVolumeChart />
          <MonthlyTransactionsChart />
        </div>

        {/* Charts Row 2 */}
        <div className="flex flex-wrap gap-5 items-start relative w-full">
          <BarChart />
          {/* <AnalyticsLineChart /> */}
          <AnalyticsPieChart />
        </div>
      </motion.div>
    </AnalyticsFilterProvider>
  )
}

export default AnalyticsPage