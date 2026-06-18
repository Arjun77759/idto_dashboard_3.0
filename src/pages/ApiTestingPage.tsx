import { motion } from 'framer-motion'
import {
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  FileText,
  Lock,
  Pin,
  Plus,
  Search,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ApiConfiguration from '@/components/api-testing/ApiConfiguration'
import ApiResponse from '@/components/api-testing/ApiResponse'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { ApiEndpoint } from '@/config/apiEndpoints'
import { useApiSubscriptions } from '@/hooks/useApiSubscriptions'
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useOpenApiEndpoints } from '@/hooks/useOpenApiEndpoints'
import { cn } from '@/lib/utils'

const API_DOCS_URL = 'https://idtoai.readme.io/reference/idtoai-verification-apis'

const formatCredits = (value?: number | null) => {
  if (value === null || value === undefined) return '0'
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

const normalizeApiIdentifier = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[/-]+/g, '_')
    .replace(/\s+/g, '_')

const SUBSCRIPTION_NAME_ALIASES: Record<string, string[]> = {
  bank_account: ['bank_verification'],
  bank_account_v2: ['bank_verification'],
  bank_account_pennyless: ['bank_verification_pennyless'],
  bank_statement_pdf_complete_upload: ['bank_statement_pdf_complete'],
  cin_mca: ['cin_mca_verification'],
  gst: ['gst_verification'],
  pan: ['pan_verification'],
  uan: ['uan_verification'],
  voter: ['voter_verification'],
  voter_id: ['voter_verification'],
}

const getApiIdAliases = (api: ApiEndpoint) => {
  const id = normalizeApiIdentifier(api.id)
  const name = normalizeApiIdentifier(api.name)
  const aliases = new Set([id, name])

  aliases.add(id.replace(/^v\d+_verify_/, ''))
  aliases.add(id.replace(/^verify_/, ''))
  aliases.add(name.replace(/_v\d+$/, ''))

  return aliases
}

const mapSubscriptionNameToApiIds = (apiName: string, apiEndpoints: ApiEndpoint[]): string[] => {
  const normalizedName = normalizeApiIdentifier(apiName)
  const subscriptionAliases = new Set([
    normalizedName,
    ...(SUBSCRIPTION_NAME_ALIASES[normalizedName] || []),
  ])
  const matches = new Set<string>()

  apiEndpoints.forEach((api) => {
    const apiAliases = getApiIdAliases(api)
    if (Array.from(subscriptionAliases).some((alias) => apiAliases.has(alias))) {
      matches.add(api.id)
    }
  })

  if (matches.size > 0) return Array.from(matches)

  const fuzzyMatch = apiEndpoints.find((api) => {
    const firstToken = normalizedName.split('_')[0]
    const apiNameLower = api.name.toLowerCase()
    const apiIdLower = api.id.toLowerCase()
    return apiNameLower.includes(firstToken) || apiIdLower.includes(firstToken)
  })

  return fuzzyMatch ? [fuzzyMatch.id] : []
}

const getCategoryLabel = (category: ApiEndpoint['category']) =>
  category.replace(/\s+Verification$/i, '').toUpperCase()

const getShortDescription = (api: ApiEndpoint) => {
  const description = api.shortDescription || api.longDescription
  if (description.length <= 88) return description
  return `${description.slice(0, 85).trim()}...`
}

type MarketplaceTab = 'All' | 'Enabled' | 'Pinned'

const ApiTestingPage = () => {
  const navigate = useNavigate()
  const { data: usageData, loading: usageLoading, error: usageError } = useMonthlyUsage({ forceBackend: true })
  const { data: apiEndpoints, loading: endpointsLoading, error: endpointsError } = useOpenApiEndpoints()
  const { data: subscribedApis, loading: subscriptionsLoading, error: subscriptionsError } = useApiSubscriptions({ forceBackend: true })
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<MarketplaceTab>('All')
  const [savedApis, setSavedApis] = useState<string[]>([])
  const [selectedApi, setSelectedApi] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showSampleResponse, setShowSampleResponse] = useState(false)

  const subscribedApiIds = useMemo(() => {
    if (!subscribedApis || !apiEndpoints || subscribedApis.length === 0) return new Set<string>()
    return new Set(subscribedApis.flatMap((subscription) => mapSubscriptionNameToApiIds(subscription.api_name, apiEndpoints)))
  }, [subscribedApis, apiEndpoints])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('idto-saved-api-testing')
    if (!stored) return

    try {
      const parsed = JSON.parse(stored)
      setSavedApis(Array.isArray(parsed) ? parsed : [])
    } catch {
      setSavedApis([])
    }
  }, [])

  useEffect(() => {
    if (subscribedApiIds.size === 0) return

    setSavedApis((current) => [...new Set([...current, ...Array.from(subscribedApiIds)])])
  }, [subscribedApiIds])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('idto-saved-api-testing', JSON.stringify(savedApis))
  }, [savedApis])

  const enabledApis = useMemo(
    () => (apiEndpoints || []).filter((api) => subscribedApiIds.has(api.id)),
    [apiEndpoints, subscribedApiIds]
  )

  const pinnedApis = useMemo(
    () => (apiEndpoints || []).filter((api) => savedApis.includes(api.id)),
    [apiEndpoints, savedApis]
  )

  const marketplaceApis = useMemo(() => {
    if (!apiEndpoints) return []

    const query = searchQuery.trim().toLowerCase()
    return apiEndpoints
      .filter((api) => {
        const matchesSearch =
          !query ||
          api.name.toLowerCase().includes(query) ||
          api.id.toLowerCase().includes(query) ||
          api.shortDescription.toLowerCase().includes(query) ||
          api.category.toLowerCase().includes(query)
        const matchesTab =
          activeTab === 'All' ||
          (activeTab === 'Enabled' && subscribedApiIds.has(api.id)) ||
          (activeTab === 'Pinned' && savedApis.includes(api.id))

        return matchesSearch && matchesTab
      })
      .sort((a, b) => {
        const aEnabled = subscribedApiIds.has(a.id)
        const bEnabled = subscribedApiIds.has(b.id)
        const aPinned = savedApis.includes(a.id)
        const bPinned = savedApis.includes(b.id)

        if (aEnabled !== bEnabled) return aEnabled ? -1 : 1
        if (aPinned !== bPinned) return aPinned ? -1 : 1
        return a.name.localeCompare(b.name)
      })
  }, [activeTab, apiEndpoints, savedApis, searchQuery, subscribedApiIds])

  const recommendedApis = useMemo(() => {
    const source = enabledApis.length > 0 ? enabledApis : apiEndpoints || []
    return source.slice(0, 4)
  }, [apiEndpoints, enabledApis])

  const selectedApiData = selectedApi ? apiEndpoints?.find((api) => api.id === selectedApi) : undefined
  const remainingCredits = usageLoading ? '...' : usageError ? 'Unavailable' : `₹${formatCredits(usageData?.balance)}`

  const handleApiRun = (response: any) => {
    setApiResponse(response)
  }

  const handleSelectApi = (apiId: string) => {
    setSelectedApi(apiId)
    setApiResponse(null)
    setShowSampleResponse(false)
    setIsSheetOpen(true)
  }

  const toggleSaveApi = (apiId: string) => {
    setSavedApis((current) => (
      current.includes(apiId) ? current.filter((id) => id !== apiId) : [...current, apiId]
    ))
  }

  const renderEmptyState = () => {
    if (endpointsError || subscriptionsError) {
      return (
        <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 text-center">
          <p className="text-[14px] font-semibold leading-5 text-[#0a121f]">Unable to load APIs</p>
          <p className="max-w-[420px] text-[12px] font-normal leading-5 text-[#5c646f]">
            {endpointsError || subscriptionsError}
          </p>
        </div>
      )
    }

    return (
      <div className="flex min-h-[260px] flex-col items-center justify-center gap-2 text-center">
        <p className="text-[14px] font-semibold leading-5 text-[#0a121f]">No APIs found</p>
        <p className="max-w-[360px] text-[12px] font-normal leading-5 text-[#5c646f]">
          Try a different search term or switch marketplace tabs.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex min-h-full w-full flex-col gap-5 bg-[#fafafb]"
    >
      <div className="flex flex-col gap-[3.769px]">
        <h1 className="text-[30px] font-bold leading-[33.919px] tracking-[-0.7066px] text-[#0a121f]">
          API Marketplace
        </h1>
        <p className="text-[14px] font-normal leading-[18.844px] text-[#5b6472]">
          Discover, pin and request the APIs your business needs.
        </p>
      </div>

      <section className="overflow-hidden rounded-[20.728px] border border-[#e0e5eb] bg-[linear-gradient(134.74deg,#345fcf_0%,#01b7bd_100%)] p-[31px] shadow-[0_0.942px_1.884px_rgba(8,21,44,0.04),0_3.769px_15.075px_rgba(8,21,44,0.04)]">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.35fr] lg:items-center">
          <div className="max-w-[440px]">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-3 py-1 text-[10px] font-semibold leading-[15px] text-[#dbe9ff]">
              <Sparkles className="size-3" />
              Trending for your business
            </span>
            <h2 className="mt-4 text-[28px] font-bold leading-[32px] tracking-[-0.45px] text-white">
              Personalised APIs to ship onboarding faster
            </h2>
            <p className="mt-3 text-[12px] font-normal leading-5 text-white/80">
              Curated picks based on what your account can access. View docs or open any API in a click.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {endpointsLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="h-[86px] animate-pulse rounded-[14px] bg-white/10" />
              ))
            ) : (
              recommendedApis.map((api) => {
                const isEnabled = !isProduction || subscribedApiIds.has(api.id)
                return (
                  <div key={api.id} className="rounded-[14px] border border-white/10 bg-white/10 p-4 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-[13px] font-bold leading-5">{api.name}</p>
                        <p className="truncate text-[10px] font-normal leading-[15px] text-white/70">
                          {getCategoryLabel(api.category)} - {api.credit} credits / call
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-white/20 px-2 py-0.5 text-[9px] font-semibold leading-4">
                        Trending
                      </span>
                    </div>
                    <div className="mt-4 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleSelectApi(api.id)}
                        className="h-8 rounded-[10px] bg-white px-3 text-[12px] font-normal leading-4 text-[#0a121f]"
                      >
                        {isProduction && !isEnabled ? 'Request access' : 'Try API'}
                      </button>
                      <button
                        type="button"
                        onClick={() => window.open(API_DOCS_URL, '_blank', 'noopener,noreferrer')}
                        className="inline-flex items-center gap-1 text-[11px] font-normal leading-4 text-white"
                      >
                        <FileText className="size-3.5" />
                        View docs
                      </button>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>
      </section>

      <section className="rounded-[20px] border border-[#e0e5eb] bg-white p-6 shadow-[0_1px_2px_rgba(8,21,44,0.04),0_4px_15px_rgba(8,21,44,0.04)]">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-max rounded-full border border-[#e1e5ea] bg-white p-1">
              {([
                ['All', apiEndpoints?.length || 0],
                ['Enabled', enabledApis.length],
                ['Pinned', pinnedApis.length],
              ] as [MarketplaceTab, number][]).map(([tab, count]) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'h-8 rounded-full px-4 text-[12px] font-normal leading-4 transition',
                    activeTab === tab ? 'bg-[#255be8] text-white shadow-sm' : 'text-[#5c646f] hover:bg-[#f7f9fc]'
                  )}
                >
                  {tab} ({count})
                </button>
              ))}
            </div>

            <div className="flex h-10 w-full items-center rounded-[12px] border border-[#e1e5ea] bg-white px-3 shadow-[0_1px_1px_rgba(17,22,31,0.04)] lg:w-[320px]">
              <Search className="mr-2 size-4 text-[#90a1b9]" />
              <Input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search APIs"
                className="h-full border-0 bg-transparent px-0 text-[13px] text-[#0a121f] shadow-none focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2 rounded-[14px] border border-[#e1e5ea] bg-[#fbfdff] px-4 py-3 md:flex-row md:items-center md:justify-between">
            <div className="inline-flex items-center gap-2 text-[12px] font-semibold uppercase leading-[16.5px] tracking-[0.55px] text-[#737373]">
              <Zap className="size-4 text-[#0019ff]" />
              Live Credits
              <span className="text-[16px] font-semibold normal-case leading-[22.5px] tracking-normal text-[#171717]">
                {remainingCredits}
              </span>
            </div>
            <button
              type="button"
              onClick={() => navigate('/billing')}
              className="inline-flex h-8 w-max items-center justify-center gap-1 rounded-full bg-[#0019ff] px-3 text-[12px] font-semibold text-white"
            >
              <Plus className="size-3.5" />
              Top up credits
            </button>
          </div>

          <div className="min-h-[400px]">
            {endpointsLoading || subscriptionsLoading ? (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 9 }).map((_, index) => (
                  <div key={index} className="h-[166px] animate-pulse rounded-[20px] border border-[#e1e5ea] bg-[#f6f8fb]" />
                ))}
              </div>
            ) : marketplaceApis.length === 0 ? (
              renderEmptyState()
            ) : (
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {marketplaceApis.map((api) => (
                  <ApiCard
                    key={api.id}
                    api={api}
                    isPinned={savedApis.includes(api.id)}
                    isEnabled={subscribedApiIds.has(api.id)}
                    isProduction={isProduction}
                    onSelect={() => handleSelectApi(api.id)}
                    onTogglePin={() => toggleSaveApi(api.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-3xl">
          <SheetHeader className="border-b border-[#e7e8ea] pb-4 text-left">
            <div className="flex items-center justify-between gap-4">
              <div>
                <SheetTitle className="text-lg font-semibold text-[#131b31]">
                  {selectedApiData?.name || 'API Details'}
                </SheetTitle>
                <SheetDescription className="text-xs text-[#616675]">
                  Configure inputs and run this API through your backend connection.
                </SheetDescription>
              </div>
              {selectedApiData && (
                <button
                  type="button"
                  onClick={() => setShowSampleResponse((current) => !current)}
                  className="flex items-center gap-2 rounded-lg border border-[#e7e8ea] bg-white px-3 py-2 text-xs font-medium text-[#616675] transition hover:bg-[#f7f7f8]"
                >
                  <Code2 className="size-4" />
                  {showSampleResponse ? 'Hide Schema Sample' : 'View Schema Sample'}
                </button>
              )}
            </div>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-4 pb-8">
            {showSampleResponse && selectedApiData ? (
              <div className="rounded-2xl border border-[#e7e8ea] bg-white p-4">
                <div className="mb-4 flex items-center gap-2">
                  <Code2 className="size-5 text-[#0019ff]" />
                  <h3 className="text-sm font-semibold text-[#131b31]">Schema sample from OpenAPI</h3>
                </div>
                <div className="max-h-96 overflow-auto rounded-lg border border-[#e7e8ea] bg-gray-50 p-4">
                  <pre className="whitespace-pre-wrap font-mono text-[11px] leading-relaxed text-[#616675]">
                    {typeof selectedApiData.sampleOutput === 'string'
                      ? selectedApiData.sampleOutput
                      : JSON.stringify(selectedApiData.sampleOutput || {}, null, 2)}
                  </pre>
                </div>
              </div>
            ) : (
              <>
                <ApiConfiguration
                  selectedApi={selectedApi}
                  apiEndpoints={apiEndpoints}
                  onApiRun={handleApiRun}
                  loading={endpointsLoading}
                  isSubscribed={selectedApi ? subscribedApiIds.has(selectedApi) : false}
                  isProduction={isProduction}
                  forceBackendExecution={isProduction}
                />
                <ApiResponse response={apiResponse} />
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}

type ApiCardProps = {
  api: ApiEndpoint
  isPinned: boolean
  isEnabled: boolean
  isProduction: boolean
  onSelect: () => void
  onTogglePin: () => void
}

const ApiCard = ({ api, isPinned, isEnabled, isProduction, onSelect, onTogglePin }: ApiCardProps) => (
  <div
    className="flex min-h-[166px] cursor-pointer flex-col rounded-[20px] border border-[#e1e5ea] bg-white p-[21px] shadow-[0_1px_1px_rgba(17,22,31,0.04),0_1px_1.5px_rgba(17,22,31,0.06)] transition hover:-translate-y-0.5 hover:shadow-md"
    onClick={onSelect}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0 pb-0.5">
        <p className="line-clamp-2 text-[16px] font-bold leading-5 text-[#0c121a]">{api.name}</p>
        <p className="mt-[6.5px] text-[10px] font-normal uppercase leading-[15px] tracking-[0.5px] text-[#5c646f]">
          {getCategoryLabel(api.category)}
        </p>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <span
          className={cn(
            'inline-flex h-[20.5px] items-center gap-1 rounded-[10px] px-2 text-[10px] font-normal leading-[16.5px]',
            !isProduction ? 'bg-[#fff0c5] text-[#bb4d00]' : isEnabled ? 'bg-[#e1faec] text-[#1f9a5b]' : 'bg-[#eef2f7] text-[#5c646f]'
          )}
        >
          {!isProduction ? <Zap className="size-3" /> : isEnabled ? <Check className="size-3" /> : <Lock className="size-3" />}
          {!isProduction ? 'Sandbox' : isEnabled ? 'Enabled' : 'Locked'}
        </span>
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onTogglePin()
          }}
          className={cn(
            'grid size-8 place-items-center rounded-full border border-[#e1e5ea] bg-white p-px transition hover:border-[#b9c5d6]',
            isPinned && 'border-[#b9cdfd] bg-[#e8f3ff] text-[#195cdf]'
          )}
          aria-label={isPinned ? `Unpin ${api.name}` : `Pin ${api.name}`}
        >
          <Pin className="size-3.5" />
        </button>
      </div>
    </div>

    <p className="mt-3 min-h-10 text-[14px] font-normal leading-5 text-[#5c646f]">
      {getShortDescription(api)}
    </p>

    <div className="mt-auto pt-4">
      {!isProduction || isEnabled ? (
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-[12px] font-normal leading-4 text-[#009a5f]">
            <Zap className="size-3.5" />
            {!isProduction ? 'Sample response' : `${api.credit} Credits`}
          </span>
          <ChevronRight className="size-4 text-[#5c646f]" />
        </div>
      ) : (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation()
            onSelect()
          }}
          className="flex h-9 w-full items-center justify-center rounded-[12px] bg-[#195cdf] text-center text-[14px] font-semibold leading-5 text-white transition hover:bg-[#124ec4]"
        >
          Request Access
        </button>
      )}
    </div>
  </div>
)

export default ApiTestingPage
