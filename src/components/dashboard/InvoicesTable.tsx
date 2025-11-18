import { motion } from 'framer-motion'
import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import { Skeleton } from '@/components/ui/skeleton'
import { useNavigate } from 'react-router-dom'

const InvoicesTable = () => {
  const navigate = useNavigate()
  const { data: invoices, loading, error } = useRecentInvoices(4)

  const handleSeeAll = () => {
    navigate('/billing')
  }

  // Format date_time from "2025-11-03 15:13:38" to readable format
  const formatDateTime = (dateTime: string): string => {
    if (!dateTime) return '-'
    try {
      // Split date and time
      const parts = dateTime.split(' ')
      if (parts.length !== 2) return dateTime
      
      const [date, time] = parts
      const [year, month, day] = date.split('-')
      
      if (!year || !month || !day || !time) return dateTime
      
      const shortYear = year.substring(2)
      return `${day}/${month}/${shortYear} ${time}`
    } catch (error) {
      console.error('Error formatting date:', error, dateTime)
      return dateTime
    }
  }

  // Format amount to integer with currency symbol
  const formatAmount = (amount: string): string => {
    const numAmount = Math.round(parseFloat(amount))
    return `₹${numAmount}`
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="grow bg-white border border-[#e7e8ea] border-solid min-h-0 min-w-0 relative rounded-2xl shrink-0 max-w-full"
    >
      <div className="flex flex-col gap-6 items-start overflow-hidden p-4 relative rounded-[inherit] w-full">
        <div className="flex items-center justify-between relative w-full">
          <div className="content-center flex flex-wrap gap-2 items-center relative rounded-3 shrink-0 w-[238px]">
            <div className="flex flex-col items-start justify-center relative rounded-3 shrink-0">
              <p className="font-medium leading-[1.4] relative text-[12px] text-[#616675] tracking-[-0.12px] w-full">
                Recent Invoices
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center self-stretch">
            <div className="flex gap-1 h-full items-center justify-center px-2 py-0 relative rounded-lg shrink-0">
              <button
                onClick={handleSeeAll}
                className="font-medium leading-[1.4] relative text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre"
              >
                See All
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-lg w-full">
          <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] w-full overflow-x-auto">
            {/* Table Header */}
            <div className="bg-white flex items-start relative w-full">
              <div className="grow border-r border-b border-[#e7e8ea] border-solid h-10 min-h-0 min-w-0 relative shrink-0">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-full">
                  <p className="absolute bottom-8 font-normal leading-[24px] left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Invoice ID
                  </p>
                  <div className="absolute bg-white bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-r border-b border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[170px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[170px]">
                  <p className="absolute bottom-8 font-normal leading-[24px] left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Date & Time
                  </p>
                  <div className="absolute bg-white bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-r border-b border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[112px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[112px]">
                  <p className="absolute bottom-8 font-normal leading-[24px] left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Status
                  </p>
                  <div className="absolute bg-white bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-b border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[115px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[115px]">
                  <p className="absolute bottom-8 font-normal leading-[24px] left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Amount
                  </p>
                  <div className="absolute bg-white bottom-0 h-px left-0 right-0" />
                </div>
              </div>
            </div>
            
            {/* Table Rows */}
            {loading && (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={`sk-${index}`} className={`flex items-start relative w-full ${index % 2 === 0 ? 'bg-[#f7f7f8]' : 'bg-white'}`}>
                  <div className="grow border-r border-[#e7e8ea] border-solid h-10 min-h-0 min-w-0 relative shrink-0">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-full flex items-center pl-4">
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[170px]">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-[170px] flex items-center pl-4">
                      <Skeleton className="h-4 w-28" />
                    </div>
                  </div>
                  <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[112px]">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-[112px] flex items-center pl-4">
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="h-10 overflow-hidden relative shrink-0 w-[115px] flex items-center pl-4">
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              ))
            )}
            {error && !loading && (
              <div className="p-3 text-sm text-red-600">
                {typeof error === 'string' ? error : 'Failed to load invoices'}
              </div>
            )}
            {!loading && !error && invoices.length === 0 && (
              <div className="flex items-center justify-center p-8 text-sm text-[#9296a0] w-full">
                No data available
              </div>
            )}
            {!loading && !error && invoices.length > 0 && invoices.map((invoice, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                className={`flex items-start relative w-full ${
                  index % 2 === 0 ? 'bg-[#f7f7f8]' : 'bg-white'
                }`}
              >
                <div className="grow border-r border-[#e7e8ea] border-solid h-10 min-h-0 min-w-0 relative shrink-0">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-full">
                    <p className="absolute font-normal leading-[24px] left-4 not-italic right-4 text-[#9296a0] text-[14px] top-2 tracking-[-0.084px]">
                      {invoice.id}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[170px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[170px]">
                    <p className="absolute font-normal leading-[24px] left-4 not-italic right-4 text-[#9296a0] text-[14px] top-2 tracking-[-0.084px] whitespace-pre-wrap">
                      {formatDateTime(invoice.date_time)}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[112px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[112px]">
                    <p className="absolute font-normal leading-[24px] left-4 not-italic right-4 text-[14px] text-[#3ac828] top-2 tracking-[-0.084px]">
                      {invoice.status}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="h-10 overflow-hidden relative shrink-0 w-[115px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[115px]">
                    <p className="absolute font-normal leading-[24px] left-4 not-italic right-4 text-[#9296a0] text-[14px] top-2 tracking-[-0.084px]">
                      {formatAmount(invoice.amount)}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default InvoicesTable
