import { motion } from 'framer-motion'
import AnalyticsFilters from '@/components/analytics/AnalyticsFilters'
import AnalyticsStatsGrid from '@/components/analytics/AnalyticsStatsGrid'
import VerificationVolumeChart from '@/components/analytics/VerificationVolumeChart'
import MonthlyTransactionsChart from '@/components/analytics/MonthlyTransactionsChart'
import AnalyticsPieChart from '@/components/analytics/AnalyticsPieChart'
import BarChart from '@/components/analytics/BarChart'
import AnalyticsLineChart from '@/components/analytics/AnalyticsLineChart'
import { BarChart3 } from 'lucide-react'

const AnalyticsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-5 items-start overflow-hidden p-6 relative rounded-2xl w-full"
    >
      {/* Analytics Header */}
      <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
        <BarChart3 className="size-6 text-[#131b31]" />
        <p className="font-medium leading-[1.4] relative text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
          Analytics
        </p>
      </div>

      {/* Filters */}
      <AnalyticsFilters />

      {/* Stats Grid */}
      <AnalyticsStatsGrid />

      {/* Charts Row 1 */}
      <div className="flex gap-5 items-start relative w-full">
        <VerificationVolumeChart />
        <MonthlyTransactionsChart />
        <AnalyticsPieChart />
      </div>

      {/* Charts Row 2 */}
      <div className="flex gap-5 items-start relative w-full">
        <BarChart />
        <AnalyticsLineChart />
      </div>
    </motion.div>
  )
}

export default AnalyticsPage