import { motion } from 'framer-motion'
import { useState, useMemo } from 'react'
import ApiFilters from '@/components/api-testing/ApiFilters'
import ApiList from '@/components/api-testing/ApiList'
import ApiConfiguration from '@/components/api-testing/ApiConfiguration'
import ApiResponse from '@/components/api-testing/ApiResponse'
import { FlaskConical } from 'lucide-react'
import { API_ENDPOINTS } from '@/config/apiEndpoints'

const ApiTestingPage = () => {
  const [selectedApi, setSelectedApi] = useState<string | null>('pan-verification')
  const [apiResponse, setApiResponse] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('All')

  // Calculate filtered API count for display
  const filteredApiCount = useMemo(() => {
    let filtered = API_ENDPOINTS
    
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(api => api.category === selectedCategory)
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(api =>
        api.name.toLowerCase().includes(query) ||
        api.id.toLowerCase().includes(query) ||
        api.shortDescription.toLowerCase().includes(query)
      )
    }
    
    return filtered.length
  }, [searchQuery, selectedCategory])

  // Handle API selection from list
  const handleApiSelect = (apiId: string) => {
    setSelectedApi(apiId)
    setApiResponse(null) // Clear previous response when selecting new API
  }

  // Handle API execution and response
  const handleApiRun = (response: any) => {
    setApiResponse(response)
  }

  // Handle search query changes
  const handleSearch = (query: string) => {
    setSearchQuery(query)
  }

  // Handle category filter changes
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start p-4 sm:p-6 relative rounded-2xl w-full h-full"
    >
      {/* Header */}
      <div className="flex flex-col gap-2 items-start px-3 py-1.5 relative rounded shrink-0 w-full">
        <div className="flex gap-2 items-center">
          <div className="overflow-hidden relative shrink-0 size-5 sm:size-6">
            <FlaskConical className="w-5 h-5 sm:w-6 sm:h-6 text-[#131b31]" />
          </div>
          <h1 className="font-medium leading-[1.4] relative shrink-0 text-lg sm:text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
            API Testing
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-[12px] text-[#616675] leading-[1.4] tracking-[-0.12px]">
            Test and validate API endpoints with real-time request and response preview
          </p>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#e6e8ff] text-[#0019ff] font-medium">
            {filteredApiCount} {filteredApiCount === 1 ? 'API' : 'APIs'}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 grow items-start min-h-0 min-w-0 relative shrink-0 w-full">
        {/* Left Sidebar */}
        <div className="bg-white border border-[#e7e8ea] border-solid flex flex-col gap-4 h-full items-center p-4 relative rounded-2xl shrink-0 w-full lg:w-[373px]">
          <ApiFilters 
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
          />
          <ApiList
            selectedApi={selectedApi}
            onApiSelect={handleApiSelect}
            searchQuery={searchQuery}
            categoryFilter={selectedCategory}
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col gap-2 sm:gap-4 grow h-full min-h-0 min-w-0 overflow-hidden relative rounded shrink-0 w-full lg:w-auto">
          <ApiConfiguration
            selectedApi={selectedApi}
            onApiRun={handleApiRun}
          />
          <ApiResponse response={apiResponse} />
        </div>
      </div>
    </motion.div>
  )
}

export default ApiTestingPage
