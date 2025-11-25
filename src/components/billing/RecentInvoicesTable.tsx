import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useInvoiceDownload } from '@/hooks/useInvoiceDownload'
import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import type { InvoiceItem } from '@/hooks/useRecentInvoices'
import { downloadCsv } from '@/lib/downloadCsv'
import { motion } from 'framer-motion'
import { Calendar, Download, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { TableWithPagination } from '@/components/ui/TableWithPagination'
import type { TableColumn } from '@/components/ui/TableWithPagination'

const RecentInvoicesTable = () => {
  const { data: invoiceData, loading, error } = useRecentInvoices(50)
  const { downloadInvoice } = useInvoiceDownload()
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<'all' | 'Paid' | 'Unpaid' | 'Pending'>('all')
  const [amountMin, setAmountMin] = useState('')
  const [amountMax, setAmountMax] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [downloadingInvoiceId, setDownloadingInvoiceId] = useState<string | null>(null)

  const resetFilters = () => {
    setSearch('')
    setStatus('all')
    setAmountMin('')
    setAmountMax('')
    setDateFrom('')
    setDateTo('')
  }

  const filtered = useMemo<InvoiceItem[]>(() => {
    const normAmount = (amountStr: string | undefined) => {
      if (!amountStr) return 0
      const n = amountStr.replace(/[^0-9.]/g, '')
      return parseFloat(n || '0')
    }
    const parseDate = (str: string | undefined) => {
      if (!str) return null
      const d = Date.parse(str.replace(/\s+/g, ' '))
      return isNaN(d) ? null : new Date(d)
    }
    return (invoiceData || []).filter((inv) => {
      if (search && !inv.id.toLowerCase().includes(search.toLowerCase())) return false
      if (status !== 'all' && inv.status !== status) return false
      const amt = normAmount(inv.amount)
      if (amountMin && amt < parseFloat(amountMin)) return false
      if (amountMax && amt > parseFloat(amountMax)) return false
      const d = parseDate(inv.date_time)
      if (d) {
        if (dateFrom) {
          const from = new Date(dateFrom)
          if (d < from) return false
        }
        if (dateTo) {
          const to = new Date(dateTo)
          to.setHours(23, 59, 59, 999)
          if (d > to) return false
        }
      }
      return true
    })
  }, [invoiceData, search, status, amountMin, amountMax, dateFrom, dateTo])

  const formatDateTime = (dateTime: string | undefined) => {
    if (!dateTime) return '-'
    const [date, time] = dateTime.split(' ')
    const [year, month, day] = date?.split('-') || []
    if (!date || !time || !year || !month || !day) return dateTime
    const shortYear = year.substring(2)
    return `${day}/${month}/${shortYear} ${time}`
  }

  const handleExportCSV = () => {
    const headers = ['Invoice ID', 'Date & Time', 'Status', 'Amount']
    const rows = filtered.map((invoice) => [
      invoice.id,
      formatDateTime(invoice.date_time),
      invoice.status,
      invoice.amount ? Math.round(parseFloat(invoice.amount)) : 0
    ])

    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    downloadCsv({ headers, rows, filename: `Billing_${formattedDate}` })
  }

  // Extract year and month from invoice date_time
  const extractYearMonth = (dateTime: string | undefined): { year: number; month: number } | null => {
    if (!dateTime) return null
    try {
      const [date] = dateTime.split(' ')
      const [year, month] = date.split('-')
      if (year && month) {
        return { year: parseInt(year), month: parseInt(month) }
      }
    } catch (error) {
      console.error('Error parsing date:', error)
    }
    return null
  }

  const handleDownloadInvoice = async (invoice: InvoiceItem) => {
    const yearMonth = extractYearMonth(invoice.date_time)
    if (!yearMonth) {
      console.error('Unable to extract year/month from invoice date')
      return
    }

    setDownloadingInvoiceId(invoice.id)
    try {
      await downloadInvoice(yearMonth.year, yearMonth.month)
    } catch (error) {
      console.error('Error downloading invoice:', error)
    } finally {
      setDownloadingInvoiceId(null)
    }
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
      width: '265px',
      render: (row) => formatDateTime(row.date_time)
    },
    {
      key: 'status',
      header: 'Status',
      width: '171px',
      render: (row) => <span style={{ color: '#3ac828' }}>{row.status}</span>
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '208px',
      render: (row) => (row.amount ? `₹${Math.round(parseFloat(row.amount))}` : '₹0')
    },
    {
      key: 'action',
      header: 'Action',
      width: '120px',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleDownloadInvoice(row)
            }}
            disabled={downloadingInvoiceId === row.id}
            className="flex items-center justify-center gap-1 px-2 py-1 rounded hover:bg-[#e6e8ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Download Invoice"
          >
            <Download className={`size-4 ${downloadingInvoiceId === row.id ? 'text-[#9296a0]' : 'text-[#0019ff]'}`} />
            {downloadingInvoiceId === row.id && (
              <span className="text-[10px] text-[#9296a0]">...</span>
            )}
          </button>
        </div>
      )
    }
  ]


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="bg-white border border-[#e7e8ea] border-solid grow min-h-0 min-w-px relative rounded-2xl shrink-0 w-full"
    >
      <div className="flex flex-col gap-4 sm:gap-6 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] w-full">
        <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
          Recent Invoices
        </p>

        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-0 relative rounded shrink-0 w-full">
          <div className="flex flex-row items-center self-stretch w-full sm:w-auto">
            <div className="bg-white border border-[#e7e8ea] border-solid flex h-full items-center justify-between pl-3 pr-2 py-2 relative rounded-lg shrink-0 w-full sm:w-[500px]">
              <div className="flex gap-2 items-center relative shrink-0 w-full">
                <Search className="size-4 text-[#9296a0]" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by invoice id" className="h-7 border-0 focus-visible:ring-0 text-[12px] px-0" />
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center relative shrink-0 w-full sm:w-auto">
            <Button
              onClick={handleExportCSV}
              className="flex justify-center items-center gap-2 border-0"
              style={{
                padding: "14px 8px",
                borderRadius: "8px",
                background: "var(--Primary-0, #E6E8FF)",
              }}
            >
              <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre text-[#0019ff]">
                Export CSV
              </p>
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M13.667 11.862L11.1956 14.3334L10.2528 13.3906L11.1147 12.5287L7.39085 12.5287L7.39085 11.1954L11.1147 11.1954L10.2528 10.3334L11.1956 9.39062L13.667 11.862Z" fill="#0019FF" />
                <path d="M12.3333 0.651515C12.3333 0.291693 12.0427 0 11.6842 0H4.92411L0 4.94226V13.6818C0 14.0416 0.290623 14.3333 0.649123 14.3333H5.84204V13.0303H1.29818V5.86367H5.84204L5.84204 1.30306H11.035V7.83336H12.3333V0.651515Z" fill="#0019FF" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 h-auto sm:h-10 items-center justify-between relative shrink-0 w-full">
          <div className="flex flex-wrap gap-2 h-full items-center min-h-0 min-w-px relative shrink-0">
            <div className="bg-white border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-2 relative rounded-[inherit]">
                <Calendar className="size-4 text-[#9296a0]" />
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-7 w-[140px] text-[12px]" />
                <span className="text-[#9296a0] text-[12px]">-</span>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-7 w-[140px] text-[12px]" />
              </div>
            </div>
            <div className="bg-white border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-2 relative rounded-[inherit] w-[180px]">
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger className="h-7 text-[12px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="Paid">Paid</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Unpaid">Unpaid</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="bg-white border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-2 relative rounded-[inherit]">
                <span className="text-[12px] text-[#9296a0]">Amount</span>
                <Input placeholder="Min" value={amountMin} onChange={(e) => setAmountMin(e.target.value)} className="h-7 w-20 text-[12px]" />
                <Input placeholder="Max" value={amountMax} onChange={(e) => setAmountMax(e.target.value)} className="h-7 w-20 text-[12px]" />
              </div>
            </div>
          </div>
          <div className="border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0">
            <div className="flex gap-1 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
              <button onClick={resetFilters} className="flex items-center gap-1">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Reset
                </p>
                <RotateCcw className="size-4 text-[#9296a0]" />
              </button>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <TableWithPagination
          data={filtered}
          columns={columns}
          loading={loading}
          error={error}
          emptyMessage="No invoices found"
          itemsPerPage={10}
        />
      </div>
    </motion.div>
  )
}

export default RecentInvoicesTable
