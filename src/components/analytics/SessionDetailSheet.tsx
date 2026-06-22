import {
  Activity, Layers, Clock, RotateCcw, RefreshCw, Hash, CircleDashed, ShieldCheck,
} from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Sheet, SheetContent, SheetTitle } from '@/components/ui/sheet'
import { MODULE_ICONS, formatSlug } from '@/lib/workflowModules'
import { outcomeStyle, completedStepCount, type KnownOutcome } from '@/lib/workflowOutcome'
import { statusStyle, STATUS_ICON, VERDICT_ICONS, relativeTime } from './analyticsFormat'
import type { MerchantSessionDetail } from '@/api/workflowApi'

interface SessionDetailSheetProps {
  open: boolean
  onClose: () => void
  sessionDetail: MerchantSessionDetail | null
  loading: boolean
}

const SessionDetailSheet = ({ open, onClose, sessionDetail, loading }: SessionDetailSheetProps) => (
  <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
    <SheetContent className="w-full sm:max-w-md md:max-w-lg p-0 gap-0 flex flex-col">
      {(() => {
        const detailStatus = statusStyle(sessionDetail?.status)
        const totalSteps =
          sessionDetail?.workflow?.modules?.length ??
          sessionDetail?.steps?.length ??
          0
        // Progress numerator = completed steps (so a finished 4-step session
        // reads 4/4, not 3/4 as the 0-based current_step_index would give).
        // Fall back to the lifecycle status when no steps array is present.
        const completedSteps = sessionDetail?.steps
          ? completedStepCount(sessionDetail.steps)
          : sessionDetail?.status === 'completed'
          ? totalSteps
          : sessionDetail?.current_step_index ?? 0
        const StatusIcon = STATUS_ICON[sessionDetail?.status ?? ''] ?? CircleDashed
        const verdict = outcomeStyle(sessionDetail?.outcome)
        const VerdictIcon = VERDICT_ICONS[sessionDetail?.outcome as KnownOutcome] ?? ShieldCheck

        return (
          <>
            {/* Sticky header */}
            <div className="border-b border-[#e7e8ea] px-6 py-5 pr-14">
              <SheetTitle className="sr-only">
                Session {sessionDetail?.session_token ?? ''} details
              </SheetTitle>
              <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-[#9296a0]">
                <Activity className="w-3.5 h-3.5" /> Session
              </div>
              <h2 className="mt-1 font-mono text-sm font-semibold text-neutral-900 break-all">
                {sessionDetail?.session_token ?? '—'}
              </h2>
              {sessionDetail?.workflow?.name && (
                <p className="mt-1 text-xs text-[#616675]">{sessionDetail.workflow.name}</p>
              )}
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${detailStatus.bg} ${detailStatus.text}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  {detailStatus.label}
                </span>
                {verdict.show && (
                  <span
                    title="Verification result"
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${verdict.bg} ${verdict.text}`}
                  >
                    <VerdictIcon className="w-3.5 h-3.5" />
                    {verdict.label}
                  </span>
                )}
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {loading || !sessionDetail ? (
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </div>
              ) : (
                <div className="space-y-7">
                  {/* Stat tiles */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-[#e7e8ea] bg-neutral-50/60 p-3">
                      <div className="flex items-center gap-1 text-[11px] text-[#9296a0]">
                        <Layers className="w-3 h-3" /> Progress
                      </div>
                      <div className="mt-1 text-base font-semibold text-neutral-900 tabular-nums">
                        {totalSteps ? completedSteps : '—'}
                        <span className="text-sm font-normal text-[#9296a0]">/{totalSteps || '—'}</span>
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#e7e8ea] bg-neutral-50/60 p-3">
                      <div className="flex items-center gap-1 text-[11px] text-[#9296a0]">
                        <RefreshCw className="w-3 h-3" /> Re-opens
                      </div>
                      <div className="mt-1 text-base font-semibold text-neutral-900 tabular-nums">
                        {sessionDetail.start_count ?? '—'}
                      </div>
                    </div>
                    <div className="rounded-xl border border-[#e7e8ea] bg-neutral-50/60 p-3">
                      <div className="flex items-center gap-1 text-[11px] text-[#9296a0]">
                        <Hash className="w-3 h-3" /> Steps
                      </div>
                      <div className="mt-1 text-base font-semibold text-neutral-900 tabular-nums">
                        {sessionDetail.steps?.length ?? 0}
                      </div>
                    </div>
                  </div>

                  {/* Steps */}
                  {sessionDetail.steps && sessionDetail.steps.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#9296a0]">Steps</h4>
                      <div className="space-y-2">
                        {sessionDetail.steps.map((step) => {
                          const ss = statusStyle(step.status)
                          return (
                            <div
                              key={step.step_index}
                              className="flex items-center gap-3 rounded-xl border border-[#e7e8ea] px-3 py-2.5"
                            >
                              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-neutral-50 text-base">
                                {MODULE_ICONS[step.module_slug] || '📋'}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-neutral-800 capitalize truncate">
                                    {formatSlug(step.module_slug)}
                                  </span>
                                  {step.retry_count > 0 && (
                                    <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-50 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
                                      <RotateCcw className="w-2.5 h-2.5" /> {step.retry_count}
                                    </span>
                                  )}
                                </div>
                                <div className="mt-0.5 text-[11px] text-[#9296a0]">
                                  {step.completed_at
                                    ? `Completed ${relativeTime(step.completed_at)}`
                                    : step.started_at
                                    ? `Started ${relativeTime(step.started_at)}`
                                    : 'Not started'}
                                </div>
                              </div>
                              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${ss.bg} ${ss.text}`}>
                                {ss.label}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* Event timeline */}
                  {sessionDetail.events && sessionDetail.events.length > 0 && (
                    <div>
                      <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-[#9296a0]">
                        Event Timeline
                      </h4>
                      <ol className="relative ml-1 space-y-5 border-l border-[#e7e8ea] pl-5">
                        {sessionDetail.events.map((event, idx) => (
                          <li key={idx} className="relative">
                            <span className="absolute -left-[1.5625rem] top-1 grid h-3 w-3 place-items-center">
                              <span className="h-3 w-3 rounded-full border-2 border-white bg-[#0019FF] shadow-[0_0_0_1px_rgba(0,25,255,0.25)]" />
                            </span>
                            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                              <span className="text-sm font-medium capitalize text-neutral-800">
                                {event.event_type.replace(/_/g, ' ')}
                              </span>
                              {event.module_slug && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] capitalize text-[#616675]">
                                  {MODULE_ICONS[event.module_slug] || ''} {formatSlug(event.module_slug)}
                                </span>
                              )}
                            </div>
                            <div className="mt-0.5 text-[11px] text-[#9296a0]">
                              {new Date(event.created_at).toLocaleString()}
                            </div>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              )}
            </div>
          </>
        )
      })()}
    </SheetContent>
  </Sheet>
)

export default SessionDetailSheet
