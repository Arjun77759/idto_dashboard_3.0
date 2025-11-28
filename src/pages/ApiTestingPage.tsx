import { motion } from 'framer-motion'
import {
  ChevronRight,
  Plus,
  Search,
  Zap
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ApiConfiguration from '@/components/api-testing/ApiConfiguration'
import ApiResponse from '@/components/api-testing/ApiResponse'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { API_ENDPOINTS, type ApiEndpoint } from '@/config/apiEndpoints'
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage'
import { cn } from '@/lib/utils'

const formatCredits = (value?: number | null) => {
  if (value === null || value === undefined) return '0'
  return value.toLocaleString('en-IN', { maximumFractionDigits: 2 })
}

const ApiTestingPage = () => {
  const navigate = useNavigate()
  const { data: usageData, loading: usageLoading } = useMonthlyUsage()

  const [searchQuery, setSearchQuery] = useState('')
  const [solutionFilter, setSolutionFilter] = useState<'All' | string>('All')
  const [typeFilter, setTypeFilter] = useState<'All' | string>('All')
  const [showSavedOnly, setShowSavedOnly] = useState(false)
  const [savedApis, setSavedApis] = useState<string[]>([])
  const [selectedApi, setSelectedApi] = useState<string | null>(null)
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)

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

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem('idto-saved-api-testing', JSON.stringify(savedApis))
  }, [savedApis])

  const solutionOptions = useMemo(
    () => ['All', ...Array.from(new Set(API_ENDPOINTS.map((api) => api.category)))],
    []
  )
  const typeOptions = useMemo(
    () => ['All', ...Array.from(new Set(API_ENDPOINTS.map((api) => api.method)))],
    []
  )

  const filteredApis = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    return API_ENDPOINTS.filter((api) => {
      const matchesSearch =
        !query ||
        api.name.toLowerCase().includes(query) ||
        api.id.toLowerCase().includes(query) ||
        api.shortDescription.toLowerCase().includes(query)
      const matchesSolution = solutionFilter === 'All' || api.category === solutionFilter
      const matchesType = typeFilter === 'All' || api.method === typeFilter
      const matchesSaved = !showSavedOnly || savedApis.includes(api.id)
      return matchesSearch && matchesSolution && matchesType && matchesSaved
    })
  }, [searchQuery, solutionFilter, typeFilter, showSavedOnly, savedApis])

  const remainingCredits = usageLoading ? '...' : formatCredits(usageData?.balance)

  const handleApiRun = (response: any) => {
    setApiResponse(response)
  }

  const handleSelectApi = (apiId: string) => {
    setSelectedApi(apiId)
    setApiResponse(null)
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

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value)}>
              <SelectTrigger className="h-10 w-[160px] border-[#e7e8ea] bg-[#f7f7f8] text-xs text-[#616675]">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
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

          <div className="min-h-[400px] border-t-[1px] border-[#e7e8ea] p-3">
            {filteredApis.length === 0 ? (
              <div className="flex h-64 flex-col items-center justify-center gap-2 text-center text-[#9296a0]">
                <p className="text-sm font-medium">No APIs match the current filters</p>
                <p className="text-xs">Try adjusting your search or filter selections.</p>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {filteredApis.map((api) => (
                  <ApiCard
                    key={api.id}
                    api={api}
                    isPinned={savedApis.includes(api.id)}
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
            <SheetTitle className="text-lg font-semibold text-[#131b31]">
              {selectedApi ? API_ENDPOINTS.find((api) => api.id === selectedApi)?.name : 'API Details'}
            </SheetTitle>
            <SheetDescription className="text-xs text-[#616675]">
              Configure inputs and view responses without leaving the catalog.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 flex flex-col gap-4 pb-8">
            <ApiConfiguration selectedApi={selectedApi} onApiRun={handleApiRun} />
            <ApiResponse response={apiResponse} />
          </div>
        </SheetContent>
      </Sheet>
    </motion.div>
  )
}

type ApiCardProps = {
  api: ApiEndpoint
  isPinned: boolean
  onSelect: () => void
  onTogglePin: () => void
}

const ApiCard = ({ api, isPinned, onSelect, onTogglePin }: ApiCardProps) => (
  <div
    className={cn(
      'flex h-full cursor-pointer flex-col gap-4 rounded-xl border border-[#e7e8ea] p-4 transition hover:shadow-md',
      isPinned ? 'bg-[#e6fcf5]' : 'bg-white'
    )}
    onClick={onSelect}
  >
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-sm font-semibold text-[#131b31]">{api.name}</p>
        <p className="text-xs text-[#616675]">{api.shortDescription}</p>
      </div>
      {/* <button
        type="button"
        className="rounded-full border border-[#e7e8ea] bg-white p-1 text-[#616675] hover:bg-[#f0f0f0]"
        onClick={(event) => {
          event.stopPropagation()
          onTogglePin()
        }}
        aria-label={isPinned ? 'Unpin API' : 'Pin API'}
      >
        {isPinned ? <Pin className="size-4" /> : <PinOff className="size-4" />}
      </button> */}
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
