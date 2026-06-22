import { Skeleton } from '@/components/ui/skeleton'
import { useInvoiceDownload } from '@/hooks/useInvoiceDownload'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import type { InvoiceItem } from '@/hooks/useRecentInvoices'
import { motion } from 'framer-motion'
import { Download } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const InvoicesTable = () => {
  const navigate = useNavigate()
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const { data: invoices, loading, error } = useRecentInvoices(4)
  const { downloadInvoice } = useInvoiceDownload()
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null)

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

  const extractYearMonth = (dateTime: string | undefined): { year: number; month: number } | null => {
    if (!dateTime) return null
    try {
      const [date] = dateTime.split(' ')
      const [year, month] = date.split('-')
      if (year && month) {
        return { year: Number.parseInt(year, 10), month: Number.parseInt(month, 10) }
      }
    } catch (error) {
      console.error('Error parsing invoice date:', error)
    }
    return null
  }

  const handleDownloadInvoice = async (invoice: InvoiceItem) => {
    const yearMonth = extractYearMonth(invoice.date_time)
    if (!yearMonth) return

    setDownloadingInvoiceId(invoice.id)
    try {
      await downloadInvoice(yearMonth.year, yearMonth.month)
    } finally {
      setDownloadingInvoiceId(null)
    }
  }

  const rows = invoices.slice(0, 3).map((invoice) => ({
        source: invoice,
        id: invoice.id,
        date: formatDateTime(invoice.date_time),
        amount: formatAmount(invoice.amount),
        status: invoice.status,
      }))

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="w-full overflow-hidden rounded-[22px] border border-[#e1e5ea] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
    >
      <div className="flex h-[65px] items-center justify-between border-b border-[#dfe5ed] px-6">
        <h2 className="text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#091123]">Invoices</h2>
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
            <tr className="h-10 border-b border-[#dfe5ed] text-[12px] font-normal uppercase leading-4 tracking-[0.6px] text-[#5e6a7a]">
              <th className="px-6">Invoice</th>
              <th className="px-6">Date</th>
              <th className="px-6 text-right">Amount</th>
              <th className="px-6 text-center">Status</th>
              <th className="px-6 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <tr key={index} className="h-[45.28px] border-b border-[#dfe5ed] last:border-b-0">
                  <td className="px-6"><Skeleton className="h-4 w-24" /></td>
                  <td className="px-6"><Skeleton className="h-4 w-28" /></td>
                  <td className="px-6"><Skeleton className="ml-auto h-4 w-20" /></td>
                  <td className="px-6"><Skeleton className="mx-auto h-5 w-20 rounded-full" /></td>
                  <td className="px-6"><Skeleton className="ml-auto h-4 w-10" /></td>
                </tr>
              ))
            ) : error ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-[12px] text-red-600">
                  {error}
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-[12px] text-[#5e6a7a]">
                  No invoices to display
                </td>
              </tr>
            ) : (
              rows.map((invoice) => (
                <tr key={invoice.id} className="h-[45.28px] border-b border-[#dfe5ed] text-[12px] font-normal last:border-b-0">
                  <td className="px-6 leading-4 text-[#091123]">{invoice.id}</td>
                  <td className="px-6 leading-5 text-[#5e6a7a]">{invoice.date}</td>
                  <td className="px-6 text-right leading-5 text-[#091123]">{invoice.amount}</td>
                  <td className="px-6 text-center">
                    <span className={`rounded-full px-2 pb-[1.78px] pt-[1.5px] text-[12px] font-normal uppercase leading-[14.29px] tracking-[0.5px] ${isProduction ? 'bg-[#ddfcef] text-[#007a55]' : 'bg-[#fff2d0] text-[#f09c17]'}`}>
                      {invoice.status}
                    </span>
                  </td>
                  <td className="px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleDownloadInvoice(invoice.source)}
                      disabled={downloadingInvoiceId === invoice.id}
                      className="inline-flex items-center gap-1 text-[12px] font-normal leading-4 text-[#5e6a7a] transition-colors hover:text-[#0019ff] disabled:cursor-not-allowed disabled:opacity-50"
                      title="Download invoice PDF"
                    >
                      <Download className="size-3.5" />
                      {downloadingInvoiceId === invoice.id ? '...' : 'PDF'}
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
