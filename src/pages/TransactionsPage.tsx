import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import TransactionsPageHeader from '@/components/transactions/TransactionsPageHeader'
import TransactionsStatsGrid from '@/components/transactions/TransactionsStatsGrid'
import TransactionsFilters from '@/components/transactions/TransactionsFilters'
import TransactionsTable from '@/components/transactions/TransactionsTable'
import { type Transaction, useTransactions } from '@/hooks/useTransactions'
import { parseTransactionTimestamp, formatTransactionTimestampIST } from '@/lib/utils'
import { format, isWithinInterval, parse } from 'date-fns'
import { downloadCsv } from '@/lib/downloadCsv'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { sandboxTransactions } from '@/mocks/sandboxTransactions'
import overviewFailedIcon from '@/assets/figma/transactions/overview-failed.svg'
import overviewLatencyIcon from '@/assets/figma/transactions/overview-latency.svg'
import overviewSuccessIcon from '@/assets/figma/transactions/overview-success.svg'
import overviewTotalIcon from '@/assets/figma/transactions/overview-total.svg'
import figmaCalendarIcon from '@/assets/figma/transactions/page/calendar.svg'
import figmaCopyIcon from '@/assets/figma/transactions/page/copy.svg'
import figmaExportIcon from '@/assets/figma/transactions/page/export.svg'
import figmaNextIcon from '@/assets/figma/transactions/page/next.svg'
import figmaPrevIcon from '@/assets/figma/transactions/page/prev.svg'
import figmaResetIcon from '@/assets/figma/transactions/page/reset.svg'
import figmaSandboxBannerIcon from '@/assets/figma/transactions/page/sandbox-banner.svg'
import figmaViewIcon from '@/assets/figma/transactions/page/view.svg'
import type { DateRange } from 'react-day-picker'

type SandboxTransactionRow = Transaction & {
  product: string
  displayId: string
  date: string
  time: string
  latency: string
  cost: string
}

const productNames: Record<string, string> = {
  aadhar_to_pan: 'Aadhaar -> PAN',
  bank_account_verification: 'Bank Verification',
  employment_history: 'Employment History',
  face_match: 'Face Match',
  pan_detailed: 'PAN Detailed',
  vehicle_rc_plus: 'Vehicle RC Plus',
  voter_verification: 'Voter Verification',
  vpa_verification: 'VPA Verification',
}

const sandboxRowOverrides = [
  { displayId: '3b4bed48...253f', product: 'Aadhaar -> PAN', date: '13 Jun 2026', time: '08:21 PM', latency: '-', cost: '₹0.00', status: 'failed' },
  { displayId: '9874ac22...87bc', product: 'Bank Verification', date: '13 Jun 2026', time: '12:11 PM', latency: '421 ms', cost: '₹1.80', status: 'success' },
  { displayId: '826cb772...22a1', product: 'PAN Detailed', date: '13 Jun 2026', time: '12:08 PM', latency: '317 ms', cost: '₹0.60', status: 'success' },
  { displayId: '99fbe76c...ff70', product: 'Mobile Profile Advance', date: '13 Jun 2026', time: '12:07 PM', latency: '402 ms', cost: '₹1.10', status: 'success' },
  { displayId: '604c975a...c6ea', product: 'Mobile Profile Advance', date: '13 Jun 2026', time: '12:06 PM', latency: '388 ms', cost: '₹1.10', status: 'success' },
  { displayId: '472b6832...6636', product: 'IFSC Verification', date: '12 Jun 2026', time: '02:42 PM', latency: '210 ms', cost: '₹0.40', status: 'success' },
  { displayId: '1ca02fc3...f5a2', product: 'Bank Verification', date: '12 Jun 2026', time: '02:42 PM', latency: '612 ms', cost: '₹1.80', status: 'success' },
  { displayId: 'f3cd2319...a9fc', product: 'PAN Detailed', date: '12 Jun 2026', time: '02:40 PM', latency: '275 ms', cost: '₹1.20', status: 'success' },
  { displayId: '6e183507...2cb6', product: 'PAN Verification', date: '12 Jun 2026', time: '02:39 PM', latency: '241 ms', cost: '₹0.85', status: 'success' },
  { displayId: '1fba9270...4dd1', product: 'Voter Verification', date: '12 Jun 2026', time: '11:14 AM', latency: '-', cost: '₹0.00', status: 'failed' },
]

const buildSandboxRows = (transactions: Transaction[]): SandboxTransactionRow[] => {
  const source = transactions.length ? transactions : sandboxTransactions

  return Array.from({ length: 29 }, (_, index) => {
    const base = source[index % source.length]
    const override = sandboxRowOverrides[index % sandboxRowOverrides.length]

    return {
      ...base,
      trax_id: `${base.trax_id}-${index + 1}`,
      status: override.status,
      product: override.product || productNames[base.api_name] || base.api_name,
      displayId: override.displayId,
      date: override.date,
      time: override.time,
      latency: override.latency,
      cost: override.cost,
    }
  })
}

const SandboxStatus = ({ status }: { status: string }) => {
  const isSuccess = status.toLowerCase() === 'success'

  return (
    <span className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-[12px] font-medium ${isSuccess ? 'bg-[#e9fbe8] text-[#128a2e]' : 'bg-[#feecec] text-[#c62020]'}`}>
      <span className={`size-1.5 rounded-full ${isSuccess ? 'bg-[#22c55e]' : 'bg-[#ef4444]'}`} />
      {isSuccess ? 'Success' : 'Failed'}
    </span>
  )
}

const StatCard = ({
  icon,
  value,
  label,
  delta,
  tone = 'positive',
  iconBg = '#e4f2ff',
}: {
  icon: ReactNode
  value: string
  label: string
  delta: string
  tone?: 'positive' | 'negative'
  iconBg?: string
}) => (
  <div className="h-[152px] rounded-[22px] border border-[#e3e8ef] bg-white p-[21px] shadow-[0_1px_1px_rgba(11,22,40,0.04),0_1px_1.5px_rgba(11,22,40,0.03)]">
    <div className="flex items-start justify-between">
      <div className="grid size-9 place-items-center rounded-[18px]" style={{ backgroundColor: iconBg }}>
        {icon}
      </div>
      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold leading-[15px] ${tone === 'positive' ? 'bg-[#c7fad7] text-[#004313]' : 'bg-[#e4f2ff] text-[#2760f5]'}`}>
        {delta}
      </span>
    </div>
    <p className="mt-[18px] text-[30px] font-bold leading-7 tracking-[-0.7px] text-[#071123]">{value}</p>
    <p className="mt-[14px] text-[14px] font-normal leading-4 text-[#596475]">{label}</p>
  </div>
)

const SandboxTransactionsPage = () => {
  const navigate = useNavigate()
  const { data: transactions } = useTransactions()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [statusFilter, setStatusFilter] = useState('all')
  const [productFilter, setProductFilter] = useState('all')
  const [page, setPage] = useState(1)

  const sandboxRows = useMemo(() => buildSandboxRows(transactions), [transactions])
  const products = useMemo(() => Array.from(new Set(sandboxRows.map((row) => row.product))), [sandboxRows])

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase()

    return sandboxRows.filter((row) => {
      const matchesSearch = normalizedSearch
        ? [row.displayId, row.product, row.status, row.date, row.time].join(' ').toLowerCase().includes(normalizedSearch)
        : true
      const rowDate = parse(`${row.date} ${row.time}`, 'd MMM yyyy hh:mm a', new Date())
      const matchesDate = dateRange?.from && dateRange?.to && !Number.isNaN(rowDate.getTime())
        ? isWithinInterval(rowDate, {
            start: dateRange.from,
            end: new Date(
              dateRange.to.getFullYear(),
              dateRange.to.getMonth(),
              dateRange.to.getDate(),
              23,
              59,
              59,
              999
            ),
          })
        : true
      const matchesStatus = statusFilter === 'all' || row.status === statusFilter
      const matchesProduct = productFilter === 'all' || row.product === productFilter

      return matchesSearch && matchesDate && matchesStatus && matchesProduct
    })
  }, [dateRange, productFilter, sandboxRows, searchQuery, statusFilter])

  const dateRangeLabel = dateRange?.from
    ? dateRange.to
      ? `${format(dateRange.from, 'MMM d, yyyy')} - ${format(dateRange.to, 'MMM d, yyyy')}`
      : format(dateRange.from, 'MMM d, yyyy')
    : 'Pick a date range'

  const rowsPerPage = 10
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const visibleRows = filteredRows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const resetFilters = () => {
    setSearchQuery('')
    setDateRange(undefined)
    setStatusFilter('all')
    setProductFilter('all')
    setPage(1)
  }

  const exportRows = () => {
    downloadCsv({
      headers: ['Transaction', 'Product', 'Date', 'Time', 'Latency', 'Cost', 'Status'],
      rows: filteredRows.map((row) => [row.displayId, row.product, row.date, row.time, row.latency, row.cost, row.status]),
      filename: 'Sandbox_Transactions',
    })
  }

  const handleMoveToProduction = () => {
    window.dispatchEvent(new CustomEvent('idto:open-switch-to-production'))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="mx-auto flex w-full max-w-[1090px] flex-col gap-8"
    >
      <div className="flex min-h-[74px] items-center justify-between rounded-[18px] border border-[rgba(0,25,255,0.1)] bg-gradient-to-r from-[rgba(0,25,255,0.03)] to-[rgba(0,229,158,0.063)] px-[21px] py-[17px]">
        <div className="flex items-center gap-3">
          <div className="grid size-9 place-items-center rounded-[12px] bg-[#e8f3ff]">
            <img src={figmaSandboxBannerIcon} alt="" className="size-4" />
          </div>
          <div>
            <p className="text-[14px] font-bold leading-[21px] text-[#0a121f]">You're in Sandbox Mode</p>
            <p className="text-[12px] leading-5 text-[#5a6472]">Follow the setup guide to start building with dummy data - switch to production any time.</p>
          </div>
        </div>
        <Button
          onClick={handleMoveToProduction}
          className="h-8 rounded-[14px] bg-[#2031c2] px-4 text-[12px] font-bold text-white hover:bg-[#1b2ba8]"
        >
          Move to production
        </Button>
      </div>

      <h1 className="text-[34px] font-semibold leading-[44px] tracking-[-0.68px] text-[#0a121f]">Transactions</h1>

      <section className="flex flex-col gap-3">
        <p className="text-[12px] font-bold uppercase leading-[16.5px] tracking-[0.55px] text-[#5a6472]">Overview</p>
        <div className="grid grid-cols-4 gap-4">
          <StatCard icon={<img src={overviewTotalIcon} alt="" className="size-4" />} value="29" label="Total transactions" delta="+12.4%" iconBg="#e4f2ff" />
          <StatCard icon={<img src={overviewSuccessIcon} alt="" className="size-4" />} value="79%" label="Success rate" delta="+0.3%" iconBg="#c7fad7" />
          <StatCard icon={<img src={overviewLatencyIcon} alt="" className="size-4" />} value="412 ms" label="Avg. latency" delta="-18 ms" tone="negative" iconBg="#c9faf7" />
          <StatCard icon={<img src={overviewFailedIcon} alt="" className="size-4" />} value="6" label="Failed" delta="-2" tone="negative" iconBg="#ffdfdc" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[12px] font-bold uppercase leading-[16.5px] tracking-[0.55px] text-[#5a6472]">Transactions Log</p>
        <div className="overflow-hidden rounded-[18px] border border-[#e7e8ea] bg-white shadow-[0_1px_3px_rgba(14,22,36,0.05),0_1px_2px_-1px_rgba(14,22,36,0.04)]">
          <div className="border-b border-[#e7e8ea] px-5 py-5">
            <div className="flex h-10 items-center gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#9aa0ab]" />
                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setPage(1)
                  }}
                  className="h-10 rounded-[10px] border-[#e1e5eb] pl-[41px] text-[12px] placeholder:text-[#9296a0]"
                  placeholder="Search by transaction ID, product, status..."
                />
              </div>
              <Button onClick={exportRows} className="h-10 rounded-[10px] bg-[#e6e8ff] px-4 text-[12px] font-medium text-[#0019ff] hover:bg-[#dde1ff]">
                <img src={figmaExportIcon} alt="" className="mr-2 size-4" />
                Export CSV
              </Button>
            </div>
            <div className="mt-4 flex h-9 items-center gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-9 rounded-[10px] border-[#e1e5eb] px-3 text-[12px] font-medium text-[#5a6472]">
                    <img src={figmaCalendarIcon} alt="" className="mr-2 size-3.5" />
                    {dateRangeLabel}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-0">
                  <Calendar
                    mode="range"
                    selected={dateRange}
                    onSelect={(range) => {
                      setDateRange(range)
                      setPage(1)
                    }}
                    numberOfMonths={2}
                    defaultMonth={dateRange?.from ?? new Date(2026, 5, 1)}
                  />
                </PopoverContent>
              </Popover>
              <select
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value)
                  setPage(1)
                }}
                className="h-9 rounded-[10px] border border-[#e1e5eb] bg-white px-3 text-[12px] font-medium text-[#5a6472] outline-none"
              >
                <option value="all">Status: All</option>
                <option value="success">Status: Success</option>
                <option value="failed">Status: Failed</option>
              </select>
              <select
                value={productFilter}
                onChange={(event) => {
                  setProductFilter(event.target.value)
                  setPage(1)
                }}
                className="h-9 rounded-[10px] border border-[#e1e5eb] bg-white px-3 text-[12px] font-medium text-[#5a6472] outline-none"
              >
                <option value="all">Product: All</option>
                {products.map((product) => (
                  <option key={product} value={product}>{`Product: ${product}`}</option>
                ))}
              </select>
              <div className="ml-auto flex items-center gap-3">
                <span className="text-[12px] leading-4 text-[#5a6472]">{`${visibleRows.length} of ${filteredRows.length} results`}</span>
                <Button onClick={resetFilters} variant="outline" className="h-9 rounded-[10px] border-[#e1e5eb] px-3 text-[12px] font-medium text-[#5a6472]">
                  <img src={figmaResetIcon} alt="" className="mr-2 size-3.5" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

          <table className="w-full table-fixed border-collapse">
            <thead>
              <tr className="h-[45px] border-b border-[#e7e8ea] text-left">
                <th className="w-[43px] px-5"><input type="checkbox" className="size-4 rounded border-[#d2d7df]" /></th>
                <th className="w-[210px] px-2 text-[12px] font-medium text-[#5a6472]">Transaction</th>
                <th className="w-[245px] px-4 text-[12px] font-medium text-[#5a6472]">Product</th>
                <th className="w-[145px] px-2 text-[12px] font-medium text-[#5a6472]">Date</th>
                <th className="w-[104px] px-2 text-[12px] font-medium text-[#5a6472]">Latency</th>
                <th className="w-[81px] px-2 text-[12px] font-medium text-[#5a6472]">Cost</th>
                <th className="w-[144px] px-2 text-[12px] font-medium text-[#5a6472]">Status</th>
                <th className="w-[117px] px-5 text-right text-[12px] font-medium text-[#5a6472]">Details</th>
              </tr>
            </thead>
            <tbody>
              {visibleRows.map((row) => (
                <tr key={row.trax_id} className="h-[68px] border-b border-[#eef0f3] last:border-b-0">
                  <td className="px-5"><input type="checkbox" className="size-4 rounded border-[#d2d7df]" /></td>
                  <td className="px-2">
                    <div className="flex items-center gap-3 text-[13px] font-medium text-[#5a6472]">
                      {row.displayId}
                      <button type="button" onClick={() => navigator.clipboard.writeText(row.trax_id)} className="text-[#9aa0ab]">
                        <img src={figmaCopyIcon} alt="" className="size-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 text-[14px] text-[#5a6472]">{row.product}</td>
                  <td className="px-2">
                    <p className="text-[13px] leading-5 text-[#5a6472]">{row.date}</p>
                    <p className="text-[11px] leading-4 text-[#9296a0]">{row.time}</p>
                  </td>
                  <td className="px-2 text-[13px] text-[#5a6472]">{row.latency}</td>
                  <td className="px-2 text-[13px] text-[#5a6472]">{row.cost}</td>
                  <td className="px-2"><SandboxStatus status={row.status} /></td>
                  <td className="px-5 text-right">
                    <button
                      type="button"
                      onClick={() => navigate(`/transactions/${row.trax_id.split('-').slice(0, 3).join('-')}`)}
                      className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#5a6472]"
                    >
                      <img src={figmaViewIcon} alt="" className="size-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex h-[65px] items-center border-t border-[#e7e8ea] px-5">
            <p className="text-[12px] leading-4 text-[#5a6472]">{`Showing ${filteredRows.length ? (currentPage - 1) * rowsPerPage + 1 : 0}-${Math.min(currentPage * rowsPerPage, filteredRows.length)} of ${filteredRows.length}`}</p>
            <div className="ml-auto flex items-center gap-1">
              <Button onClick={() => setPage(Math.max(1, currentPage - 1))} variant="outline" className="h-8 rounded-[10px] border-[#e1e5eb] px-3 text-[12px]" disabled={currentPage === 1}>
                <img src={figmaPrevIcon} alt="" className="mr-1 size-3.5" />
                Prev
              </Button>
              {[1, 2, 3].map((pageNumber) => (
                <Button
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  variant={currentPage === pageNumber ? 'default' : 'outline'}
                  className={`size-8 rounded-[10px] p-0 text-[12px] ${currentPage === pageNumber ? 'bg-[#0019ff] text-white hover:bg-[#0019ff]' : 'border-[#e1e5eb] text-[#5a6472]'}`}
                >
                  {pageNumber}
                </Button>
              ))}
              <span className="px-2 text-[12px] text-[#5a6472]">...</span>
              <Button onClick={() => setPage(totalPages)} variant="outline" className="size-8 rounded-[10px] border-[#e1e5eb] p-0 text-[12px] text-[#5a6472]">
                {totalPages}
              </Button>
              <Button onClick={() => setPage(Math.min(totalPages, currentPage + 1))} variant="outline" className="h-8 rounded-[10px] border-[#e1e5eb] px-3 text-[12px]" disabled={currentPage === totalPages}>
                Next
                <img src={figmaNextIcon} alt="" className="ml-1 size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

const TransactionsPage = () => {
  const navigate = useNavigate()
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<any>(undefined)
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [locationFilter, setLocationFilter] = useState<string>('')

  const { data: transactions, loading, error } = useTransactions(searchQuery)

  if (!isProduction) {
    return <SandboxTransactionsPage />
  }

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    if (dateFilter?.from && dateFilter?.to) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = parseTransactionTimestamp(transaction.timestamp)
        if (!transactionDate) {
          return true
        }

        return isWithinInterval(transactionDate, {
          start: dateFilter.from,
          end: dateFilter.to
        })
      })
    }

    if (documentTypeFilter) {
      filtered = filtered.filter((transaction) => transaction.api_name === documentTypeFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter)
    }

    // location filter placeholder

    return filtered
  }, [transactions, dateFilter, documentTypeFilter, statusFilter, locationFilter])

  const handleExportCsv = () => {
    // const headers = ['Transaction ID', 'Type', 'Date & Time', 'Status']
    const headers = ['Transaction ID', 'Backend call', 'Request Payload', 'Response Payload', 'Response Status', 'Response Message', 'Date & Time', 'Turn Around Time']

    const rows = filteredTransactions.map((transaction) => [
      transaction.trax_id,
      transaction.api_name,
      transaction.request_details,
      transaction.response_details,
      transaction.response_message,
      transaction.status,
      formatTransactionTimestampIST(transaction.timestamp),
      transaction.turn_around_time
    ])

    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    downloadCsv({ headers, rows, filename: `Transactions_${formattedDate}` })
  }

  const handleReset = () => {
    console.log('Reset filters clicked')
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleDateChange = (date: any) => {
    setDateFilter(date)
  }

  const handleDocumentTypeChange = (type: string) => {
    setDocumentTypeFilter(type)
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
  }

  const handleLocationChange = (location: string) => {
    setLocationFilter(location)
  }

  const handleViewDetails = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start p-6 sm:p-6 relative rounded-2xl w-full"
    >
      <TransactionsPageHeader />
      <TransactionsStatsGrid />

      {/* Table Container */}
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 w-full">
        <div className="flex flex-col gap-4 sm:gap-6 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] w-full">
          <TransactionsFilters 
            onExportCsv={handleExportCsv}
            onReset={handleReset}
            onSearchChange={handleSearchChange}
            onDateChange={handleDateChange}
            onDocumentTypeChange={handleDocumentTypeChange}
            onStatusChange={handleStatusChange}
            onLocationChange={handleLocationChange}
          />
          <TransactionsTable 
            onViewDetails={handleViewDetails}
            transactions={filteredTransactions}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionsPage
