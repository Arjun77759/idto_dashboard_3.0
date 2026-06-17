import { Skeleton } from '@/components/ui/skeleton'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const sandboxInvoices = [
  { id: 'INV-00012', date: 'May 12, 2026', amount: '\u20b90.00', status: 'Sandbox' },
  { id: 'INV-00011', date: 'Apr 12, 2026', amount: '\u20b90.00', status: 'Sandbox' },
  { id: 'INV-00010', date: 'Mar 12, 2026', amount: '\u20b90.00', status: 'Sandbox' },
]

const InvoicesTable = () => {
  const navigate = useNavigate()
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const { data: invoices, loading, error } = useRecentInvoices(4)

  const handleSeeAll = () => {
    navigate('/billing')
  }

  const formatDateTime = (dateTime: string): string => {
    if (!dateTime) return '-'
    try {
      const normalized = dateTime.includes('T') ? dateTime : dateTime.replace(' ', 'T')
      const date = new Date(normalized)
      if (Number.isNaN(date.getTime())) return dateTime
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    } catch (error) {
      console.error('Error formatting date:', error, dateTime)
      return dateTime
    }
  }

  const formatAmount = (amount: string): string => {
    const numAmount = Number.parseFloat(amount)
    if (!Number.isFinite(numAmount)) return '\u20b90.00'
    return `\u20b9${numAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const rows = isProduction
    ? invoices.slice(0, 3).map((invoice) => ({
        id: invoice.id,
        date: formatDateTime(invoice.date_time),
        amount: formatAmount(invoice.amount),
        status: invoice.status,
      }))
    : sandboxInvoices

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="w-full overflow-hidden rounded-[22px] border border-[#e0e5eb] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
    >
      <div className="flex h-[65px] items-center justify-between border-b border-[#e0e5eb] px-6">
        <h2 className="text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#0a121f]">Invoices</h2>
        <button
          onClick={handleSeeAll}
          className="h-8 rounded-[12px] border border-[#e3e8ef] bg-[#f9fcff] px-[13px] text-[12px] font-normal leading-4 text-[#0a121f] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
        >
          View all
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left">
          <thead>
            <tr className="h-10 border-b border-[#e0e5eb] text-[12px] font-normal uppercase leading-4 tracking-[0.6px] text-[#5b6472]">
              <th className="px-6">Invoice</th>
              <th className="px-6">Date</th>
              <th className="px-6 text-right">Amount</th>
              <th className="px-6 text-center">Status</th>
              <th className="px-6 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {isProduction && loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="h-[45.28px] border-b border-[#e0e5eb] last:border-b-0">
                  <td className="px-6"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-6"><Skeleton className="ml-auto h-4 w-20" /></td>
                  <td className="px-6"><Skeleton className="mx-auto h-5 w-20 rounded-full" /></td>
                  <td className="px-6"><Skeleton className="ml-auto h-4 w-10" /></td>
                </tr>
              ))
            ) : isProduction && error ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-[12px] text-red-600">
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-[12px] text-[#5b6472]">
                  No invoices to display
                </td>
              </tr>
            ) : (
              rows.map((invoice) => (
                <tr key={invoice.id} className="h-[45.28px] border-b border-[#e0e5eb] text-[12px] font-normal last:border-b-0">
                  <td className="px-6 leading-4 text-[#0a121f]">{invoice.id}</td>
                  <td className="px-6 leading-5 text-[#5b6472]">{invoice.date}</td>
                  <td className="px-6 text-right leading-5 text-[#0a121f]">{invoice.amount}</td>
                  <td className="px-6 text-center">
                    <span className={`rounded-full px-2 pb-[1.78px] pt-[1.5px] text-[12px] font-normal uppercase leading-[14.29px] tracking-[0.5px] ${isProduction ? 'bg-[#e1faec] text-[#008f5a]' : 'bg-[#fff2d0] text-[#f09c17]'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 text-right">
                    <button className="inline-flex items-center gap-1 text-[12px] font-normal leading-4 text-[#5b6472]">
                      <Download className="size-3.5" />
                      PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </motion.section>
  )
}

export default InvoicesTable
