import { motion } from 'framer-motion'

// Image assets from Figma
const imgCalendar = "http://localhost:3845/assets/843b5e757f3e18c044e38bd591197daeb56b86e6.svg"
const imgArrow = "http://localhost:3845/assets/0767fe49935de804ac4d4ed37fa4a369cccdeb5e.svg"
const imgRestart = "http://localhost:3845/assets/5c48ecd60b568c24fe6f0982e01796d95745aaf4.svg"

const AnalyticsFilters = () => {
  const handleReset = () => {
    console.log('Reset filters')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex h-10 items-center justify-between relative shrink-0 w-full"
    >
      <div className="flex gap-4 h-full items-center min-h-0 min-w-px relative shrink-0">
        {/* Date Range Filter */}
        <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
          <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Sep 9, 2024 - Sep 15, 2024
            </p>
            <div className="overflow-hidden relative shrink-0 size-4">
              <div className="absolute inset-[6.25%_9.38%]">
                <img alt="" className="block max-w-none size-full" src={imgCalendar} />
              </div>
            </div>
          </div>
        </div>

        {/* Region Filter */}
        <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
          <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Region
            </p>
            <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
              <div className="flex-none rotate-[90deg]">
                <div className="overflow-hidden relative size-4">
                  <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                    <div className="absolute inset-[-6.63%_-26.52%_-6.63%_-13.26%]">
                      <img alt="" className="block max-w-none size-full" src={imgArrow} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Type Filter */}
        <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
          <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Verification Type
            </p>
            <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
              <div className="flex-none rotate-[90deg]">
                <div className="overflow-hidden relative size-4">
                  <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                    <div className="absolute inset-[-6.63%_-26.52%_-6.63%_-13.26%]">
                      <img alt="" className="block max-w-none size-full" src={imgArrow} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Device Type Filter */}
        <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
          <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Device Type
            </p>
            <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
              <div className="flex-none rotate-[90deg]">
                <div className="overflow-hidden relative size-4">
                  <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                    <div className="absolute inset-[-6.63%_-26.52%_-6.63%_-13.26%]">
                      <img alt="" className="block max-w-none size-full" src={imgArrow} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <div className="overflow-hidden relative shrink-0 size-4">
            <div className="absolute inset-[11.6%_16.67%]">
              <img alt="" className="block max-w-none size-full" src={imgRestart} />
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  )
}

export default AnalyticsFilters
