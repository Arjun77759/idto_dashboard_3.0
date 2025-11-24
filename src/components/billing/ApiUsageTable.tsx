import { motion } from 'framer-motion'
import { useState } from 'react'
import { useUsageMonthly } from '@/hooks/useUsageMonthly'
import { Skeleton } from '@/components/ui/skeleton'

const ApiUsageTable = () => {
  const { data, loading, error } = useUsageMonthly()
  const [showAll, setShowAll] = useState(false)

  // Transform snake_case to Title Case
  const formatApiName = (name: string): string => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white border border-[#e7e8ea] border-solid grow min-h-0 min-w-px relative rounded-2xl shrink-0 w-full lg:w-auto h-full"
    >
      <div className="flex flex-col gap-4 sm:gap-6 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] w-full h-full">
        <div className="flex font-medium items-center justify-between leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] w-full whitespace-pre">
          <p className="relative shrink-0">
            API Usage
          </p>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="relative shrink-0 hover:text-[#131b31]"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        </div>

        <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid relative rounded-md shrink-0 w-full overflow-x-auto">
          <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] w-full min-w-[500px]">
            {/* Table Header */}
            <div className="bg-white flex items-start relative shrink-0 w-full">
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[205px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[205px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    API Name
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[76px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[76px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Calls
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[96px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[96px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-3 not-italic right-[11px] text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Per Unit Cost
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="h-10 overflow-hidden relative shrink-0 w-[77px]">
                <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                  Cost
                </p>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
              <div className="grow h-10 min-h-0 min-w-px overflow-hidden relative shrink-0">
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>

            {/* Table Rows */}
            {loading && (
              Array.from({ length: 5 }).map((_, index) => (
                <div key={`sk-${index}`} className="bg-[#f7f7f8] flex items-start relative shrink-0 w-full">
                  <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[205px]">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-[205px] flex items-center pl-4">
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[76px]">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-[76px] flex items-center pl-4">
                      <Skeleton className="h-4 w-10" />
                    </div>
                  </div>
                  <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[96px]">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-[96px] flex items-center pl-4">
                      <Skeleton className="h-4 w-12" />
                    </div>
                  </div>
                  <div className="h-10 overflow-hidden relative shrink-0 w-[77px] flex items-center pl-4">
                    <Skeleton className="h-4 w-10" />
                  </div>
                  <div className="grow h-10 min-h-0 min-w-px overflow-hidden relative shrink-0">
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
              ))
            )}
            {error && !loading && (
              <div className="p-3 text-sm text-red-600">
                {typeof error === 'string' ? error : 'Failed to load API usage'}
              </div>
            )}
            {!loading && !error && data.length === 0 && (
              <div className="flex items-center justify-center p-8 text-sm text-[#9296a0] w-full">
                No data available
              </div>
            )}
            {!loading && !error && data.length > 0 && (showAll ? data : data.slice(0, 5)).map((row, index) => (
              <div key={index} className="bg-[#f7f7f8] flex items-start relative shrink-0 w-full">
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[205px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[205px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {formatApiName(row.api_name)}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[76px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[76px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {row.number_of_transactions}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[96px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[96px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      ₹{row.unit_price.toFixed(2)}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="h-10 overflow-hidden relative shrink-0 w-[77px]">
                  <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                    ₹{row.total_cost.toFixed(2)}
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
                <div className="grow h-10 min-h-0 min-w-px overflow-hidden relative shrink-0">
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ApiUsageTable
