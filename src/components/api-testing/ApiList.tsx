import { Zap, Sparkles } from 'lucide-react'
import { API_ENDPOINTS } from '@/config/apiEndpoints'
import { useMemo } from 'react'

interface ApiListProps {
  selectedApi: string | null
  onApiSelect: (apiId: string) => void
  searchQuery?: string
  categoryFilter?: string
  loading?: boolean
}

const ApiList = ({ selectedApi, onApiSelect, searchQuery = '', categoryFilter = 'All', loading = false }: ApiListProps) => {
  // Filter APIs based on search query and category
  const filteredApis = useMemo(() => {
    let filtered = API_ENDPOINTS
    
    // Filter by category
    if (categoryFilter && categoryFilter !== 'All') {
      filtered = filtered.filter(api => api.category === categoryFilter)
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(api =>
        api.name.toLowerCase().includes(query) ||
        api.id.toLowerCase().includes(query) ||
        api.shortDescription.toLowerCase().includes(query)
      )
    }
    
    return filtered
  }, [searchQuery, categoryFilter])

  // Skeleton loader component
  const SkeletonItem = () => (
    <div className="border-b border-[#e7e8ea] border-solid flex items-center justify-between p-4 relative shrink-0 w-full overflow-y-auto">
      <div className="flex flex-col gap-2 grow">
        <div className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
      </div>
      <div className="h-3 w-16 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
    </div>
  )

  return (
    <div className="border border-[#e7e8ea] border-solid flex flex-col items-start overflow-hidden relative rounded-lg shrink-0 w-full flex-grow overflow-y-auto">
      <div className="flex flex-col items-start overflow-hidden relative rounded-lg w-full h-full">
        {loading ? (
          // Show skeleton loaders while loading
          <>
            {[...Array(8)].map((_, index) => (
              <SkeletonItem key={index} />
            ))}
          </>
        ) : filteredApis.length === 0 ? (
          <div className="flex items-center justify-center p-8 w-full">
            <p className="text-[12px] text-[#9296a0]">No APIs found</p>
          </div>
        ) : (
          filteredApis.map((api) => (
          <div
            key={api.id}
            className={`border-b border-[#e7e8ea] border-solid flex items-center justify-between p-4 relative shrink-0 w-full cursor-pointer ${
              selectedApi === api.id 
                ? 'bg-[#e6e8ff]' 
                : 'hover:bg-gray-50'
            }`}
            onClick={() => onApiSelect(api.id)}
          >
            <div className="flex flex-col gap-1 grow items-start min-h-0 min-w-0 relative shrink-0">
              <p className={`font-medium leading-[1.4] relative shrink-0 text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre ${
                selectedApi === api.id ? 'text-[#0019ff]' : 'text-[#616675]'
              }`}>
                {api.name}
              </p>
            </div>
            <div className="flex gap-1 items-center relative shrink-0">
              {selectedApi === api.id ? (
                <>
                  <Sparkles className="size-4 text-[#0019ff]" />
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                    Selected
                  </p>
                </>
              ) : (
                <>
                  <Zap className="size-4 text-[#9296a0]" />
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                    {api.credit} Credits
                  </p>
                </>
              )}
            </div>
          </div>
          ))
        )}
      </div>
    </div>
  )
}

export default ApiList
