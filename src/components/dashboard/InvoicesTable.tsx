import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import type { InvoiceItem } from '@/hooks/useRecentInvoices'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TableWithPagination } from '@/components/ui/TableWithPagination'
import type { TableColumn } from '@/components/ui/TableWithPagination'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { Download } from 'lucide-react'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

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

  const columns: TableColumn<InvoiceItem>[] = [
    {
      key: 'id',
      header: 'Invoice ID',
      render: (row) => row.id
    },
    {
      key: 'date_time',
      header: 'Date & Time',
      width: '170px',
      render: (row) => formatDateTime(row.date_time)
    },
    {
      key: 'status',
      header: 'Status',
      width: '112px',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '115px',
      render: (row) => formatAmount(row.amount)
    }
  ]

  if (!isProduction) {
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
              {sandboxInvoices.map((invoice) => (
                <tr key={invoice.id} className="h-[45.28px] border-b border-[#e0e5eb] text-[12px] font-normal last:border-b-0">
                  <td className="px-6 leading-4 text-[#0a121f]">{invoice.id}</td>
                  <td className="px-6 leading-5 text-[#5b6472]">{invoice.date}</td>
                  <td className="px-6 text-right leading-5 text-[#0a121f]">{invoice.amount}</td>
                  <td className="px-6 text-center">
                    <span className="rounded-full bg-[#fff2d0] px-2 pb-[1.78px] pt-[1.5px] text-[12px] font-normal uppercase leading-[14.29px] tracking-[0.5px] text-[#f09c17]">
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
              ))}
            </tbody>
          </table>
        </div>
      </motion.section>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.5 }}
      className="grow bg-white border border-[#e7e8ea] border-solid min-w-0 relative rounded-2xl shrink-0 max-w-full min-h-[280px] h-full"
    >
      <div className="flex flex-col gap-6 items-start overflow-hidden p-4 relative rounded-[inherit] w-full h-full">
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
        <div className="bg-white relative rounded-lg w-full h-full">
          <TableWithPagination
            data={invoices}
            columns={columns}
            loading={loading}
            error={error}
            emptyMessage="No invoices to display"
            itemsPerPage={10}
            className="h-full"
          />
        </div>
      </div>
    </motion.div>
  )
}

export default InvoicesTable
