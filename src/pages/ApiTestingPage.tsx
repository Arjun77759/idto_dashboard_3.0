import { motion } from 'framer-motion'
import {
  ChevronRight,
  Plus,
  Search,
  Zap,
  Eye,
  Code2,
  Info
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ApiConfiguration from '@/components/api-testing/ApiConfiguration'
import ApiResponse from '@/components/api-testing/ApiResponse'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import type { ApiEndpoint } from '@/config/apiEndpoints'
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage'
import { useOpenApiEndpoints, getAllCategories, getAllMethods, getTagsByCategory } from '@/hooks/useOpenApiEndpoints'
import { useApiSubscriptions } from '@/hooks/useApiSubscriptions'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { cn } from '@/lib/utils'

const formatCredits = (value?: number | null) => {
  if (value === null || value === undefined) return '0'
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

/**
 * Maps API subscription names from backend to API endpoint IDs
 * Handles variations in naming conventions
 */
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
  if (!apiEndpoints) return []

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

  const fuzzyMatch = apiEndpoints.find(api => {
    const firstToken = normalizedName.split('_')[0]
    const apiNameLower = api.name.toLowerCase()
    const apiIdLower = api.id.toLowerCase()
    return apiNameLower.includes(firstToken) || apiIdLower.includes(firstToken)
  })

  return fuzzyMatch ? [fuzzyMatch.id] : []
}

const ApiTestingPage = () => {
  const navigate = useNavigate()
  const { data: usageData, loading: usageLoading } = useMonthlyUsage()
  const { data: apiEndpoints, loading: endpointsLoading } = useOpenApiEndpoints()
  const { data: subscribedApis, loading: subscriptionsLoading } = useApiSubscriptions()
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const [searchQuery, setSearchQuery] = useState('')
  const [solutionFilter, setSolutionFilter] = useState<'All' | string>('All')
  const [typeFilter, setTypeFilter] = useState<'All' | string>('All')
  const [tagFilter, setTagFilter] = useState<'All' | string>('All')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [savedApis, setSavedApis] = useState<string[]>([])
  const [selectedApi, setSelectedApi] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [showSampleResponse, setShowSampleResponse] = useState(false)

  // Get subscribed API IDs
  const subscribedApiIds = useMemo(() => {
    if (!subscribedApis || !apiEndpoints || subscribedApis.length === 0) return new Set<string>()
    return new Set(
      subscribedApis
        .flatMap(sub => mapSubscriptionNameToApiIds(sub.api_name, apiEndpoints))
    )
  }, [subscribedApis, apiEndpoints])

  // Load saved APIs from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return
    const stored = window.localStorage.getItem('idto-saved-api-testing')
    if (stored) {
      try {
        setSavedApis(JSON.parse(stored))
        return
      } catch {
        /* noop */
      }
    }
    setSavedApis(['pan_verification'])
  }, [])

  // Auto-pin subscribed APIs when they load
  useEffect(() => {
    if (subscribedApiIds.size === 0) return
    
    setSavedApis(prev => {
      const combined = [...new Set([...prev, ...Array.from(subscribedApiIds)])]
      return combined
    })
  }, [subscribedApiIds])

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('idto-saved-api-testing', JSON.stringify(savedApis))
  }, [savedApis])

  // Reset tag filter when solution filter changes
  useEffect(() => {
    setTagFilter('All')
  }, [solutionFilter])

  const solutionOptions = useMemo(
    () => getAllCategories(apiEndpoints),
    [apiEndpoints]
  )
  const typeOptions = useMemo(
    () => getAllMethods(apiEndpoints),
    [apiEndpoints]
  )
  const tagOptions = useMemo(
    () => getTagsByCategory(apiEndpoints, solutionFilter),
    [apiEndpoints, solutionFilter]
  )

  const filteredApis = useMemo(() => {
    if (!apiEndpoints) return []
    const query = searchQuery.trim().toLowerCase()
    
    // Show all APIs, but we'll check subscription when user tries to run
    const filtered = apiEndpoints.filter((api) => {
      const matchesSearch =
        !query ||
        api.name.toLowerCase().includes(query) ||
        api.id.toLowerCase().includes(query) ||
        api.shortDescription.toLowerCase().includes(query)
      const matchesSolution = solutionFilter === 'All' || api.category === solutionFilter
      const matchesType = typeFilter === 'All' || api.method === typeFilter
      const matchesTag = tagFilter === 'All' || (api.tags && api.tags.includes(tagFilter))
      const matchesSaved = !showSavedOnly || savedApis.includes(api.id)
      return matchesSearch && matchesSolution && matchesType && matchesTag && matchesSaved
    })
    
    // Sort: pinned APIs first, then others
    return filtered.sort((a, b) => {
      const aIsPinned = savedApis.includes(a.id)
      const bIsPinned = savedApis.includes(b.id)
      if (aIsPinned && !bIsPinned) return -1
      if (!aIsPinned && bIsPinned) return 1
      return 0
    })
  }, [apiEndpoints, searchQuery, solutionFilter, typeFilter, tagFilter, showSavedOnly, savedApis])

  const remainingCredits = usageLoading ? '...' : formatCredits(usageData?.balance)

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
    setSavedApis((prev) => {
      if (prev.includes(apiId)) {
        return prev.filter((id) => id !== apiId)
      }
      return [...prev, apiId]
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-6 p-4 sm:p-6 rounded-2xl w-full min-h-0 overflow-y-auto"
    >
      <div className="flex flex-wrap items-center gap-4 rounded px-3 py-1.5">
        <div className="flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" viewBox="0 0 20 22" fill="none">
            <path d="M14.75 1.5H12.998V7.06543L19.4238 20.4248C19.5356 20.6572 19.52 20.9311 19.3828 21.1494C19.2456 21.3677 19.0059 21.5 18.748 21.5H0.75C0.492072 21.5 0.251504 21.3678 0.114258 21.1494C-0.0228654 20.9311 -0.0376128 20.6571 0.0742188 20.4248L5.16211 9.85352L5.15625 9.84863L5.17871 9.81934L6.49805 7.0791V1.5H4.75V0H14.75V1.5ZM13.7227 16.4912C13.5797 15.9578 13.0314 15.6414 12.498 15.7842L12.4893 15.7861C11.9559 15.929 11.6395 16.4774 11.7822 17.0107C11.9252 17.5442 12.4734 17.8617 13.0068 17.7188L13.0156 17.7158C13.5489 17.5728 13.8656 17.0246 13.7227 16.4912ZM7.72266 14.4912C7.57973 13.9578 7.03144 13.6414 6.49805 13.7842L6.48926 13.7861C5.95591 13.929 5.63951 14.4774 5.78223 15.0107C5.92517 15.5442 6.47338 15.8617 7.00684 15.7188L7.01562 15.7158C7.54894 15.5728 7.86556 15.0246 7.72266 14.4912ZM7.99707 7.42188L7.22266 9.03027C7.3721 9.0529 7.51844 9.08727 7.66016 9.12891C8.46038 9.36408 9.33152 9.90964 10.1543 10.4375C11.132 11.0646 11.7832 11.0608 12.1758 10.9287C12.487 10.8239 12.737 10.605 12.9102 10.3457L11.4971 7.40723V1.5H7.99707V7.42188Z" fill="#131B31" />
          </svg>
          <div>
            <p className="text-xl font-semibold text-[#131b31] tracking-[-0.2px]">API Testing</p>

          </div>
        </div>
        <button
          type="button"
          onClick={() => navigate('/billing')}
          className="ml-auto flex items-center gap-3 rounded-lg border border-[#e7e8ea] bg-white px-4 py-3 text-sm font-medium text-[#616675] transition hover:-translate-y-0.5 hover:shadow"
        >
          <span>
            Remaining Credits :{' '}
            <span className="text-base font-[500] text-[#131b31]">{remainingCredits}</span>
          </span>
          <Plus className="size-4 text-[#131b31]" />
        </button>
      </div>

      <section className="w-full rounded-2xl border border-[#e7e8ea] bg-white p-4 sm:p-6">
        <div className="flex flex-col gap-6">
          <div className="flex items-center rounded-lg border border-[#e7e8ea] bg-[#f7f7f8] px-4 max-w-[70%]">
            <Search className="mr-3 size-5 text-[#9296a0]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for ID, name, product etc"
              className="border-0 bg-transparent px-0 text-sm text-[#131b31] focus-visible:ring-0 focus:outline-none focus:ring-0"
            />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <p className="text-xs font-medium text-[#616675]">Filters :</p>
            <Select value={solutionFilter} onValueChange={(value) => setSolutionFilter(value)}>
              <SelectTrigger className="h-10 w-[200px] border-[#e7e8ea] bg-[#f7f7f8] text-xs text-[#616675]">
                <SelectValue placeholder="Solution" />
              </SelectTrigger>
              <SelectContent>
                {solutionOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

           

            <Select value={tagFilter} onValueChange={(value) => setTagFilter(value)}>
              <SelectTrigger className="h-10 w-[200px] border-[#e7e8ea] bg-[#f7f7f8] text-xs text-[#616675]">
                <SelectValue placeholder="Tag" />
              </SelectTrigger>
              <SelectContent>
                {tagOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* <label className="flex items-center gap-2 text-xs font-medium text-[#616675]">
              <Checkbox checked={showSavedOnly} onCheckedChange={(checked) => setShowSavedOnly(Boolean(checked))} />
              Show only saved APIs
            </label> */}
          </div>

          {/* API Access Info Note */}
          <div className="flex items-start gap-2 rounded-lg border border-[#e7e8ea] bg-[#f0f9ff] p-3">
            <Info className="size-4 text-[#0019ff] mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-xs font-medium text-[#131b31] mb-1">API Access Information</p>
              <p className="text-xs text-[#616675] leading-relaxed">
                All APIs are shown here for reference. APIs marked with a <span className="font-medium text-[#131b31]">green background</span> and "Pinned" badge are automatically pinned from your active subscription. APIs marked as "Not Enabled" require subscription activation. You can only test APIs that are enabled for your account.
              </p>
            </div>
          </div>

          <div className="min-h-[400px] border-t-[1px] border-[#e7e8ea] p-3">
            {endpointsLoading || subscriptionsLoading ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-[#9296a0]">
                <p className="text-sm font-medium">Loading API endpoints...</p>
              </div>
            ) : filteredApis.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-[#9296a0]">
                <p className="text-sm font-medium">
                  {subscribedApiIds.size === 0 
                    ? 'No APIs are currently enabled for your account' 
                    : 'No APIs match the current filters'}
                </p>
                <p className="text-xs">
                  {subscribedApiIds.size === 0
                    ? 'Please contact support to enable APIs for your account.'
                    : 'Try adjusting your search or filter selections.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredApis.map((api) => (
                  <ApiCard
                    key={api.id}
                    api={api}
                    isPinned={savedApis.includes(api.id)}
                    isSubscribed={!isProduction || subscribedApiIds.size === 0 || subscribedApiIds.has(api.id)}
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
            <div className="flex items-center justify-between">
              <div>
                <SheetTitle className="text-lg font-semibold text-[#131b31]">
                  {selectedApi ? apiEndpoints?.find((api) => api.id === selectedApi)?.name : 'API Details'}
                </SheetTitle>
                <SheetDescription className="text-xs text-[#616675]">
                  Configure inputs and view responses without leaving the catalog.
                </SheetDescription>
              </div>
              {selectedApi && apiEndpoints && (
                <button
                  type="button"
                  onClick={() => setShowSampleResponse(!showSampleResponse)}
                  className="flex items-center gap-2 rounded-lg border border-[#e7e8ea] bg-white px-3 py-2 text-xs font-medium text-[#616675] transition hover:bg-[#f7f7f8]"
                >
                  {showSampleResponse ? (
                    <>
                      <Code2 className="size-4" />
                      Hide Sample
                    </>
                  ) : (
                    <>
                      <Eye className="size-4" />
                      View Sample
                    </>
                  )}
                </button>
              )}
            </div>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-4 pb-8">
            {showSampleResponse && selectedApi && apiEndpoints ? (
              <div className="bg-white border border-[#e7e8ea] rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-4">
                  <Code2 className="size-5 text-[#0019ff]" />
                  <h3 className="text-sm font-semibold text-[#131b31]">Sample Response</h3>
                </div>
                <div className="bg-gray-50 border border-[#e7e8ea] rounded-lg p-4 max-h-96 overflow-auto">
                  <pre className="text-[11px] text-[#616675] font-mono leading-relaxed whitespace-pre-wrap">
                    {(() => {
                      const selectedApiData = apiEndpoints.find((api) => api.id === selectedApi)
                      const sampleOutput = selectedApiData?.sampleOutput
                      if (typeof sampleOutput === 'string') {
                        return sampleOutput
                      }
                      return JSON.stringify(sampleOutput || {}, null, 2)
                    })()}
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
                  isSubscribed={selectedApi ? (!isProduction || subscribedApiIds.size === 0 || subscribedApiIds.has(selectedApi)) : true}
                  isProduction={isProduction}
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
  isSubscribed: boolean
  onSelect: () => void
  onTogglePin: () => void
}

const ApiCard = ({ api, isPinned, isSubscribed, onSelect, onTogglePin }: ApiCardProps) => (
  <div
    className={cn(
      'flex h-full cursor-pointer flex-col gap-4 rounded-xl border border-[#e7e8ea] p-4 transition hover:shadow-md',
      isPinned ? 'bg-[#e6fcf5]' : 'bg-white',
      !isSubscribed && 'opacity-75'
    )}
    onClick={onSelect}
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-[#131b31]">{api.name}</p>
          {!isSubscribed && (
            <span className="text-[10px] font-medium text-[#9296a0] bg-[#f7f7f8] px-2 py-0.5 rounded">
              Not Enabled
            </span>
          )}
        </div>
        <p className="text-xs text-[#616675]">{api.shortDescription}</p>
      </div>
    </div>
    {isPinned && (
      <p className="text-xs font-medium text-[#616675]">
        <span className="rounded-full bg-white/60 px-2 py-0.5">Pinned</span>
      </p>
    )}
    <div className="mt-auto flex items-center justify-between text-xs font-medium text-[#616675]">
      <div className="flex items-center gap-2">
        <Zap className="size-4 text-[#616675]" />
        {api.credit} Credits
      </div>
      <ChevronRight className="size-4 text-[#9296a0]" />
    </div>
  </div>
)

export default ApiTestingPage
