import { parse } from "date-fns"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const TRANSACTION_TIMESTAMP_FORMATS = [
  "hh:mm a-MM/dd/yyyy",
  "MM/dd/yy HH:mm:ss",
  "MM/dd/yyyy HH:mm:ss",
  "MMM d, yyyy h:mm a"
] as const

export function parseTransactionTimestamp(value?: string | null) {
  if (!value) {
    return null
  }

  // Special-case: backend sends UTC as "hh:mm a-MM/dd/yyyy" (e.g. "02:14 PM-12/23/2025")
  // Treat this *wall time* as UTC and construct a Date in UTC explicitly.
  const utcTimeMatch = /^(\d{2}):(\d{2})\s(AM|PM)-(\d{2})\/(\d{2})\/(\d{4})$/.exec(value)
  if (utcTimeMatch) {
    let hour = Number(utcTimeMatch[1])
    const minute = Number(utcTimeMatch[2])
    const ampm = utcTimeMatch[3]
    const month = Number(utcTimeMatch[4]) - 1 // JS months are 0-based
    const day = Number(utcTimeMatch[5])
    const year = Number(utcTimeMatch[6])

    if (ampm === 'PM' && hour !== 12) hour += 12
    if (ampm === 'AM' && hour === 12) hour = 0

    return new Date(Date.UTC(year, month, day, hour, minute, 0))
  }

  const nativeDate = new Date(value)
  if (!Number.isNaN(nativeDate.getTime())) {
    return nativeDate
  }

  for (const formatString of TRANSACTION_TIMESTAMP_FORMATS) {
    try {
      const parsed = parse(value, formatString, new Date())
      if (!Number.isNaN(parsed.getTime())) {
        return parsed
      }
    } catch {
      // Ignore parsing errors and try the next format
    }
  }

  return null
}

/**
 * Format a transaction timestamp string into IST (Asia/Kolkata) time.
 * Falls back to the original value if it cannot be parsed.
 */
export function formatTransactionTimestampIST(
  value?: string | null,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!value) {
    return ''
  }

  const parsed = parseTransactionTimestamp(value)
  if (!parsed) {
    return value
  }

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    year: '2-digit',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    ...options
  })

  return formatter.format(parsed)
}
