import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import type { InvoiceItem } from '@/hooks/useRecentInvoices'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { TableWithPagination } from '@/components/ui/TableWithPagination'
import type { TableColumn } from '@/components/ui/TableWithPagination'
import { StatusBadge } from '@/components/ui/StatusBadge'

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
