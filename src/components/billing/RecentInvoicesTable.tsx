import { motion } from 'framer-motion'
import { Search, FileSpreadsheet, Download, Calendar, RotateCcw } from 'lucide-react'
import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import { Skeleton } from '@/components/ui/skeleton'
import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { downloadCsv } from '@/lib/downloadCsv'
import { useInvoiceDownload } from '@/hooks/useInvoiceDownload'

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

  const filtered = useMemo(() => {
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

  const handleDownloadInvoice = async (invoice: { id: string; date_time?: string }) => {
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
            <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0 flex-1 sm:flex-none">
              <button
                onClick={handleExportCSV}
                className="flex gap-2 items-center justify-center overflow-hidden px-3 py-3.5 relative rounded-[inherit] w-full"
              >
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Export CSV
                </p>
                <FileSpreadsheet className="size-4 text-[#0019ff]" />
              </button>
            </div>
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
        <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-md shrink-0 w-full overflow-x-auto">
          <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] w-full min-w-[920px]">
            {/* Table Header */}
            <div className="bg-white flex items-start relative shrink-0 w-full">
              <div className="h-10 overflow-hidden relative shrink-0 w-12">
                <div className="absolute bg-[#f7f7f8] border border-[#131b31] border-solid left-1/2 rounded top-3 size-4 translate-x-[-50%]" />
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
              <div className="grow h-10 min-h-0 min-w-px relative shrink-0">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-full">
                  <p className="absolute bottom-8 font-normal leading-6 left-0 not-italic right-0 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Invoice ID
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[265px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[265px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Date & Time
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[171px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[171px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Status
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[208px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[208px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Amount
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="h-10 overflow-hidden relative shrink-0 w-[120px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[120px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Action
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
            </div>

            {/* Table Rows */}
            {loading && (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={`sk-${index}`} className="flex items-start relative shrink-0 w-full">
                  <div className="h-10 overflow-hidden relative shrink-0 w-12">
                    <div className="absolute bg-[#f7f7f8] border border-[#9296a0] border-solid left-1/2 rounded top-3 size-4 translate-x-[-50%]" />
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                  <div className="grow h-10 min-h-0 min-w-px relative shrink-0">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-full flex items-center pl-0">
                      <Skeleton className="h-4 w-40" />
                    </div>
                  </div>
                  <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[265px]">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-[265px] flex items-center pl-4">
                      <Skeleton className="h-4 w-44" />
                    </div>
                  </div>
                  <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[171px]">
                    <div className="h-10 overflow-hidden relative rounded-[inherit] w-[171px] flex items-center pl-4">
                      <Skeleton className="h-4 w-16" />
                    </div>
                  </div>
                  <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[208px] flex items-center pl-4">
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="h-10 overflow-hidden relative shrink-0 w-[120px] flex items-center pl-4">
                    <Skeleton className="h-4 w-12" />
                  </div>
                </div>
              ))
            )}
            {error && !loading ? (
              <div className="p-3 text-sm text-red-600">{error}</div>
            ) : null}
            {!loading && filtered.map((invoice, index) => (
              <div key={index} className="flex items-start relative shrink-0 w-full">
                <div className="h-10 overflow-hidden relative shrink-0 w-12">
                  <div className="absolute bg-[#f7f7f8] border border-[#9296a0] border-solid left-1/2 rounded top-3 size-4 translate-x-[-50%]" />
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
                <div className="grow h-10 min-h-0 min-w-px relative shrink-0">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-full">
                    <p className="absolute font-normal leading-6 left-0 not-italic right-0 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {invoice.id}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[265px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[265px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px] whitespace-pre-wrap">
                      {formatDateTime(invoice.date_time)}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[171px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[171px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#3ac828] top-2 tracking-[-0.084px]">
                      {invoice.status}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[208px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[208px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {invoice.amount ? `₹${Math.round(parseFloat(invoice.amount))}` : '₹0'}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="h-10 overflow-hidden relative shrink-0 w-[120px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[120px] flex items-center justify-center">
                    <button
                      onClick={() => handleDownloadInvoice(invoice)}
                      disabled={downloadingInvoiceId === invoice.id}
                      className="flex items-center justify-center gap-1 px-2 py-1 rounded hover:bg-[#e6e8ff] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Download Invoice"
                    >
                      <Download className={`size-4 ${downloadingInvoiceId === invoice.id ? 'text-[#9296a0]' : 'text-[#0019ff]'}`} />
                      {downloadingInvoiceId === invoice.id && (
                        <span className="text-[10px] text-[#9296a0]">...</span>
                      )}
                    </button>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default RecentInvoicesTable
