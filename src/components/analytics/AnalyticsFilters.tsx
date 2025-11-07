import { motion } from 'framer-motion'
import { Calendar as CalendarIcon, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useMemo } from 'react'
import { useUsageMonthly } from '@/hooks/useUsageMonthly'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { useAnalyticsFilters } from '@/contexts/AnalyticsFilterContext'

const AnalyticsFilters = () => {
  const { data: usageData, loading } = useUsageMonthly()
  const { 
    filters, 
    setDateRange, 
    setRegion, 
    setVerificationType, 
    setDeviceType, 
    resetFilters 
  } = useAnalyticsFilters()

  // Transform snake_case to Title Case
  const formatApiName = (name: string): string => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Extract unique verification types from API data
  const verificationTypes = useMemo(() => {
    if (!usageData || usageData.length === 0) return []
    const uniqueTypes = [...new Set(usageData.map(item => item.api_name))]
    return uniqueTypes.sort()
  }, [usageData])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="hidden md:flex flex-wrap gap-2 h-auto items-center justify-between relative shrink-0 w-full"
    >
      <div className="flex flex-wrap gap-2 h-full items-center min-h-0 min-w-px relative shrink-0">
        {/* Date Range Filter */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "h-auto px-2 py-3.5 text-[12px] font-medium border-[#e7e8ea] hover:bg-gray-50 justify-start text-left font-normal",
                !filters.dateRange && "text-[#9296a0]"
              )}
            >
              <CalendarIcon className="size-4 mr-2 text-[#9296a0]" />
              {filters.dateRange?.from ? (
                filters.dateRange.to ? (
                  <span className="text-[#9296a0] text-nowrap">
                    {format(filters.dateRange.from, "MMM d, yyyy")} - {format(filters.dateRange.to, "MMM d, yyyy")}
                  </span>
                ) : (
                  <span className="text-[#9296a0] text-nowrap">{format(filters.dateRange.from, "MMM d, yyyy")}</span>
                )
              ) : (
                <span className="text-[#9296a0] text-nowrap">Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={filters.dateRange}
              onSelect={setDateRange}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Region Filter */}
        <Select value={filters.region} onValueChange={setRegion}>
          <SelectTrigger className="h-auto w-[140px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            <SelectItem value="north">North</SelectItem>
            <SelectItem value="south">South</SelectItem>
            <SelectItem value="east">East</SelectItem>
            <SelectItem value="west">West</SelectItem>
          </SelectContent>
        </Select>

        {/* Verification Type Filter */}
        <Select value={filters.verificationType} onValueChange={setVerificationType} disabled={loading}>
          <SelectTrigger className="h-auto w-[180px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
            <SelectValue placeholder={loading ? "Loading..." : "Verification Type"} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {verificationTypes.length === 0 ? (
              <SelectItem value="none" disabled>No types available</SelectItem>
            ) : (
              verificationTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {formatApiName(type)}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>

        {/* Device Type Filter */}
        <Select value={filters.deviceType} onValueChange={setDeviceType}>
          <SelectTrigger className="h-auto w-[150px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
            <SelectValue placeholder="Device Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Devices</SelectItem>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={resetFilters}
        className="h-auto px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea] hover:bg-gray-50"
      >
        <span className="text-nowrap">Reset</span>
        <RotateCcw className="size-4 ml-1" />
      </Button>
    </motion.div>
  )
}

export default AnalyticsFilters
