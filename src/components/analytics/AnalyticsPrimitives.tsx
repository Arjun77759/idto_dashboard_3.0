import type { FC } from 'react'
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card'

/** Premium KPI tile used in the analytics hero band. */
export const KpiTile: FC<{
  label: string
  value: string | number
  icon: FC<{ className?: string }>
  sub?: string
  accent?: boolean
}> = ({ label, value, icon: Icon, sub, accent }) => (
  <div className="relative flex flex-col justify-between p-5">
    {accent && <span className="absolute left-0 top-5 h-7 w-1 rounded-r-full bg-[#0019FF]" />}
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-medium uppercase tracking-wider text-[#9296a0]">{label}</span>
      <Icon className={`h-4 w-4 ${accent ? 'text-[#0019FF]' : 'text-[#c8cacf]'}`} />
    </div>
    <div className="mt-3">
      <div className="text-[26px] font-semibold leading-none tracking-tight text-[#131B31] tabular-nums">
        {value}
      </div>
      {sub && <div className="mt-1.5 text-xs text-[#9296a0]">{sub}</div>}
    </div>
  </div>
)

/** Consistent premium section header with an icon chip. */
export const SectionTitle: FC<{
  icon: FC<{ className?: string }>
  title: string
  desc?: string
}> = ({ icon: Icon, title, desc }) => (
  <CardHeader>
    <CardTitle className="text-base flex items-center gap-2.5">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6e8ff] text-[#0019FF]">
        <Icon className="h-4 w-4" />
      </span>
      {title}
    </CardTitle>
    {desc && <CardDescription className="pl-[42px] -mt-1">{desc}</CardDescription>}
  </CardHeader>
)
