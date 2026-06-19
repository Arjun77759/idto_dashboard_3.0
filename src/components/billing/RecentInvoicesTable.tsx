import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useInvoiceDownload } from '@/hooks/useInvoiceDownload'
import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import type { InvoiceItem } from '@/hooks/useRecentInvoices'
import { downloadCsv } from '@/lib/downloadCsv'
import { motion } from 'framer-motion'
import { Download, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '../ui/button'
import { TableWithPagination } from '@/components/ui/TableWithPagination'
import type { TableColumn } from '@/components/ui/TableWithPagination'
import { StatusBadge } from '@/components/ui/StatusBadge'

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
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '208px',
      render: (row) => (row.amount ? `Rs. ${Math.round(parseFloat(row.amount))}` : 'Rs. 0')
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
      className="relative w-full shrink-0 grow rounded-[22px] border border-[#e5e5e5]/80 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]"
    >
      <div className="relative flex w-full flex-col items-start gap-3 overflow-hidden rounded-[inherit] p-[25px]">
        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[14px] font-semibold leading-[21px] text-[#171717]">Recent invoices</p>
            <p className="text-[12px] leading-[17.25px] text-[#737373]">
              Download and search your billing history
            </p>
          </div>
          <Button
            onClick={handleExportCSV}
            variant="outline"
            className="h-9 rounded-[10px] border-[#e2e8f0] bg-white px-3 text-[12px] font-medium text-[#171717] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
          >
            <Download className="size-4" />
            Export CSV
          </Button>
        </div>

        {/* Search and Action Bar */}
        <div className="flex w-full flex-col gap-2 rounded p-0 sm:flex-row sm:items-center">
          <div className="flex min-w-[220px] flex-1 flex-row items-center self-stretch">
            <div className="relative flex h-9 w-full shrink-0 items-center justify-between rounded-[10px] border border-[#e5e5e5] bg-white py-2 pl-3 pr-2 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
              <div className="flex gap-2 items-center relative shrink-0 w-full">
                <Search className="size-4 text-[#9296a0]" />
                <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by invoice ID" className="h-7 border-0 px-0 text-[12px] focus-visible:ring-0" />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative h-9 shrink-0 rounded-[10px] bg-white">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden pr-2 py-2 relative rounded-[inherit]">
                {/* <Calendar className="size-4 text-[#9296a0]" /> */}
                <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="h-9 w-[140px] rounded-[10px] border-[#e5e5e5] text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]" />
                <span className="text-[#9296a0] text-[12px]">-</span>
                <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="h-9 w-[140px] rounded-[10px] border-[#e5e5e5] text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]" />
              </div>
            </div>
            <div className="relative h-9 shrink-0 rounded-[10px] bg-white">
              <div className="relative flex h-full w-[60px] items-center justify-center overflow-hidden rounded-[inherit]">
                <Select value={status} onValueChange={(v) => setStatus(v as any)}>
                  <SelectTrigger className="h-9 rounded-[10px] border-[#e5e5e5] text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
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
            <div className="relative h-9 shrink-0 rounded-[10px] bg-white">
              <div className="relative flex h-full items-center justify-center gap-2 overflow-hidden rounded-[inherit]">
                <Input placeholder="Min" value={amountMin} onChange={(e) => setAmountMin(e.target.value)} className="h-9 w-[60px] rounded-[10px] border-[#e5e5e5] text-center text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]" />
                <Input placeholder="Max" value={amountMax} onChange={(e) => setAmountMax(e.target.value)} className="h-9 w-[60px] rounded-[10px] border-[#e5e5e5] text-center text-[12px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]" />
              </div>
            </div>
            <button onClick={resetFilters} className="flex h-9 items-center gap-1 rounded-[10px] px-3 text-[12px] font-medium text-[#737373] hover:bg-[#f7f7f8]">
              <RotateCcw className="size-4" />
              Reset
            </button>
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

