import { motion } from 'framer-motion'
import { useState } from 'react'
import ApiFilters from '@/components/api-testing/ApiFilters'
import ApiList from '@/components/api-testing/ApiList'
import ApiConfiguration from '@/components/api-testing/ApiConfiguration'
import ApiResponse from '@/components/api-testing/ApiResponse'

const ApiTestingPage = () => {
  const [selectedApi, setSelectedApi] = useState<string | null>('pan-verification')
  const [apiResponse, setApiResponse] = useState<any>(null)

  const handleApiSelect = (apiId: string) => {
    setSelectedApi(apiId)
    setApiResponse(null) // Clear previous response when selecting new API
  }

  const handleApiRun = (response: any) => {
    setApiResponse(response)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-5 items-start p-6 relative rounded-2xl w-full"
    >
      {/* Header */}
      <div className="flex gap-2 items-center px-3 py-1.5 relative rounded shrink-0 w-full">
        <div className="overflow-hidden relative shrink-0 size-6">
          <div className="absolute inset-[5.21%_9.37%_5.21%_9.39%]">
            <span className="text-2xl">🧪</span>
          </div>
        </div>
        <p className="font-medium leading-[1.4] relative shrink-0 text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
          API Testing
        </p>
      </div>

      {/* Main Content */}
      <div className="flex gap-5 grow items-start min-h-0 min-w-0 relative shrink-0 w-full">
        {/* Left Sidebar */}
        <div className="bg-white border border-[#e7e8ea] border-solid flex flex-col gap-4 h-full items-center p-4 relative rounded-2xl shrink-0 w-[373px]">
          <ApiFilters />
          <ApiList 
            selectedApi={selectedApi}
            onApiSelect={handleApiSelect}
          />
        </div>

        {/* Right Content */}
        <div className="flex flex-col gap-2 grow h-full min-h-0 min-w-0 overflow-hidden relative rounded shrink-0">
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
