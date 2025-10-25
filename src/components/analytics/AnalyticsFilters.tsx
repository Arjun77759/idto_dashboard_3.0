import { motion } from 'framer-motion'
import { Calendar, ChevronDown, RotateCcw } from 'lucide-react'

const AnalyticsFilters = () => {
  const handleReset = () => {
    console.log('Reset filters')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="hidden md:flex flex-wrap gap-2 h-auto items-center justify-between relative shrink-0 w-full"
    >
      <div className="flex flex-wrap gap-2 h-full items-center min-h-0 min-w-px relative shrink-0">
        {/* Date Range Filter */}
        <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
          <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Sep 9, 2024 - Sep 15, 2024
            </p>
            <Calendar className="size-4 text-[#9296a0]" />
          </div>
        </div>

        {/* Region Filter */}
        <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
          <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Region
            </p>
            <ChevronDown className="size-4 text-[#9296a0]" />
          </div>
        </div>

        {/* Verification Type Filter */}
        <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
          <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Verification Type
            </p>
            <ChevronDown className="size-4 text-[#9296a0]" />
          </div>
        </div>

        {/* Device Type Filter */}
        <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
          <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Device Type
            </p>
            <ChevronDown className="size-4 text-[#9296a0]" />
          </div>
        </div>
      </div>

      {/* Reset Button */}
      <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
        <button
          onClick={handleReset}
          className="flex gap-1 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]"
        >
          <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Reset
          </p>
          <RotateCcw className="size-4 text-[#9296a0]" />
        </button>
      </div>
    </motion.div>
  )
}

export default AnalyticsFilters
