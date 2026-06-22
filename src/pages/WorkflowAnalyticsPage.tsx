import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, TrendingUp, TrendingDown, Layers, Clock, AlertTriangle,
  RefreshCw, Wallet, Gauge, ArrowDownRight, ShieldCheck,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  useMerchantAnalytics,
  useMerchantSessionDetail,
} from '@/hooks/useMerchantWorkflowAnalytics'
import { useMerchantWorkflowAssignments } from '@/hooks/useMerchantWorkflows'
import { MODULE_ICONS, formatSlug } from '@/lib/workflowModules'
import { OUTCOME_STYLES, VERDICT_ORDER } from '@/lib/workflowOutcome'
import { inr, VERDICT_ICONS } from '@/components/analytics/analyticsFormat'
import { KpiTile, SectionTitle } from '@/components/analytics/AnalyticsPrimitives'
import SessionDetailSheet from '@/components/analytics/SessionDetailSheet'
import RecentSessionsCard from '@/components/analytics/RecentSessionsCard'
import WorkflowFilterSelect, { ALL_WORKFLOWS, type WorkflowOption } from '@/components/analytics/WorkflowFilterSelect'

const WorkflowAnalyticsPageHeader = () => (
  <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
    <BarChart3 className="w-[22px] h-[22px] text-[#131b31]" />
    <div className="flex flex-col">
      <p className="font-medium leading-[1.4] relative text-lg sm:text-[20px] text-[#131b31] tracking-[-0.2px]">
        Workflow Analytics
      </p>
      <p className="font-normal text-[12px] text-[#9296a0] tracking-[-0.12px]">
        Track performance metrics for your verification workflows.
      </p>
    </div>
  </div>
)

const WorkflowAnalyticsPage = () => {
  const [workflowId, setWorkflowId] = useState<string>(ALL_WORKFLOWS)
  const { data: assignments } = useMerchantWorkflowAssignments()
  const { data: analytics, loading, error } = useMerchantAnalytics(
    workflowId === ALL_WORKFLOWS ? undefined : workflowId,
  )
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)
  const { data: sessionDetail, loading: isDetailLoading } = useMerchantSessionDetail(selectedSessionId)

  const workflowOptions: WorkflowOption[] = useMemo(
    () =>
      assignments
        .map((a) => a.workflow_template)
        .filter((t): t is NonNullable<typeof t> => t != null)
        .map((t) => ({ id: t.id, name: t.name })),
    [assignments],
  )

  const totalSessions = analytics?.total_sessions ?? 0
  const completed = analytics?.completed ?? 0
  const abandoned = analytics?.abandoned ?? 0
  const inProgress = analytics?.in_progress ?? 0
  const expired = analytics?.expired ?? 0

  // Verification verdict (RESULT) — distinct from lifecycle status.
  const ob = analytics?.outcome_breakdown
  const verdictSummary = VERDICT_ORDER.map((key) => ({
    key,
    value: ob?.[key] ?? 0,
    Icon: VERDICT_ICONS[key],
    ...OUTCOME_STYLES[key],
  }))
  const totalVerdicts = verdictSummary.reduce((sum, v) => sum + v.value, 0)
  const completionRate = totalSessions > 0 ? (completed / totalSessions) * 100 : 0
  const abandonmentRate = totalSessions > 0 ? (abandoned / totalSessions) * 100 : 0
  const avgTotalTime = analytics?.avg_total_time_seconds ?? 0
  const sessionsWithReopens = analytics?.sessions_with_reopens ?? 0
  const timePerStep = analytics?.time_per_step ?? []
  const errorDist = analytics?.error_distribution ?? []
  const sessions = analytics?.sessions ?? []
  const totalEstimatedCost = analytics?.total_estimated_cost ?? 0
  const avgCostPerSession = totalSessions > 0 ? totalEstimatedCost / totalSessions : 0
  const funnel = analytics?.funnel ?? []

  // Derived funnel insights
  const funnelFirstStarted = funnel[0]?.started ?? 0
  const funnelLastCompleted = funnel.length ? funnel[funnel.length - 1].completed : 0
  const overallConversion = funnelFirstStarted > 0 ? (funnelLastCompleted / funnelFirstStarted) * 100 : 0
  const totalErrors = errorDist.reduce((a, e) => a + (e.error_count ?? 0), 0)

  // Biggest step-to-step drop-off
  let biggestDrop = { from: '', pct: 0 }
  for (let i = 0; i < funnel.length - 1; i++) {
    const a = funnel[i].started || 0
    const b = funnel[i + 1].started || 0
    const pct = a > 0 ? ((a - b) / a) * 100 : 0
    if (pct > biggestDrop.pct) biggestDrop = { from: funnel[i].module_slug, pct }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start p-6 relative rounded-2xl w-full"
    >
      <div className="flex flex-wrap items-center justify-between gap-3 w-full">
        <WorkflowAnalyticsPageHeader />
        <WorkflowFilterSelect
          options={workflowOptions}
          value={workflowId}
          onChange={setWorkflowId}
        />
      </div>

      {loading ? (
        <div className="space-y-6 w-full">
          <Skeleton className="h-28 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-72 w-full rounded-xl" />
            <Skeleton className="h-72 w-full rounded-xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
      ) : error ? (
        <Card className="w-full rounded-2xl border-[#e7e8ea]">
          <CardContent className="py-16 text-center">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-red-300" />
            <h3 className="text-lg font-medium text-red-600 mb-2">Failed to load analytics.</h3>
            <p className="text-sm text-[#9296a0]">
              Something went wrong while loading your workflow analytics. Please refresh the page or try again later.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6 w-full">
          {/* ── Premium KPI hero band ───────────────────────────── */}
          <Card className="overflow-hidden rounded-2xl border-[#e7e8ea]">
            <div className="grid grid-cols-2 divide-x divide-y divide-[#e7e8ea] md:grid-cols-3 xl:grid-cols-6 xl:divide-y-0">
              <KpiTile label="Total Sessions" value={totalSessions.toLocaleString()} icon={Layers} accent />
              <KpiTile
                label="Completion"
                value={`${Math.round(completionRate)}%`}
                icon={Gauge}
                sub={`${completed.toLocaleString()} completed`}
              />
              <KpiTile
                label="Abandonment"
                value={`${Math.round(abandonmentRate)}%`}
                icon={TrendingDown}
                sub={`${abandoned.toLocaleString()} abandoned`}
              />
              <KpiTile
                label="Avg Time"
                value={avgTotalTime > 0 ? `${avgTotalTime.toFixed(1)}s` : '—'}
                icon={Clock}
                sub="per session"
              />
              <KpiTile
                label="Total Cost"
                value={inr(totalEstimatedCost)}
                icon={Wallet}
                sub={`${inr(avgCostPerSession)} / session`}
              />
              <KpiTile
                label="Re-opens"
                value={sessionsWithReopens.toLocaleString()}
                icon={RefreshCw}
                sub="sessions resumed"
              />
            </div>
          </Card>

          {totalSessions === 0 ? (
            <Card className="rounded-2xl border-[#e7e8ea]">
              <CardContent className="py-16 text-center">
                <BarChart3 className="w-16 h-16 mx-auto mb-4 text-[#c8cacf]" />
                <h3 className="text-lg font-medium text-[#616675] mb-2">No Analytics Data Yet</h3>
                <p className="text-sm text-[#9296a0]">
                  Sessions will start appearing here once users begin your verification workflows.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* ── Verification Result (verdict) summary ───────── */}
              <Card className="rounded-2xl border-[#e7e8ea]">
                <SectionTitle
                  icon={ShieldCheck}
                  title="Verification Result"
                  desc="Final verdict across completed sessions — distinct from lifecycle status"
                />
                <CardContent>
                  {totalVerdicts > 0 ? (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                      {verdictSummary.map((v) => {
                        const pct = totalVerdicts > 0 ? (v.value / totalVerdicts) * 100 : 0
                        return (
                          <div key={v.key} className={`rounded-xl border ${v.ring} ${v.bg} p-4`}>
                            <div className="flex items-center justify-between">
                              <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider ${v.text}`}>
                                <v.Icon className="h-3.5 w-3.5" /> {v.label}
                              </span>
                              <span className="text-xs font-medium text-[#9296a0] tabular-nums">{pct.toFixed(0)}%</span>
                            </div>
                            <div className="mt-2 text-[26px] font-semibold leading-none tracking-tight text-[#131B31] tabular-nums">
                              {v.value.toLocaleString()}
                            </div>
                            <div className="mt-3 h-1.5 rounded-full bg-white/70 overflow-hidden">
                              <motion.div
                                className={`h-full rounded-full ${v.dot}`}
                                initial={{ width: 0 }}
                                animate={{ width: `${pct}%` }}
                                transition={{ duration: 0.8 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-[#9296a0]">
                      <p className="text-sm">No verdicts yet — results appear once sessions complete.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* ── Funnel │ (Session Status / Time Per Step) ── */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                <Card className="rounded-2xl border-[#e7e8ea]">
                  <SectionTitle icon={BarChart3} title="Step Funnel" desc="Started vs completed per module" />
                  <CardContent>
                    {funnel.length > 0 ? (
                      <>
                        <div className="mb-5 flex items-center gap-6 rounded-xl bg-neutral-50/70 px-4 py-3">
                          <div>
                            <div className="text-[11px] uppercase tracking-wider text-[#9296a0]">Overall conversion</div>
                            <div className="text-xl font-semibold text-[#131B31] tabular-nums">
                              {overallConversion.toFixed(0)}%
                            </div>
                          </div>
                          {biggestDrop.from && (
                            <div className="border-l border-[#e7e8ea] pl-6">
                              <div className="text-[11px] uppercase tracking-wider text-[#9296a0]">Biggest drop-off</div>
                              <div className="flex items-center gap-1.5 text-sm font-medium text-red-600">
                                <ArrowDownRight className="h-4 w-4" />
                                {biggestDrop.pct.toFixed(0)}% after {formatSlug(biggestDrop.from)}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="space-y-4">
                          {(() => {
                            const barMax = Math.max(funnel[0]?.started || 1, 1)
                            return funnel.map((step, i) => {
                              const startedPct = (step.started / barMax) * 100
                              const completedPct = step.completed > 0 ? (step.completed / step.started) * 100 : 0
                              const icon = MODULE_ICONS[step.module_slug] || '📋'
                              return (
                                <div key={step.step_index} className="space-y-1.5">
                                  <div className="flex justify-between text-sm">
                                    <span className="font-medium flex items-center gap-1.5 capitalize">
                                      {icon} Step {step.step_index + 1}: {formatSlug(step.module_slug)}
                                    </span>
                                    <span className="text-[#616675] tabular-nums">{step.completed} / {step.started}</span>
                                  </div>
                                  <div className="relative h-7 rounded-lg bg-neutral-100 overflow-hidden">
                                    <motion.div
                                      className="absolute inset-y-0 left-0 rounded-lg bg-[#0019FF]/20"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${startedPct}%` }}
                                      transition={{ duration: 0.8, delay: i * 0.08 }}
                                    />
                                    <motion.div
                                      className="absolute inset-y-0 left-0 rounded-lg bg-[#0019FF]"
                                      initial={{ width: 0 }}
                                      animate={{ width: `${(step.completed / barMax) * 100}%` }}
                                      transition={{ duration: 0.8, delay: i * 0.12 }}
                                    />
                                    <span className="absolute inset-y-0 right-2.5 flex items-center text-[11px] font-semibold text-[#616675] tabular-nums">
                                      {completedPct.toFixed(0)}%
                                    </span>
                                  </div>
                                </div>
                              )
                            })
                          })()}
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-8 text-[#9296a0]"><p>No funnel data available yet</p></div>
                    )}
                  </CardContent>
                </Card>

                {/* Right column: Session Status stacked above Time Per Step */}
                <div className="space-y-6">
                <Card className="rounded-2xl border-[#e7e8ea]">
                  <SectionTitle icon={TrendingUp} title="Session Status" desc="Breakdown of all sessions by status" />
                  <CardContent>
                    <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-around">
                      <div className="relative h-40 w-40 shrink-0">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" fill="none" stroke="#f1f1f3" strokeWidth="9" />
                          <motion.circle
                            cx="50" cy="50" r="40" fill="none" stroke="#0019FF"
                            strokeWidth="9" strokeLinecap="round"
                            strokeDasharray="0 251.2"
                            animate={{ strokeDasharray: `${(completionRate / 100) * 251.2} 251.2` }}
                            transition={{ duration: 1.4, ease: 'easeOut' }}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold tracking-tight text-[#131B31] tabular-nums">
                            {Math.round(completionRate)}%
                          </span>
                          <span className="text-[11px] uppercase tracking-wider text-[#9296a0]">completed</span>
                        </div>
                      </div>
                      <div className="w-full max-w-[220px] space-y-2.5">
                        {[
                          { label: 'Completed', value: completed, color: 'bg-emerald-500' },
                          { label: 'In Progress', value: inProgress, color: 'bg-amber-500' },
                          { label: 'Abandoned', value: abandoned, color: 'bg-red-500' },
                          { label: 'Expired', value: expired, color: 'bg-neutral-400' },
                        ].map((row) => {
                          const pct = totalSessions > 0 ? (row.value / totalSessions) * 100 : 0
                          return (
                            <div key={row.label} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-neutral-50">
                              <span className={`h-2.5 w-2.5 rounded-full ${row.color}`} />
                              <span className="flex-1 text-sm text-[#616675]">{row.label}</span>
                              <span className="text-sm font-semibold text-[#131B31] tabular-nums">{row.value}</span>
                              <span className="w-10 text-right text-xs text-[#9296a0] tabular-nums">{pct.toFixed(0)}%</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="rounded-2xl border-[#e7e8ea]">
                  <SectionTitle icon={Clock} title="Time Per Step" desc="Average time spent on each module (seconds)" />
                  <CardContent>
                    {timePerStep.length > 0 ? (
                      <div className="space-y-3.5">
                        {(() => {
                          const max = Math.max(...timePerStep.map((s) => s.avg_seconds), 1)
                          return timePerStep.map((step, i) => (
                            <div key={step.module_slug} className="space-y-1.5">
                              <div className="flex justify-between text-sm">
                                <span className="capitalize text-[#616675]">{formatSlug(step.module_slug)}</span>
                                <span className="font-medium tabular-nums">{step.avg_seconds.toFixed(1)}s</span>
                              </div>
                              <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full bg-gradient-to-r from-[#0019FF] to-[#5b6bff]"
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min((step.avg_seconds / max) * 100, 100)}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.1 }}
                                />
                              </div>
                            </div>
                          ))
                        })()}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-[#9296a0]"><p>No timing data yet</p></div>
                    )}
                  </CardContent>
                </Card>
                </div>
              </div>

              {/* ── Row 3: Error Distribution ───────────────────── */}
              {errorDist.length > 0 && (
                <Card className="rounded-2xl border-[#e7e8ea]">
                  <SectionTitle
                    icon={AlertTriangle}
                    title="Error Distribution"
                    desc={`${totalErrors} error${totalErrors === 1 ? '' : 's'} across all sessions`}
                  />
                  <CardContent>
                    <div className="space-y-2">
                      {errorDist.map((err) => {
                        const pct = totalErrors > 0 ? ((err.error_count ?? 0) / totalErrors) * 100 : 0
                        return (
                          <div key={`${err.module_slug ?? ''}-${err.error_code ?? ''}`} className="flex items-center gap-3 rounded-xl border border-[#e7e8ea] px-4 py-2.5">
                            <span className="text-base">{MODULE_ICONS[err.module_slug ?? ''] || '⚠️'}</span>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium capitalize text-neutral-800">
                                  {formatSlug(err.module_slug ?? '')}
                                </span>
                                <Badge variant="outline" className="text-[11px] border-[#e7e8ea]">{err.error_code || 'Unknown'}</Badge>
                              </div>
                              <div className="mt-1.5 h-1.5 rounded-full bg-neutral-100 overflow-hidden">
                                <div className="h-full rounded-full bg-red-400" style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                            <span className="text-sm font-semibold text-[#131B31] tabular-nums">{err.error_count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* ── Row 4: Recent Sessions ──────────────────────── */}
              <RecentSessionsCard
                sessions={sessions}
                selectedSessionId={selectedSessionId}
                onSelect={setSelectedSessionId}
              />
            </>
          )}
        </div>
      )}

      {/* ── Session Detail — slide-in side panel ──────────── */}
      <SessionDetailSheet
        open={!!selectedSessionId}
        onClose={() => setSelectedSessionId(null)}
        sessionDetail={sessionDetail}
        loading={isDetailLoading}
      />
    </motion.div>
  )
}

export default WorkflowAnalyticsPage
