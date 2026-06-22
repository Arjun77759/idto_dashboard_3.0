import { motion } from 'framer-motion'
import { Activity, Layers, Clock, RefreshCw, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { outcomeStyle } from '@/lib/workflowOutcome'
import { inr, relativeTime, statusStyle } from './analyticsFormat'
import type { MerchantSessionListItem } from '@/api/workflowApi'

interface RecentSessionsCardProps {
  sessions: MerchantSessionListItem[]
  selectedSessionId: string | null
  onSelect: (id: string) => void
}

const RecentSessionsCard = ({ sessions, selectedSessionId, onSelect }: RecentSessionsCardProps) => (
  <Card className="rounded-2xl border-[#e7e8ea]">
    <CardHeader className="flex flex-row items-start justify-between gap-4">
      <div>
        <CardTitle className="text-base flex items-center gap-2.5">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6e8ff] text-[#0019FF]">
            <Activity className="h-4 w-4" />
          </span>
          Recent Sessions
        </CardTitle>
        <CardDescription className="pl-[42px] -mt-1">
          Click a session to view its details and event timeline
        </CardDescription>
      </div>
      {sessions.length > 0 && (
        <Badge variant="secondary" className="shrink-0">
          {sessions.length} {sessions.length === 1 ? 'session' : 'sessions'}
        </Badge>
      )}
    </CardHeader>
    <CardContent className="p-0">
      {sessions.length === 0 ? (
        <div className="text-center py-12 text-[#9296a0]">
          <Activity className="w-10 h-10 mx-auto mb-3 text-[#c8cacf]" />
          <p className="text-sm">No sessions found</p>
        </div>
      ) : (
        <ul className="divide-y divide-[#e7e8ea]">
          {sessions.map((s, i) => {
            const st = statusStyle(s.status)
            const verdict = outcomeStyle(s.outcome)
            const active = selectedSessionId === s.id
            return (
              <motion.li
                key={s.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
              >
                <button
                  type="button"
                  onClick={() => onSelect(s.id)}
                  className={`group flex w-full items-center gap-4 px-6 py-3.5 text-left transition-colors hover:bg-neutral-50 focus:outline-none focus-visible:bg-neutral-50 ${
                    active ? 'bg-[#e6e8ff]/60' : ''
                  }`}
                >
                  <span className="relative flex h-2.5 w-2.5 shrink-0">
                    {s.status === 'in_progress' && (
                      <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 ${st.dot}`} />
                    )}
                    <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${st.dot}`} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium text-neutral-800 truncate">
                        {s.session_token?.slice(0, 16)}…
                      </span>
                      <span className={`hidden sm:inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${st.bg} ${st.text}`}>
                        {st.label}
                      </span>
                      {verdict.show && (
                        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${verdict.bg} ${verdict.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${verdict.dot}`} />
                          {verdict.label}
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-[#9296a0]">
                      <span className="inline-flex items-center gap-1">
                        <Layers className="w-3 h-3" /> Step {s.current_step_index}
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {relativeTime(s.created_at)}
                      </span>
                      {s.start_count > 1 && (
                        <span className="inline-flex items-center gap-1 text-amber-600">
                          <RefreshCw className="w-3 h-3" /> {s.start_count}× re-opened
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="hidden shrink-0 text-right sm:block">
                    <div className="text-sm font-semibold text-neutral-800 tabular-nums">
                      {inr(s.estimated_cost)}
                    </div>
                    <div className="text-[11px] text-[#9296a0]">cost</div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 shrink-0 text-[#c8cacf] transition-all group-hover:translate-x-0.5 group-hover:text-[#616675] ${
                      active ? 'text-[#0019FF]' : ''
                    }`}
                  />
                </button>
              </motion.li>
            )
          })}
        </ul>
      )}
    </CardContent>
  </Card>
)

export default RecentSessionsCard
