import { motion } from 'framer-motion'
import { ListChecks } from 'lucide-react'

import { Skeleton } from '@/components/ui/skeleton'
import { useConfiguredApis } from '@/hooks/useConfiguredApis'
import { cn } from '@/lib/utils'

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
      className="bg-white border border-[#e7e8ea] relative rounded-2xl w-full lg:w-[281px] lg:shrink-0 lg:self-start"
    >
      <div className="flex flex-col gap-4 p-4 sm:p-6">
        <div className="flex items-center gap-2">
          <ListChecks className="size-5 text-[#131b31]" />
          <p className="text-[16px] font-normal leading-[1.4] text-[#131b31]">Configured APIs</p>
        </div>

        <button
          type="button"
          onClick={() => onSelectApiName(allApisValue)}
          className={cn(
            'flex w-full items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left text-xs transition-colors',
            selectedApiName === allApisValue
              ? 'border-[#8a95ff] bg-[#e6e8ff] text-[#0019ff]'
              : 'border-[#e7e8ea] bg-[#f7f7f8] text-[#616675] hover:border-[#c8cacf]'
          )}
        >
          <span>All APIs</span>
          <span>{apis.length}</span>
        </button>

        <div className="h-[470px] overflow-hidden rounded-md border border-[#e7e8ea]">
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
                      'flex w-full items-start justify-between gap-3 border-b border-[#e7e8ea] px-3 py-3 text-left transition-colors last:border-b-0',
                      isSelected ? 'bg-[#e6e8ff]' : 'bg-white hover:bg-[#f7f7f8]'
                    )}
                  >
                    <span className="min-w-0">
                      <span
                        className={cn(
                          'block truncate text-sm font-normal',
                          isSelected ? 'text-[#0019ff]' : 'text-[#616675]'
                        )}
                        title={api.display_name || api.api_name}
                      >
                        {api.display_name || formatApiName(api.api_name)}
                      </span>
                      <span className="mt-1 block text-[11px] text-[#9296a0]">
                        {api.total_calls.toLocaleString('en-IN')} calls
                      </span>
                    </span>
                    <span className="shrink-0 text-right">
                      <span className="block text-sm font-normal text-[#131b31]">
                        {formatCurrency(api.current_price)}
                      </span>
                      <span className="mt-1 block text-[11px] text-[#9296a0]">
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
