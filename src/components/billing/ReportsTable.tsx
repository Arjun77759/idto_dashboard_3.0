import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { Download, RotateCw } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useExportUsageReportsCsv, useUsageReports } from '@/hooks/useUsageReports'
import type { UsageReport } from '@/api/usageApi'
import { cn } from '@/lib/utils'
import copyIcon from '@/assets/figma/billing/copy.svg'
import reportsIcon from '@/assets/figma/billing/reports.svg'

export const REPORTS_ALL_APIS_VALUE = '__all__'
const PAGE_SIZE = 100

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const formatCurrency = (value?: number | null) =>
  value === null || value === undefined ? 'N/A' : currencyFormatter.format(value)

const formatApiName = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

const formatShortTransactionId = (value: string) =>
  value.length > 7 ? `${value.slice(0, 7)}...` : value

const getStatusClassName = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return 'bg-[#00e59e]/15 text-[#047857] hover:bg-[#00e59e]/15'
    case 'failed':
    case 'error':
      return 'bg-[#fef2f2] text-[#b91c1c] hover:bg-[#fef2f2]'
    case 'deducted':
      return 'bg-[#f5f5f5] text-[#404040] hover:bg-[#f5f5f5]'
    case 'tax':
      return 'bg-[#f5f5f5] text-[#404040] hover:bg-[#f5f5f5]'
    default:
      return 'bg-[#0019ff]/[0.06] text-[#0019ff] hover:bg-[#0019ff]/[0.06]'
  }
}

const getVisiblePages = (totalPages: number, currentPage: number) => {
  const maxVisible = 5
  const pages: Array<number | string> = []

  if (totalPages <= maxVisible) {
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber += 1) {
      pages.push(pageNumber)
    }
    return pages
  }

  if (currentPage <= 3) {
    for (let pageNumber = 1; pageNumber <= 5; pageNumber += 1) {
      pages.push(pageNumber)
    }
    pages.push('...')
    pages.push(totalPages)
    return pages
  }

  if (currentPage >= totalPages - 2) {
    pages.push(1)
    pages.push('...')
    for (let pageNumber = totalPages - 4; pageNumber <= totalPages; pageNumber += 1) {
      pages.push(pageNumber)
    }
    return pages
  }

  pages.push(1)
  pages.push('...')
  pages.push(currentPage - 1)
  pages.push(currentPage)
  pages.push(currentPage + 1)
  pages.push('...')
  pages.push(totalPages)
  return pages
}

const ReportRow = ({ report }: { report: UsageReport }) => {
  const handleCopyTransactionId = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    navigator.clipboard.writeText(report.trans_id)
  }

  return (
    <TableRow className="border-b border-[#f5f5f5] bg-white last:border-b-0 hover:bg-[#fafafa]/50">
      <TableCell className="w-[150px] max-w-[150px] px-3 font-mono text-[12px] text-[#404040]">
        <div className="flex items-center gap-2">
          <span title={report.trans_id}>{formatShortTransactionId(report.trans_id)}</span>
          <button
            type="button"
            onClick={handleCopyTransactionId}
            className="shrink-0"
            aria-label="Copy transaction id"
          >
            <img src={copyIcon} alt="" className="size-4" />
          </button>
        </div>
      </TableCell>
    <TableCell className="w-[190px] max-w-[190px] px-3 text-[12px] font-normal text-[#171717]">
      {formatApiName(report.api_name)}
    </TableCell>
    <TableCell className="px-3">
      <Badge className={cn('min-w-[50px] justify-center gap-1 rounded-full border-transparent px-2 py-0.5 text-[10px] font-medium', getStatusClassName(report.status))}>
        {formatApiName(report.status)}
      </Badge>
    </TableCell>
    <TableCell className="whitespace-nowrap px-3 text-[12px] text-[#737373]">
      {report.datetime}
    </TableCell>
    <TableCell className="whitespace-nowrap px-3 text-left text-[12px] font-medium text-[#171717]">
      {formatCurrency(report.selling_price)}
    </TableCell>
    <TableCell className="whitespace-nowrap px-3 text-left text-[12px] text-[#737373]">
      18%
    </TableCell>
    <TableCell className="whitespace-nowrap px-3 text-left text-[12px] text-[#404040]">
      {formatCurrency(report.balance ?? report.balance_after)}
    </TableCell>
    </TableRow>
  )
}

type ReportsTableProps = {
  selectedApiName?: string
  onSelectedApiNameChange?: (apiName: string) => void
  className?: string
}

const ReportsTable = ({ selectedApiName: selectedApiNameProp, onSelectedApiNameChange, className }: ReportsTableProps) => {
  const now = useMemo(() => new Date(), [])
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(now.getFullYear())
  const [internalSelectedApiName, setInternalSelectedApiName] = useState(REPORTS_ALL_APIS_VALUE)
  const [page, setPage] = useState(1)

  const selectedApiName = selectedApiNameProp ?? internalSelectedApiName
  const apiNameParam = selectedApiName === REPORTS_ALL_APIS_VALUE ? undefined : selectedApiName
  const { data, loading, error, refetch } = useUsageReports({
    month: selectedMonth,
    year: selectedYear,
    page,
    limit: PAGE_SIZE,
    api_name: apiNameParam,
  })
  const exportReports = useExportUsageReportsCsv()

  const totalCount = data?.total_count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE))
  const availableYears = useMemo(
    () => Array.from({ length: 10 }, (_, index) => now.getFullYear() - index),
    [now]
  )
  const visiblePages = useMemo(() => getVisiblePages(totalPages, page), [totalPages, page])
  const apiNameOptions = useMemo(() => {
    const names = data?.api_names ?? []
    if (!apiNameParam || names.includes(apiNameParam)) return names
    return [apiNameParam, ...names]
  }, [apiNameParam, data?.api_names])

  useEffect(() => {
    setPage(1)
  }, [selectedMonth, selectedYear, selectedApiName])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const handleExport = () => {
    exportReports.exportCsv({
      month: selectedMonth,
      year: selectedYear,
      api_name: apiNameParam,
    })
  }

  const handleApiNameChange = (apiName: string) => {
    if (selectedApiNameProp === undefined) {
      setInternalSelectedApiName(apiName)
    }
    onSelectedApiNameChange?.(apiName)
  }

  return (
    <section className={cn('relative min-w-0 w-full overflow-hidden rounded-[22px] border border-[#e5e5e5]/80 bg-white shadow-[0_1px_0_rgba(15,23,42,0.04)]', className)}>
      <div className="flex w-full flex-col gap-4 overflow-hidden rounded-[inherit] p-[21px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-[14px] bg-[#0019ff]/[0.06]">
                <img src={reportsIcon} alt="" className="size-4" />
              </div>
              <div>
                <p className="text-[14px] font-semibold leading-[21px] text-[#171717]">Reports</p>
                <p className="text-[12px] leading-[17.25px] text-[#737373]">
                  API charge entries for {monthNames[selectedMonth - 1]} {selectedYear}
                </p>
              </div>
            </div>
            <p className="pl-10 text-[12px] leading-[18px] text-[#737373]">
              Showing {data?.reports.length ?? 0} of {totalCount} API charge entries for{' '}
              {monthNames[selectedMonth - 1]} {selectedYear}
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:max-w-[560px] lg:flex-wrap lg:justify-end">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
              <SelectTrigger className="h-9 rounded-[10px] border-[#e5e5e5] text-xs shadow-[0_1px_3px_rgba(0,0,0,0.08)] lg:w-[120px]">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent>
                {monthNames.map((monthName, index) => (
                  <SelectItem key={monthName} value={(index + 1).toString()}>
                    {monthName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(Number(value))}>
              <SelectTrigger className="h-9 rounded-[10px] border-[#e5e5e5] text-xs shadow-[0_1px_3px_rgba(0,0,0,0.08)] lg:w-[92px]">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedApiName} onValueChange={handleApiNameChange}>
              <SelectTrigger className="h-9 rounded-[10px] border-[#e5e5e5] text-xs shadow-[0_1px_3px_rgba(0,0,0,0.08)] sm:col-span-2 lg:w-[180px]">
                <SelectValue placeholder="API name" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={REPORTS_ALL_APIS_VALUE}>All APIs</SelectItem>
                {apiNameOptions.map((apiName) => (
                  <SelectItem key={apiName} value={apiName}>
                    {formatApiName(apiName)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExport}
              disabled={exportReports.loading}
              className="h-9 rounded-[10px] border-[#e2e8f0] bg-white text-xs shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
            >
              <Download className="size-4" />
              <span>{exportReports.loading ? 'Exporting...' : 'CSV'}</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={refetch}
              disabled={loading}
              aria-label="Refresh reports"
              className="h-9 w-9 justify-self-start rounded-[10px]"
            >
              <RotateCw className={cn('size-4', loading && 'animate-spin')} />
            </Button>
          </div>
        </div>

        <div className="w-full min-w-0 max-h-[560px] overflow-x-scroll overflow-y-auto rounded-[18px] border border-[#e5e5e5] [scrollbar-gutter:stable_both-edges]">
          <table className="w-[880px] min-w-[880px] table-fixed caption-bottom text-sm">
            <colgroup>
              <col className="w-[150px]" />
              <col className="w-[190px]" />
              <col className="w-[120px]" />
              <col className="w-[170px]" />
              <col className="w-[80px]" />
              <col className="w-[60px]" />
              <col className="w-[110px]" />
            </colgroup>
            <TableHeader className="sticky top-0 z-10 bg-[#fafafa]/70">
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[150px] min-w-[150px] px-3 text-[10px] font-semibold uppercase tracking-[0.55px] text-[#737373]">Trans ID</TableHead>
                <TableHead className="w-[190px] min-w-[190px] px-3 text-[10px] font-semibold uppercase tracking-[0.55px] text-[#737373]">API Name</TableHead>
                <TableHead className="w-[120px] min-w-[120px] px-3 text-[10px] font-semibold uppercase tracking-[0.55px] text-[#737373]">Status</TableHead>
                <TableHead className="w-[170px] min-w-[170px] px-3 text-[10px] font-semibold uppercase tracking-[0.55px] text-[#737373]">Datetime</TableHead>
                <TableHead className="w-[80px] min-w-[80px] px-3 text-left text-[10px] font-semibold uppercase tracking-[0.55px] text-[#737373]">Cost</TableHead>
                <TableHead className="w-[60px] min-w-[60px] px-3 text-left text-[10px] font-semibold uppercase tracking-[0.55px] text-[#737373]">GST</TableHead>
                <TableHead className="w-[110px] min-w-[110px] px-3 text-left text-[10px] font-semibold uppercase tracking-[0.55px] text-[#737373]">Balance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 7 }).map((_, index) => (
                  <TableRow key={`report-loading-${index}`}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-8 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-red-600">
                    {error}
                  </TableCell>
                </TableRow>
              ) : data?.reports.length ? (
                data.reports.map((report) => <ReportRow key={report.log_id} report={report} />)
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="py-8 text-center text-sm text-[#9296a0]">
                    No API charge entries found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </table>
        </div>

        {totalCount > PAGE_SIZE && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    if (page > 1) setPage(page - 1)
                  }}
                  className={cn(page === 1 && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>

              {visiblePages.map((pageItem, index) =>
                pageItem === '...' ? (
                  <PaginationItem key={`report-page-ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={`report-page-${pageItem}`}>
                    <PaginationLink
                      href="#"
                      isActive={page === pageItem}
                      onClick={(event) => {
                        event.preventDefault()
                        setPage(pageItem as number)
                      }}
                      className={cn(page === pageItem && 'bg-[#e6e8ff] text-[#0019ff] hover:bg-[#e6e8ff]')}
                    >
                      {pageItem}
                    </PaginationLink>
                  </PaginationItem>
                )
              )}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(event) => {
                    event.preventDefault()
                    if (page < totalPages) setPage(page + 1)
                  }}
                  className={cn(page === totalPages && 'pointer-events-none opacity-50')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </section>
  )
}

export default ReportsTable
