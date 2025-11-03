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
import { useState, useMemo } from 'react'
import { useUsageMonthly } from '@/hooks/useUsageMonthly'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import type { DateRange } from 'react-day-picker'

const AnalyticsFilters = () => {
  const { data: usageData, loading } = useUsageMonthly()
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(2024, 8, 9), // Sep 9, 2024
    to: new Date(2024, 8, 15),   // Sep 15, 2024
  })
  const [region, setRegion] = useState<string>('')
  const [verificationType, setVerificationType] = useState<string>('')
  const [deviceType, setDeviceType] = useState<string>('')

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

  const handleReset = () => {
    setDate(undefined)
    setRegion('')
    setVerificationType('')
    setDeviceType('')
    console.log('Filters reset')
  }

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
              onSelect={setDate}
              numberOfMonths={2}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Region Filter */}
        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="h-auto w-[140px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
            <SelectValue placeholder="Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="north">North</SelectItem>
            <SelectItem value="south">South</SelectItem>
            <SelectItem value="east">East</SelectItem>
            <SelectItem value="west">West</SelectItem>
          </SelectContent>
        </Select>

        {/* Verification Type Filter */}
        <Select value={verificationType} onValueChange={setVerificationType} disabled={loading}>
          <SelectTrigger className="h-auto w-[180px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
            <SelectValue placeholder={loading ? "Loading..." : "Verification Type"} />
          </SelectTrigger>
          <SelectContent>
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
        <Select value={deviceType} onValueChange={setDeviceType}>
          <SelectTrigger className="h-auto w-[150px] px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea]">
            <SelectValue placeholder="Device Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mobile">Mobile</SelectItem>
            <SelectItem value="desktop">Desktop</SelectItem>
            <SelectItem value="tablet">Tablet</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={handleReset}
        className="h-auto px-2 py-3.5 text-[12px] font-medium text-[#9296a0] border-[#e7e8ea] hover:bg-gray-50"
      >
        <span className="text-nowrap">Reset</span>
        <RotateCcw className="size-4 ml-1" />
      </Button>
    </motion.div>
  )
}

export default AnalyticsFilters
