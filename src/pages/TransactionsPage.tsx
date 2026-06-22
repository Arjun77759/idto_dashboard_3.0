import { motion } from 'framer-motion'
import { CalendarDays, Copy, Download, Eye, Radio, RotateCcw, Search } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format, isWithinInterval } from 'date-fns'
import type { DateRange } from 'react-day-picker'

import nextIcon from '@/assets/figma/transactions/page/next.svg'
import prevIcon from '@/assets/figma/transactions/page/prev.svg'
import sandboxBannerIcon from '@/assets/figma/transactions/page/sandbox-banner.svg'
import failedIcon from '@/assets/figma/transactions/overview-failed.svg'
import latencyIcon from '@/assets/figma/transactions/overview-latency.svg'
import successIcon from '@/assets/figma/transactions/overview-success.svg'
import totalIcon from '@/assets/figma/transactions/overview-total.svg'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Input } from '@/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useTransactions, type Transaction } from '@/hooks/useTransactions'
import { downloadCsv } from '@/lib/downloadCsv'
import { cn } from '@/lib/utils'
import { formatTransactionTimestampIST, parseTransactionTimestamp } from '@/lib/utils'

type TransactionWithOptionalCost = Transaction & {
  amount?: number | string | null
  cost?: number | string | null
  final_price?: number | string | null
  price?: number | string | null
  selling_price?: number | string | null
}

const PAGE_SIZE = 10

const formatApiName = (value?: string | null) => {
  if (!value) return 'Unknown API'

  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase())
}

const getStatusTone = (status?: string | null) => {
  const normalized = status?.toLowerCase() ?? ''

  if (normalized.includes('success')) {
    return 'bg-[#c7fad7] text-[#004313]'
  }

  if (normalized.includes('fail') || normalized.includes('error')) {
    return 'bg-[#ffdfdc] text-[#b42318]'
  }

  if (normalized.includes('pending') || normalized.includes('process')) {
    return 'bg-[#fff4d8] text-[#a46a00]'
  }

  return 'bg-[#edf2ff] text-[#2031c2]'
}

const normalizeStatus = (status?: string | null) => {
  if (!status) return 'Unknown'
  return status.replace(/[_-]+/g, ' ').trim().toUpperCase()
}

const compactId = (id: string) => {
  if (id.length <= 15) return id
  return `${id.slice(0, 8)}...${id.slice(-4)}`
}

const parseLatencyValue = (value?: string | null) => {
  if (!value) return null
  const match = String(value).match(/-?\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

const formatAverageLatency = (transactions: Transaction[]) => {
  const latencies = transactions
    .map((transaction) => parseLatencyValue(transaction.turn_around_time))
    .filter((value): value is number => typeof value === 'number' && Number.isFinite(value))

  if (!latencies.length) return '-'

  const average = latencies.reduce((total, value) => total + value, 0) / latencies.length
  return `${Math.round(average)}ms`
}

const getTransactionCost = (transaction: Transaction) => {
  const candidate = (transaction as TransactionWithOptionalCost).final_price
    ?? (transaction as TransactionWithOptionalCost).selling_price
    ?? (transaction as TransactionWithOptionalCost).amount
    ?? (transaction as TransactionWithOptionalCost).cost
    ?? (transaction as TransactionWithOptionalCost).price

  if (candidate === null || candidate === undefined || candidate === '') {
    return '-'
  }

  const value = Number(candidate)
  if (!Number.isFinite(value)) {
    return String(candidate)
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)
}

const getDateLabel = (timestamp?: string | null) => {
  const parsed = parseTransactionTimestamp(timestamp)
  if (!parsed) return timestamp || '-'

  return format(parsed, 'MMM dd, yyyy')
}

const getTimeLabel = (timestamp?: string | null) => {
  const parsed = parseTransactionTimestamp(timestamp)
  if (!parsed) return ''

  return format(parsed, 'hh:mm a')
}

const StatCard = ({
  icon,
  iconBg,
  label,
  value,
  chip,
}: {
  icon: string
  iconBg: string
  label: string
  value: string
  chip: string
}) => (
  <div className="flex h-[152px] flex-col gap-1.5 rounded-[22px] border border-[#e3e8ef] bg-white p-[21px] shadow-[0_1px_1px_rgba(11,22,40,0.04),0_1px_1.5px_rgba(11,22,40,0.03)]">
    <div className="flex items-start justify-between gap-4">
      <div className={cn('flex size-9 items-center justify-center rounded-[18px]', iconBg)}>
        <img src={icon} alt="" className="size-4" />
      </div>
      <span className="rounded-full bg-[#c7fad7] px-2 py-0.5 text-[10px] font-bold leading-[15px] text-[#004313]">
        {chip}
      </span>
    </div>
    <p className="mt-[18px] text-[30px] font-bold leading-7 tracking-[-0.7px] text-[#071123]">{value}</p>
    <p className="text-[14px] font-normal leading-4 text-[#596475]">{label}</p>
  </div>
)

const TransactionsPage = () => {
  const navigate = useNavigate()
  const { data: onboardingStatus } = useOnboardingStatus()
  const [searchQuery, setSearchQuery] = useState('')
  const [dateFilter, setDateFilter] = useState<DateRange | undefined>(undefined)
  const [productFilter, setProductFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)

  const { data: transactions, loading, error } = useTransactions(searchQuery)
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const productOptions = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.api_name).filter(Boolean))).sort(),
    [transactions]
  )

  const statusOptions = useMemo(
    () => Array.from(new Set(transactions.map((transaction) => transaction.status).filter(Boolean))).sort(),
    [transactions]
  )

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (productFilter !== 'all' && transaction.api_name !== productFilter) {
        return false
      }

      if (statusFilter !== 'all' && transaction.status !== statusFilter) {
        return false
      }

      if (dateFilter?.from && dateFilter?.to) {
        const transactionDate = parseTransactionTimestamp(transaction.timestamp)
        if (!transactionDate) return true

        return isWithinInterval(transactionDate, {
          start: dateFilter.from,
          end: dateFilter.to,
        })
      }

      return true
    })
  }, [transactions, productFilter, statusFilter, dateFilter])

  const stats = useMemo(() => {
    const total = transactions.length
    const successCount = transactions.filter((transaction) =>
      transaction.status?.toLowerCase().includes('success')
    ).length
    const failedCount = transactions.filter((transaction) => {
      const status = transaction.status?.toLowerCase() ?? ''
      return status.includes('fail') || status.includes('error')
    }).length
    const successRate = total ? `${Math.round((successCount / total) * 100)}%` : '0%'

    return {
      total: total.toLocaleString('en-IN'),
      successRate,
      averageLatency: formatAverageLatency(transactions),
      failed: failedCount.toLocaleString('en-IN'),
    }
  }, [transactions])

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / PAGE_SIZE))
  const visibleTransactions = filteredTransactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const dateLabel = dateFilter?.from
    ? dateFilter.to
      ? `${format(dateFilter.from, 'MMM dd')} - ${format(dateFilter.to, 'MMM dd')}`
      : format(dateFilter.from, 'MMM dd')
    : 'Date range'

  const handleExportCsv = () => {
    const headers = [
      'Transaction ID',
      'Product',
      'Request Payload',
      'Response Payload',
      'Response Status',
      'Response Message',
      'Date & Time',
      'Turn Around Time',
      'Cost',
    ]

    const rows = filteredTransactions.map((transaction) => [
      transaction.trax_id,
      transaction.api_name,
      transaction.request_details,
      transaction.response_details,
      transaction.status,
      transaction.response_message,
      formatTransactionTimestampIST(transaction.timestamp),
      transaction.turn_around_time ?? '',
      getTransactionCost(transaction),
    ])

    downloadCsv({
      headers,
      rows,
      filename: `Transactions_${new Date().toISOString().split('T')[0]}`,
    })
  }

  const handleReset = () => {
    setSearchQuery('')
    setDateFilter(undefined)
    setProductFilter('all')
    setStatusFilter('all')
    setPage(1)
  }

  const handleCopy = async (value: string) => {
    await navigator.clipboard?.writeText(value)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex w-full flex-col gap-8 bg-[#fafafb] px-4 py-6 sm:px-6 lg:px-10 lg:py-8"
    >
      <section className="flex w-full items-center justify-between gap-4 rounded-[18px] border border-[rgba(0,25,255,0.10)] bg-[linear-gradient(90deg,rgba(0,25,255,0.03)_0%,rgba(0,229,158,0.06)_100%)] px-[21px] py-[17px]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-[14px] bg-[#0019ff]">
            {isProduction ? (
              <Radio className="size-4 text-white" />
            ) : (
              <img src={sandboxBannerIcon} alt="" className="size-4" />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-[14px] font-semibold leading-[20.25px] text-[#171717]">
              {isProduction ? "You're in Live Mode" : "You're in Sandbox Mode"}
            </p>
            <p className="text-[12px] leading-[18.75px] text-[#525252]">
              {isProduction
                ? 'Production transactions are populated with real API usage and billing data.'
                : 'Follow the setup guide to start building with dummy data - switch to production any time.'}
            </p>
          </div>
        </div>
        <Button
          className="h-8 shrink-0 rounded-full bg-[#0019ff] px-4 text-[12px] font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#0016d9]"
          onClick={() => navigate(isProduction ? '/api-testing' : '/dashboard')}
        >
          {isProduction ? 'Open API console' : 'Move to production'}
        </Button>
      </section>

      <section>
        <h1 className="text-[30px] font-bold leading-[42.5px] tracking-[-0.85px] text-[#071123]">Transactions</h1>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase leading-[16.5px] tracking-[0.55px] text-[#596475]">Overview</p>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={totalIcon} iconBg="bg-[#e4f2ff]" label="Total transactions" value={stats.total} chip="Live" />
          <StatCard icon={successIcon} iconBg="bg-[#c7fad7]" label="Success rate" value={stats.successRate} chip="Live" />
          <StatCard icon={latencyIcon} iconBg="bg-[#c9faf7]" label="Avg. latency" value={stats.averageLatency} chip="Live" />
          <StatCard icon={failedIcon} iconBg="bg-[#ffdfdc]" label="Failed" value={stats.failed} chip="Live" />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <p className="text-[10px] font-bold uppercase leading-[16.5px] tracking-[0.55px] text-[#596475]">Transactions Log</p>
        <div className="overflow-hidden rounded-[22px] border border-[#e3e8ef] bg-white p-px shadow-[0_1px_2px_rgba(11,22,40,0.04),0_1px_3px_rgba(11,22,40,0.03)]">
          <div className="flex flex-col gap-4 border-b border-[#e3e8ef] px-5 pb-[21px] pt-5">
            <div className="flex w-full items-center gap-3">
              <div className="relative min-w-0 flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#071123]" />
                <Input
                  value={searchQuery}
                  onChange={(event) => {
                    setSearchQuery(event.target.value)
                    setPage(1)
                  }}
                  placeholder="Search by transaction ID, product, status..."
                  className="h-10 rounded-[18px] border-[#e3e8ef] bg-[#f8fafc] pl-10 text-[12px] text-[#071123] placeholder:text-[#9aa3b2]"
                />
              </div>
              <Button
                onClick={handleExportCsv}
                className="h-10 shrink-0 rounded-[18px] border border-[#e3e8ef] bg-white px-4 text-[12px] font-medium text-[#071123] shadow-none hover:bg-[#f8fafc]"
              >
                <Download className="mr-2 size-4 text-[#0019ff]" />
                Export CSV
              </Button>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap items-center gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'h-9 w-[190px] justify-start rounded-[12px] border-[#e3e8ef] bg-white px-3 text-[12px] font-normal text-[#596475] hover:bg-[#f8fafc]',
                        dateFilter?.from && 'text-[#071123]'
                      )}
                    >
                      <CalendarDays className="mr-2 size-4 text-[#596475]" />
                      {dateFilter?.from ? dateLabel : 'Pick a date range'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="end">
                    <Calendar
                      mode="range"
                      selected={dateFilter}
                      onSelect={(range) => {
                        setDateFilter(range)
                        setPage(1)
                      }}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>

                <Select
                  value={productFilter}
                  onValueChange={(value) => {
                    setProductFilter(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-9 w-[160px] rounded-[12px] border-[#e3e8ef] text-[12px] font-normal text-[#596475]">
                    <SelectValue placeholder="Product" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All products</SelectItem>
                    {productOptions.map((product) => (
                      <SelectItem key={product} value={product}>
                        {formatApiName(product)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={statusFilter}
                  onValueChange={(value) => {
                    setStatusFilter(value)
                    setPage(1)
                  }}
                >
                  <SelectTrigger className="h-9 w-[140px] rounded-[12px] border-[#e3e8ef] text-[12px] font-normal text-[#596475]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All status</SelectItem>
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status}>
                        {normalizeStatus(status)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-[12px] text-[#596475]">
                  {filteredTransactions.length ? `${(page - 1) * PAGE_SIZE + 1} to ${Math.min(page * PAGE_SIZE, filteredTransactions.length)} of ${filteredTransactions.length} results` : '0 results'}
                </p>

                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="h-9 rounded-[12px] px-2 text-[12px] font-normal text-[#596475] hover:bg-[#f8fafc]"
                >
                  <RotateCcw className="mr-2 size-4 text-[#900013]" />
                  Reset
                </Button>
              </div>
            </div>
          </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] border-collapse">
            <thead>
              <tr className="border-b border-[#e3e8ef] bg-[#f8fafc] text-left">
                <th className="w-11 px-5 py-4">
                  <span className="block size-4 rounded-[4px] border border-[#aeb6c2]" />
                </th>
                {['Transaction', 'Product', 'Date', 'Latency', 'Cost', 'Status', 'Details'].map((column) => (
                  <th key={column} className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.55px] text-[#596475]">
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[14px] text-[#596475]">
                    Loading transactions...
                  </td>
                </tr>
              )}

              {!loading && error && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[14px] text-[#b42318]">
                    {error}
                  </td>
                </tr>
              )}

              {!loading && !error && visibleTransactions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-[14px] text-[#596475]">
                    No transactions found for the selected filters.
                  </td>
                </tr>
              )}

              {!loading && !error && visibleTransactions.map((transaction) => (
                <tr key={transaction.trax_id} className="border-b border-[#e3e8ef] last:border-b-0">
                  <td className="px-5 py-4">
                    <span className="block size-4 rounded-[4px] border border-[#aeb6c2]" />
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <div>
                        <p className="text-[12px] font-medium text-[#071123]">{compactId(transaction.trax_id)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 rounded-[8px] text-[#596475] hover:bg-[#f8fafc]"
                        onClick={() => handleCopy(transaction.trax_id)}
                        aria-label="Copy transaction ID"
                      >
                        <Copy className="size-3.5" />
                      </Button>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[12px] font-medium text-[#071123]">{formatApiName(transaction.api_name)}</td>
                  <td className="px-5 py-4">
                    <p className="text-[12px] font-medium text-[#071123]">{getDateLabel(transaction.timestamp)}</p>
                    <p className="text-[10px] text-[#596475]">{getTimeLabel(transaction.timestamp)}</p>
                  </td>
                  <td className="px-5 py-4 text-[12px] font-medium text-[#596475]">{transaction.turn_around_time || '-'}</td>
                  <td className="px-5 py-4 text-[12px] font-medium text-[#071123]">{getTransactionCost(transaction)}</td>
                  <td className="px-5 py-4">
                    <span className={cn(
                      'inline-flex rounded-full px-3 py-1 text-[11px] font-bold leading-none',
                      transaction.status?.toLowerCase().includes('success')
                        ? 'bg-[#c7fad7] text-[#004313]'
                        : transaction.status?.toLowerCase().includes('error') || transaction.status?.toLowerCase().includes('fail')
                          ? 'bg-[#ffdfdc] text-[#b42318]'
                          : getStatusTone(transaction.status)
                    )}>
                      {normalizeStatus(transaction.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <Button
                      variant="ghost"
                      className="h-8 rounded-[10px] px-2 text-[12px] font-medium text-[#0019ff] hover:bg-[#edf2ff]"
                      onClick={() => navigate(`/transactions/${transaction.trax_id}`)}
                    >
                      <Eye className="mr-1.5 size-3.5" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-3 border-t border-[#e3e8ef] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12px] text-[#596475]">
            Showing {visibleTransactions.length ? (page - 1) * PAGE_SIZE + 1 : 0}-
            {Math.min(page * PAGE_SIZE, filteredTransactions.length)} of {filteredTransactions.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="h-8 rounded-[12px] border-[#e3e8ef] px-3 text-[12px] text-[#596475]"
              disabled={page === 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              aria-label="Previous page"
            >
              <img src={prevIcon} alt="" className="mr-1 size-3" />
              Prev
            </Button>
            <span className="flex size-8 items-center justify-center rounded-full bg-[#0019ff] text-[12px] font-semibold text-white">
              {page}
            </span>
            <span className="text-[12px] text-[#596475]">
              {totalPages}
            </span>
            <Button
              variant="outline"
              className="h-8 rounded-[12px] border-[#e3e8ef] px-3 text-[12px] text-[#596475]"
              disabled={page === totalPages}
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              aria-label="Next page"
            >
              Next
              <img src={nextIcon} alt="" className="ml-1 size-3" />
            </Button>
          </div>
        </div>
        </div>
      </section>
    </motion.div>
  )
}

export default TransactionsPage
