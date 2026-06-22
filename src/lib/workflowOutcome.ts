/**
 * Verification verdict (RESULT) styling for workflow analytics.
 *
 * This is the verification *outcome* of a session — distinct from its
 * lifecycle *status* (completed / in_progress / abandoned / expired).
 * A session only carries an outcome once it has completed; until then the
 * outcome is null/absent and no verdict should be shown.
 */

export type SessionOutcome = 'verified' | 'needs_review' | 'not_verified' | null

export type KnownOutcome = Exclude<SessionOutcome, null>

export interface OutcomeStyle {
  /** Whether a verdict badge should be rendered at all. */
  show: boolean
  dot: string
  text: string
  bg: string
  label: string
  /** Border colour for the summary-card variant of this verdict. */
  ring: string
}

/** Visual treatment per verification verdict. */
export const OUTCOME_STYLES: Record<KnownOutcome, Omit<OutcomeStyle, 'show'>> = {
  verified: { dot: 'bg-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50', label: 'Verified', ring: 'border-emerald-100' },
  needs_review: { dot: 'bg-amber-500', text: 'text-amber-700', bg: 'bg-amber-50', label: 'Needs Review', ring: 'border-amber-100' },
  not_verified: { dot: 'bg-red-500', text: 'text-red-700', bg: 'bg-red-50', label: 'Not Verified', ring: 'border-red-100' },
}

/** Fixed render order for the verdict summary (best → worst). */
export const VERDICT_ORDER: readonly KnownOutcome[] = ['verified', 'needs_review', 'not_verified']

/**
 * Resolve the badge style for a session's verification outcome.
 * Returns `show: false` (neutral, hidden) for null/absent/unknown outcomes so
 * callers can skip rendering a verdict for sessions that haven't completed.
 */
export function outcomeStyle(outcome?: SessionOutcome | string): OutcomeStyle {
  const known = OUTCOME_STYLES[outcome as KnownOutcome]
  if (!outcome || !known) {
    return { show: false, dot: 'bg-neutral-300', text: 'text-neutral-500', bg: 'bg-neutral-100', label: '—', ring: 'border-neutral-200' }
  }
  return { show: true, ...known }
}

/**
 * Number of steps that have reached the "completed" status.
 *
 * Used for the session-detail Progress tile. Counting completed steps is
 * robust for both in-progress sessions (e.g. 2 of 4 done) and completed ones
 * (all 4 done → 4/4), unlike `current_step_index`, which is 0-based and so
 * reports one short of the true count for a fully completed session.
 */
export function completedStepCount(steps?: ReadonlyArray<{ status?: string }> | null): number {
  if (!steps) return 0
  return steps.reduce((count, step) => (step?.status === 'completed' ? count + 1 : count), 0)
}
