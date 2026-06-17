import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Settings, Terminal } from 'lucide-react'
import type { ApiEndpoint } from '@/config/apiEndpoints'
import { getApiById } from '@/hooks/useOpenApiEndpoints'
import http from '@/api/axiosInstance'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import ArrayOfObjectsInput from './ArrayOfObjectsInput'

interface ApiConfigurationProps {
  selectedApi: string | null
  apiEndpoints: ApiEndpoint[] | null
  onApiRun: (response: any) => void
  loading?: boolean
  isSubscribed?: boolean
  isProduction?: boolean
  forceBackendExecution?: boolean
}

const ApiConfiguration = ({ 
  selectedApi, 
  apiEndpoints, 
  onApiRun, 
  loading: pageLoading = false,
  isSubscribed = true,
  isProduction = false,
  forceBackendExecution = false
}: ApiConfigurationProps) => {
  const [inputValues, setInputValues] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(false)
  const { data: onboardingStatus } = useOnboardingStatus()
  const isSandboxMode = !Boolean(onboardingStatus?.is_onboarded)

  const apiConfig = selectedApi ? getApiById(apiEndpoints, selectedApi) : null
  const isEsignApi = apiConfig?.id === 'esign' || apiConfig?.tags?.includes('eSign')

  const shouldTreatAsStringArray = (key: string, fieldType?: string) =>
    fieldType === 'string_array' || key === 'documents_for_consent'

  // Initialize input values when API changes
  useEffect(() => {
    if (apiConfig) {
      const initialValues: Record<string, any> = {}
      Object.entries(apiConfig.sampleInput).forEach(([key, field]) => {
        // For eSign array fields, initialize with empty array
        if (isEsignApi && (key === 'documents' || key === 'signers_info')) {
          initialValues[key] = []
        } else if (shouldTreatAsStringArray(key, field.type)) {
          initialValues[key] = []
        } else {
          initialValues[key] = ''
        }
      })
      setInputValues(initialValues)
    }
  }, [apiConfig, isEsignApi])

  const handleRunApi = async () => {
    if (!apiConfig) return

    // Check if API is subscribed in production mode
    if ((isProduction || forceBackendExecution) && !isSubscribed) {
      onApiRun({
        success: false,
        error: {
          message: `This API is not enabled for your account.`,
          detail: `Please contact support to enable "${apiConfig.name}" API for your subscription.`
        },
        statusCode: 403,
        message: 'API access denied'
      })
      return
    }

    setIsLoading(true)
    const startTime = Date.now()

    // In sandbox mode, return sample output instead of making actual API call
    if (isSandboxMode && !forceBackendExecution) {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500))
      
      const responseTime = Date.now() - startTime
      
      // Return sample output
      onApiRun({
        success: true,
        data: apiConfig.sampleOutput,
        statusCode: 200,
        responseTime,
        message: 'API call successful (Sandbox Mode - Sample Output)'
      })
      
      setIsLoading(false)
      return
    }

    // Production mode - make actual API call
    try {
      let response
      let requestPayload = { ...inputValues }

      Object.entries(apiConfig.sampleInput).forEach(([key, field]) => {
        if (shouldTreatAsStringArray(key, field.type)) {
          const rawValue = requestPayload[key]

          if (Array.isArray(rawValue)) {
            requestPayload[key] = rawValue
              .map((item) => String(item).trim())
              .filter(Boolean)
            return
          }

          if (typeof rawValue === 'string') {
            requestPayload[key] = rawValue
              .split(',')
              .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
              .filter(Boolean)
            return
          }

          requestPayload[key] = []
        }
      })
      
      // For eSign, transform signers_info structure
      // In UI, page_number, sequence, and trigger_esign_request are stored inside signer_position
      // But in API, they need to be at the same level as signer_position
      if (isEsignApi && requestPayload.signers_info && Array.isArray(requestPayload.signers_info)) {
        requestPayload.signers_info = requestPayload.signers_info.map((signer: any) => {
          const transformed = { ...signer }
          if (transformed.signer_position) {
            // Extract page_number, sequence, and trigger_esign_request from signer_position
            if (transformed.signer_position.page_number !== undefined) {
              transformed.page_number = transformed.signer_position.page_number
              delete transformed.signer_position.page_number
            }
            if (transformed.signer_position.sequence !== undefined) {
              transformed.sequence = transformed.signer_position.sequence
              delete transformed.signer_position.sequence
            }
            if (transformed.signer_position.trigger_esign_request !== undefined) {
              transformed.trigger_esign_request = transformed.signer_position.trigger_esign_request
              delete transformed.signer_position.trigger_esign_request
            }
          }
          return transformed
        })
      }
      
      // Handle different content types
      if (apiConfig.contentType === 'multipart/form-data') {
        const formData = new FormData()
        Object.entries(requestPayload).forEach(([key, value]) => {
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
        response = await http.post(apiConfig.endpoint, requestPayload)
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

  // Handle Enter key press to run API
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading && selectedApi) {
      e.preventDefault()
      handleRunApi()
    }
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
          {Object.entries(apiConfig.sampleInput).map(([key, field]) => {
            // For eSign, use ArrayOfObjectsInput for documents and signers_info
            const isArrayOfObjects = isEsignApi && (key === 'documents' || key === 'signers_info')
            
            return (
              <div key={key} className="flex flex-col gap-1.5 items-start relative shrink-0 w-full">
                {isArrayOfObjects ? (
                  <ArrayOfObjectsInput
                    fieldName={key}
                    field={field}
                    value={inputValues[key] || []}
                    onChange={(value) => handleInputChange(key, value)}
                    onKeyPress={handleKeyPress}
                  />
                ) : (
                  <>
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
                    ) : shouldTreatAsStringArray(key, field.type) ? (
                      <Input
                        type="text"
                        value={Array.isArray(inputValues[key]) ? inputValues[key].join(', ') : inputValues[key] || ''}
                        onChange={(e) =>
                          handleInputChange(
                            key,
                            e.target.value
                              .split(',')
                              .map((item) => item.trim().replace(/^['"]|['"]$/g, ''))
                              .filter(Boolean)
                          )
                        }
                        onKeyDown={handleKeyPress}
                        placeholder={field.example ? `e.g., ${Array.isArray(field.example) ? field.example.join(', ') : String(field.example)}` : ''}
                        className="w-full max-w-md border-[#e7e8ea] h-10"
                      />
                    ) : (
                      <Input
                        type={field.type === 'number' ? 'number' : field.type === 'email' ? 'email' : field.type === 'date' ? 'date' : 'text'}
                        value={inputValues[key] || ''}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder={field.example ? `e.g., ${String(field.example)}` : ''}
                        className="w-full max-w-md border-[#e7e8ea] h-10"
                      />
                    )}
                    
                    {field.description && (
                      <p className="font-normal text-[11px] text-[#9296a0]">
                        {field.description}
                      </p>
                    )}
                    {!isArrayOfObjects && (
                      <p className="font-normal text-[11px] text-[#9296a0]">
                        Example: {Array.isArray(field.example) ? field.example.join(', ') : String(field.example)}
                      </p>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ApiConfiguration
