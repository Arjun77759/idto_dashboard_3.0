import { formatDistanceToNow } from 'date-fns'
import {
  CheckCircle2, CircleDashed, XCircle, ShieldCheck, ShieldAlert, ShieldX,
} from 'lucide-react'
import type { KnownOutcome } from '@/lib/workflowOutcome'

/** Verdict-specific icons for the summary card (colours come from OUTCOME_STYLES). */
export const VERDICT_ICONS: Record<KnownOutcome, typeof ShieldCheck> = {
  verified: ShieldCheck,
  needs_review: ShieldAlert,
  not_verified: ShieldX,
}

/** Visual treatment per session/step status. */
export const STATUS_STYLES: Record<
  string,
  { dot: string; text: string; bg: string; label: string }
> = {
  completed: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Completed' },
  in_progress: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', label: 'In Progress' },
  abandoned: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', label: 'Abandoned' },
  failed: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', label: 'Failed' },
  pending: { dot: 'bg-neutral-400', text: 'text-neutral-600', bg: 'bg-neutral-100', label: 'Pending' },
}

export const statusStyle = (status?: string) =>
  STATUS_STYLES[status ?? ''] ?? {
    dot: 'bg-neutral-400',
    text: 'text-neutral-600',
    bg: 'bg-neutral-100',
    label: status ?? 'Unknown',
  }

export const STATUS_ICON: Record<string, typeof CheckCircle2> = {
  completed: CheckCircle2,
  in_progress: CircleDashed,
  failed: XCircle,
  abandoned: XCircle,
  pending: CircleDashed,
}

export const inr = (n: number) => `₹${n.toFixed(2)}`

export function relativeTime(value?: string | null) {
  if (!value) return '—'
  try {
    return formatDistanceToNow(new Date(value), { addSuffix: true })
  } catch {
    return '—'
  }
}
