import { useEffect, useMemo, useState } from 'react'
import { Download, Receipt, RotateCw } from 'lucide-react'

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

const getStatusClassName = (status: string) => {
  switch (status.toLowerCase()) {
    case 'success':
      return 'bg-green-100 text-green-800 hover:bg-green-100'
    case 'failed':
    case 'error':
      return 'bg-red-100 text-red-800 hover:bg-red-100'
    case 'deducted':
      return 'bg-neutral-200 text-neutral-800 hover:bg-neutral-200'
    case 'tax':
      return 'bg-amber-100 text-amber-800 hover:bg-amber-100'
    default:
      return 'bg-blue-100 text-blue-800 hover:bg-blue-100'
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

const ReportRow = ({ report }: { report: UsageReport }) => (
  <TableRow className="odd:bg-[#f7f7f8]">
    <TableCell className="max-w-[220px] font-mono text-xs text-[#616675]">
      <span className="block truncate" title={report.trans_id}>
        {report.trans_id}
      </span>
    </TableCell>
    <TableCell className="min-w-[180px] text-sm font-normal text-[#616675]">
      {formatApiName(report.api_name)}
    </TableCell>
    <TableCell>
      <Badge className={cn('border-transparent font-normal', getStatusClassName(report.status))}>
        {formatApiName(report.status)}
      </Badge>
    </TableCell>
    <TableCell className="whitespace-nowrap text-sm text-[#616675]">
      {report.datetime}
    </TableCell>
    <TableCell className="whitespace-nowrap text-right text-sm text-[#616675]">
      {formatCurrency(report.selling_price)}
    </TableCell>
    <TableCell className="whitespace-nowrap text-center text-sm text-[#616675]">
      18%
    </TableCell>
    <TableCell className="whitespace-nowrap text-right text-sm text-[#616675]">
      {formatCurrency(report.balance ?? report.balance_after)}
    </TableCell>
  </TableRow>
)

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
    <section className={cn('bg-white border border-[#e7e8ea] border-solid relative rounded-2xl min-w-0 w-full overflow-hidden', className)}>
      <div className="flex flex-col gap-4 sm:gap-6 overflow-hidden p-4 sm:p-6 rounded-[inherit] w-full">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex items-center gap-2">
              <Receipt className="size-5 text-[#131b31]" />
              <p className="text-[16px] font-normal leading-[1.4] text-[#131b31]">Reports</p>
            </div>
            <p className="text-[12px] leading-[1.4] text-[#9296a0]">
              Showing {data?.reports.length ?? 0} of {totalCount} API charge entries for{' '}
              {monthNames[selectedMonth - 1]} {selectedYear}
            </p>
          </div>

          <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:w-auto lg:max-w-[560px] lg:flex-wrap lg:justify-end">
            <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(Number(value))}>
              <SelectTrigger className="h-9 text-xs lg:w-[120px]">
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
              <SelectTrigger className="h-9 text-xs lg:w-[92px]">
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
              <SelectTrigger className="h-9 text-xs sm:col-span-2 lg:w-[180px]">
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
              className="h-9 text-xs"
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
              className="h-9 w-9 justify-self-start"
            >
              <RotateCw className={cn('size-4', loading && 'animate-spin')} />
            </Button>
          </div>
        </div>

        <div className="w-full min-w-0 max-h-[470px] overflow-x-scroll overflow-y-auto rounded-md border border-[#e7e8ea] [scrollbar-gutter:stable_both-edges]">
          <table className="w-full min-w-[1240px] caption-bottom text-sm">
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow className="hover:bg-transparent">
                <TableHead className="min-w-[220px] font-normal text-[#131b31]">Trans ID</TableHead>
                <TableHead className="min-w-[180px] font-normal text-[#131b31]">API Name</TableHead>
                <TableHead className="min-w-[120px] font-normal text-[#131b31]">Status</TableHead>
                <TableHead className="min-w-[170px] font-normal text-[#131b31]">Datetime</TableHead>
                <TableHead className="min-w-[140px] text-right font-normal text-[#131b31]">Cost</TableHead>
                <TableHead className="min-w-[100px] text-center font-normal text-[#131b31]">GST</TableHead>
                <TableHead className="min-w-[150px] text-right font-normal text-[#131b31]">Balance</TableHead>
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
