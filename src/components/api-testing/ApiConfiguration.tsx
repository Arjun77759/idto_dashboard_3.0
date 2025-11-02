import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Terminal } from 'lucide-react'
import { getApiById } from '@/config/apiEndpoints'
import http from '@/api/axiosInstance'

interface ApiConfigurationProps {
  selectedApi: string | null
  onApiRun: (response: any) => void
  loading?: boolean
}

const ApiConfiguration = ({ selectedApi, onApiRun, loading: pageLoading = false }: ApiConfigurationProps) => {
  const [inputValues, setInputValues] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)

  const apiConfig = selectedApi ? getApiById(selectedApi) : null

  // Initialize input values when API changes
  useEffect(() => {
    if (apiConfig) {
      const initialValues: Record<string, any> = {}
      Object.entries(apiConfig.sampleInput).forEach(([key, field]) => {
        initialValues[key] = field.example
      })
      setInputValues(initialValues)
    }
  }, [apiConfig])

  const handleRunApi = async () => {
    if (!apiConfig) return

    setIsLoading(true)
    const startTime = Date.now()

    try {
      let response
      
      // Handle different content types
      if (apiConfig.contentType === 'multipart/form-data') {
        const formData = new FormData()
        Object.entries(inputValues).forEach(([key, value]) => {
          if (value instanceof File) {
            formData.append(key, value)
          } else {
            formData.append(key, String(value))
          }
        })
        response = await http.post(apiConfig.endpoint, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
      } else {
        response = await http.post(apiConfig.endpoint, inputValues)
      }

      const responseTime = Date.now() - startTime

      onApiRun({
        success: true,
        data: response.data,
        statusCode: response.status,
        responseTime,
        message: 'API call successful'
      })
    } catch (error: any) {
      const responseTime = Date.now() - startTime
      onApiRun({
        success: false,
        error: error.response?.data || error.message,
        statusCode: error.response?.status || 500,
        responseTime,
        message: 'API call failed'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (key: string, value: any) => {
    setInputValues(prev => ({ ...prev, [key]: value }))
  }

  if (pageLoading) {
    return (
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 h-full flex-1 w-full">
        <div className="flex flex-col gap-4 items-start overflow-hidden p-4 relative rounded-2xl w-full h-full">
          {/* Header Skeleton */}
          <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between overflow-hidden p-1 relative rounded shrink-0 w-full">
            <div className="flex gap-2 items-center">
              <div className="h-6 w-6 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
              <div className="h-4 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>
            <div className="h-9 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
          </div>

          {/* Input Fields Skeleton */}
          <div className="flex flex-col gap-4 items-start relative shrink-0 w-full overflow-y-auto">
            {/* Field 1 */}
            <div className="flex flex-col gap-1.5 items-start relative shrink-0 w-full">
              <div className="h-4 w-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
              <div className="h-10 w-full max-w-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
              <div className="h-3 w-40 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>

            {/* Field 2 */}
            <div className="flex flex-col gap-1.5 items-start relative shrink-0 w-full">
              <div className="h-4 w-20 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
              <div className="h-10 w-full max-w-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
              <div className="h-3 w-36 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>

            {/* Field 3 */}
            <div className="flex flex-col gap-1.5 items-start relative shrink-0 w-full">
              <div className="h-4 w-28 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
              <div className="h-10 w-full max-w-md bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded-lg" />
              <div className="h-3 w-32 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!apiConfig) {
    return (
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 h-full flex-1 w-full">
        <div className="flex flex-col gap-4 items-center justify-center p-4 relative h-full">
          <p className="text-[#9296a0] text-[14px]">Select an API to configure</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 h-full flex-1 w-full">
      <div className="flex flex-col gap-4 items-start overflow-hidden p-4 relative rounded-2xl w-full h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between overflow-hidden p-1 relative rounded shrink-0 w-full">
          <div className="flex gap-2 items-center relative shrink-0">
            <Settings className="size-6 text-[#0019ff]" />
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              API Configuration
            </p>
          </div>
          <Button
            onClick={handleRunApi}
            disabled={isLoading || !selectedApi}
            className="bg-gradient-to-r from-[#e6e8ff] to-[#e6e8ff] hover:from-[#d0d4ff] hover:to-[#d0d4ff] text-[#0019ff] border-0 px-4 py-2 h-auto rounded-lg w-full sm:w-auto"
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
              {isLoading ? 'Running...' : 'Run API'}
            </p>
            <Terminal className="size-4 ml-2" />
          </Button>
        </div>

        {/* Configuration Form */}
        <div className="flex flex-col gap-4 items-start relative shrink-0 w-full overflow-y-auto">
          {Object.entries(apiConfig.sampleInput).map(([key, field]) => (
            <div key={key} className="flex flex-col gap-1.5 items-start relative shrink-0 w-full">
              <label className="font-medium leading-[1.4] text-[12px] text-[#616675] tracking-[-0.12px]">
                {key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              
              {field.type === 'file' ? (
                <Input
                  type="file"
                  onChange={(e) => handleInputChange(key, e.target.files?.[0])}
                  className="w-full max-w-md"
                />
              ) : field.type === 'boolean' ? (
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={inputValues[key] || false}
                    onChange={(e) => handleInputChange(key, e.target.checked)}
                    className="h-4 w-4"
                  />
                  <span className="text-[12px] text-[#9296a0]">{field.description}</span>
                </div>
              ) : (
                <Input
                  type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
                  value={inputValues[key] || ''}
                  onChange={(e) => handleInputChange(key, e.target.value)}
                  placeholder={String(field.example)}
                  className="w-full max-w-md border-[#e7e8ea] h-10"
                />
              )}
              
              {field.description && (
                <p className="font-normal text-[11px] text-[#9296a0]">
                  {field.description}
                </p>
              )}
              <p className="font-normal text-[11px] text-[#9296a0]">
                Example: {String(field.example)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ApiConfiguration
