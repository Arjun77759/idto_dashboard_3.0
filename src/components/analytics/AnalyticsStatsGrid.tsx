import { motion } from 'framer-motion'

const AnalyticsStatsGrid = () => {
  const stats = [
    {
      label: "Total Verifications",
      value: "330"
    },
    {
      label: "Successful Rate",
      value: "95%"
    },
    {
      label: "Failed Rate",
      value: "5%"
    },
    {
      label: "Avg. Verification Time",
      value: "15s"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white border border-[#e7e8ea] border-solid h-auto sm:h-[125px] relative rounded-2xl shrink-0 w-full"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 h-auto sm:h-[125px] overflow-hidden relative rounded-[inherit] w-full">
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className={`border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid relative shrink-0 ${
              index % 2 === 1 ? 'border-r-0' : 'border-r'
            } sm:border-r ${
              index === stats.length - 1 ? 'sm:border-r-0' : ''
            }`}
          >
            <div className="flex flex-col font-medium gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
              <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
                {stat.label}
              </p>
              <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default AnalyticsStatsGrid
