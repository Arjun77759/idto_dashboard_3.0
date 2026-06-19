import { motion } from 'framer-motion'

import { Skeleton } from '@/components/ui/skeleton'
import { useConfiguredApis } from '@/hooks/useConfiguredApis'
import { cn } from '@/lib/utils'
import configuredApisIcon from '@/assets/figma/billing/reports.svg'

type ConfiguredApisCardProps = {
  selectedApiName: string
  allApisValue: string
  onSelectApiName: (apiName: string) => void
}

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
})

const formatCurrency = (value?: number | null) =>
  value === null || value === undefined ? 'N/A' : currencyFormatter.format(value)

const formatApiName = (value: string) =>
  value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (character) => character.toUpperCase())

const ConfiguredApisCard = ({ selectedApiName, allApisValue, onSelectApiName }: ConfiguredApisCardProps) => {
  const { data, loading, error } = useConfiguredApis()
  const apis = data?.apis ?? []

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="relative w-full rounded-[22px] border border-[#e5e5e5]/80 bg-[#195cdf]/[0.04] xl:w-[340px] xl:shrink-0"
    >
      <div className="flex flex-col gap-2 p-[21px]">
        <div className="flex items-center gap-2.5 pb-2">
          <div className="grid size-8 place-items-center rounded-[14px] bg-[#0019ff]/[0.06]">
            <img src={configuredApisIcon} alt="" className="size-4" />
          </div>
          <div>
            <p className="text-[14px] font-semibold leading-[21px] text-[#171717]">Configured APIs</p>
            <p className="text-[12px] leading-[17.25px] text-[#737373]">Per-call pricing across your stack</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelectApiName(allApisValue)}
          className={cn(
            'flex h-[41px] w-full items-center justify-between gap-3 rounded-[14px] px-3 py-2.5 text-left text-[12px] font-medium transition-colors',
            selectedApiName === allApisValue
              ? 'bg-[#0019ff]/[0.06] text-[#0019ff]'
              : 'bg-white/70 text-[#737373] hover:bg-white'
          )}
        >
          <span>All APIs</span>
          <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold leading-[16.5px] text-[#404040] shadow-[0_0_0_1px_#e5e5e5]">
            {apis.length}
          </span>
        </button>

        <div className="h-[360px] max-h-[360px] overflow-hidden rounded-[14px]">
          {loading ? (
            <div className="flex h-full flex-col gap-3 overflow-hidden p-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <Skeleton key={`configured-api-loading-${index}`} className="h-12 w-full" />
              ))}
            </div>
          ) : error ? (
            <div className="flex min-h-[180px] items-center justify-center p-4 text-center text-sm text-red-600">
              {error}
            </div>
          ) : apis.length ? (
            <div className="h-full overflow-y-auto">
              {apis.map((api) => {
                const isSelected = selectedApiName === api.api_name
                return (
                  <button
                    key={api.api_name}
                    type="button"
                    onClick={() => onSelectApiName(api.api_name)}
                    className={cn(
                      'flex min-h-[55.75px] w-full items-center justify-between gap-3 rounded-[14px] px-3 py-2.5 text-left transition-colors',
                      isSelected ? 'bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]' : 'hover:bg-white/70'
                    )}
                  >
                    <span className="min-w-0">
                      <span
                        className={cn(
                          'block truncate text-[12px] font-medium leading-[18.75px]',
                          isSelected ? 'text-[#0019ff]' : 'text-[#171717]'
                        )}
                        title={api.display_name || api.api_name}
                      >
                        {api.display_name || formatApiName(api.api_name)}
                      </span>
                      <span className="block text-[10px] leading-[16.5px] text-[#737373]">
                        {api.total_calls.toLocaleString('en-IN')} calls
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-[12px] font-semibold leading-[18.75px] text-[#171717]">
                        {formatCurrency(api.current_price)}
                      </span>
                      <span className="block text-[10px] leading-[15.75px] text-[#737373]">
                        {api.pricing_note || 'per call'}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="flex min-h-[180px] items-center justify-center p-4 text-center text-sm text-[#9296a0]">
              No configured APIs found
            </div>
          )}
        </div>
      </div>
    </motion.aside>
  )
}

export default ConfiguredApisCard
