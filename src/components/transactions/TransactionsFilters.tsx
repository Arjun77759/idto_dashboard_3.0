import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, FileSpreadsheet, Download, Calendar as CalendarIcon, RotateCcw } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useUsageMonthly } from '@/hooks/useUsageMonthly'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

interface TransactionsFiltersProps {
  onExportCsv: () => void
  onDownloadReport: () => void
  onReset: () => void
  onSearchChange: (query: string) => void
  onDateChange?: (date: DateRange | undefined) => void
  onDocumentTypeChange?: (type: string) => void
  onStatusChange?: (status: string) => void
  onLocationChange?: (location: string) => void
}

const TransactionsFilters = ({ 
  onExportCsv, 
  onDownloadReport, 
  onReset,
  onSearchChange,
  onDateChange,
  onDocumentTypeChange,
  onStatusChange,
  onLocationChange
}: TransactionsFiltersProps) => {
  const { data: usageData, loading } = useUsageMonthly()
  
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [documentType, setDocumentType] = useState<string>('')
  const [status, setStatus] = useState<string>('')
  const [location, setLocation] = useState<string>('')

  // Extract unique document types from API data
  const documentTypes = useMemo(() => {
    if (!usageData || usageData.length === 0) return []
    const uniqueTypes = [...new Set(usageData.map(item => item.api_name))]
    return uniqueTypes.sort()
  }, [usageData])

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearchChange(value)
  }

  const handleDateChange = (newDate: DateRange | undefined) => {
    setDate(newDate)
    onDateChange?.(newDate)
  }

  const handleDocumentTypeChange = (value: string) => {
    setDocumentType(value)
    onDocumentTypeChange?.(value)
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    onStatusChange?.(value)
  }

  const handleLocationChange = (value: string) => {
    setLocation(value)
    onLocationChange?.(value)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setDate(undefined)
    setDocumentType('')
    setStatus('')
    setLocation('')
    onSearchChange('')
    onDateChange?.(undefined)
    onDocumentTypeChange?.('')
    onStatusChange?.('')
    onLocationChange?.('')
    onReset()
  }

  return (
    <>
      {/* Search and Export Header */}
      <div className="hidden md:flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between relative rounded shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch w-full sm:w-auto">
          <div className="relative w-full sm:w-[500px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-[#9296a0]" />
            <Input
              type="text"
              placeholder="Search for Id, name, product etc"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="pl-11 pr-4 py-2 h-auto border-[#e7e8ea] text-[12px] placeholder:text-[#9296a0]"
            />
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center relative shrink-0 w-full sm:w-auto">
          <Button 
            onClick={onExportCsv}
            className="bg-[#e6e8ff] hover:bg-[#d0d4ff] text-[#0019ff] border-0 px-2 py-3.5 h-auto rounded-lg flex-1 sm:flex-none"
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
              Export CSV
            </p>
            <FileSpreadsheet className="size-4 ml-2 text-[#0019ff]" />
          </Button>
          
          <Button 
            onClick={onDownloadReport}
            className="bg-[#e6e8ff] hover:bg-[#d0d4ff] text-[#0019ff] border-0 px-2 py-3.5 h-auto rounded-lg flex-1 sm:flex-none"
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
              Download Report
            </p>
            <Download className="size-4 ml-2 text-[#0019ff]" />
          </Button>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2 h-auto sm:h-10 items-center justify-between relative shrink-0 w-full">
        <div className="flex flex-wrap gap-2 grow h-full items-center min-h-0 min-w-0 relative shrink-0">
          {/* Date Range Filter */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "border-[#e7e8ea] h-10 rounded-lg px-2 py-3.5 text-[12px] font-medium",
                  !date && "text-[#9296a0]"
                )}
              >
                <CalendarIcon className="size-4 mr-2 text-[#9296a0]" />
                {date?.from ? (
                  date.to ? (
                    <span className="text-[#9296a0] text-nowrap">
                      {format(date.from, "MMM d, yyyy")} - {format(date.to, "MMM d, yyyy")}
                    </span>
                  ) : (
                    <span className="text-[#9296a0] text-nowrap">{format(date.from, "MMM d, yyyy")}</span>
                  )
                ) : (
                  <span className="text-[#9296a0] text-nowrap">Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={date}
                onSelect={handleDateChange}
                numberOfMonths={2}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          
          {/* Document Type Filter */}
          <Select value={documentType} onValueChange={handleDocumentTypeChange} disabled={loading}>
            <SelectTrigger className="h-10 w-[180px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
              <SelectValue placeholder={loading ? "Loading..." : "Document Type"} />
            </SelectTrigger>
            <SelectContent>
              {documentTypes.length === 0 ? (
                <SelectItem value="none" disabled>No types available</SelectItem>
              ) : (
                documentTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
          
          {/* Status Filter */}
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="h-10 w-[130px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="success">Success</SelectItem>
              <SelectItem value="failed">Failed</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Location Filter - Note: Backend API support pending (region parameter) */}
          <Select value={location} onValueChange={handleLocationChange}>
            <SelectTrigger className="h-10 w-[140px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="north">North</SelectItem>
              <SelectItem value="south">South</SelectItem>
              <SelectItem value="east">East</SelectItem>
              <SelectItem value="west">West</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={handleResetFilters}
          variant="outline" 
          className="border-[#e7e8ea] h-10 rounded-lg px-2 py-3.5"
        >
          <span className="font-medium text-[12px] text-[#9296a0] text-nowrap">Reset</span>
          <RotateCcw className="size-4 ml-1 text-[#9296a0]" />
        </Button>
      </div>
    </>
  )
}

export default TransactionsFilters
