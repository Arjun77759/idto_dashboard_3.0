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
