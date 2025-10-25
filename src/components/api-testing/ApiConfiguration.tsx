import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

// Image assets from Figma
const imgSettings = "http://localhost:3845/assets/25c7ec0455d00369417cec8ff0cc5186058be49c.svg"
const imgCommandLine = "http://localhost:3845/assets/d6f6921db4f47d6ffd7a168b170c0e941a28ef03.svg"

interface ApiConfigurationProps {
  selectedApi: string | null
  onApiRun: (response: any) => void
}

const ApiConfiguration = ({ selectedApi, onApiRun }: ApiConfigurationProps) => {
  const [panNumber, setPanNumber] = useState('ABCDE1234F')
  const [isLoading, setIsLoading] = useState(false)

  const handleRunApi = async () => {
    setIsLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      const mockResponse = {
        success: true,
        data: {
          panNumber: panNumber,
          status: 'valid',
          name: 'John Doe',
          verifiedAt: new Date().toISOString()
        },
        message: 'PAN verification successful'
      }
      
      onApiRun(mockResponse)
      setIsLoading(false)
    }, 2000)
  }

  const getApiTitle = () => {
    switch (selectedApi) {
      case 'pan-verification':
        return 'PAN Verification'
      case 'bank-verification-pennyless':
        return 'Bank Verification (Pennyless)'
      case 'bank-account-verification':
        return 'Bank Account Verification'
      case 'verify-uan':
        return 'UAN Verification'
      case 'mobile-to-pan':
        return 'Mobile To PAN'
      default:
        return 'API Configuration'
    }
  }

  const getInputLabel = () => {
    switch (selectedApi) {
      case 'pan-verification':
        return 'Pan Number'
      case 'bank-verification-pennyless':
        return 'Account Number'
      case 'bank-account-verification':
        return 'Account Number'
      case 'verify-uan':
        return 'UAN Number'
      case 'mobile-to-pan':
        return 'Mobile Number'
      default:
        return 'Input Field'
    }
  }

  const getInputPlaceholder = () => {
    switch (selectedApi) {
      case 'pan-verification':
        return 'ABCDE1234F'
      case 'bank-verification-pennyless':
        return '1234567890'
      case 'bank-account-verification':
        return '1234567890'
      case 'verify-uan':
        return '123456789012'
      case 'mobile-to-pan':
        return '9876543210'
      default:
        return 'Enter value'
    }
  }

  const getInputExample = () => {
    switch (selectedApi) {
      case 'pan-verification':
        return 'Example: ABCDE1234F'
      case 'bank-verification-pennyless':
        return 'Example: 1234567890'
      case 'bank-account-verification':
        return 'Example: 1234567890'
      case 'verify-uan':
        return 'Example: 123456789012'
      case 'mobile-to-pan':
        return 'Example: 9876543210'
      default:
        return 'Example: Enter value'
    }
  }

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 h-full flex-1">
      <div className="flex flex-col gap-4 items-start overflow-hidden p-4 relative rounded-2xl w-full h-full">
        {/* Header */}
        <div className="flex items-center justify-between overflow-hidden p-1 relative rounded shrink-0 w-full">
          <div className="flex gap-2 items-center relative shrink-0">
            <div className="overflow-hidden relative shrink-0 size-6">
              <div className="absolute inset-[9.38%_5.21%]">
                <img alt="" className="block max-w-none size-full" src={imgSettings} />
              </div>
            </div>
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              API Configuration
            </p>
          </div>
          <Button
            onClick={handleRunApi}
            disabled={isLoading || !selectedApi}
            className="bg-gradient-to-r from-[#e6e8ff] to-[#e6e8ff] hover:from-[#d0d4ff] hover:to-[#d0d4ff] text-[#0019ff] border-0 px-4 py-2 h-auto rounded-lg"
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
              {isLoading ? 'Running...' : 'Run API'}
            </p>
            <div className="relative shrink-0 size-4 ml-2">
              <div className="absolute inset-[13.54%_17.71%]">
                <img alt="" className="block max-w-none size-full" src={imgCommandLine} />
              </div>
            </div>
          </Button>
        </div>

        {/* Configuration Form */}
        <div className="flex flex-col gap-1.5 items-start relative shrink-0 w-full">
          <p className="font-normal leading-[1.4] min-w-full relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px]">
            {getInputLabel()}
          </p>
          <div className="border border-[#e7e8ea] border-solid flex gap-2 h-10 items-center px-4 py-2 relative rounded-lg shrink-0 w-[274px]">
            <div className="flex gap-2 items-center relative shrink-0">
              <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                {panNumber}
              </p>
            </div>
          </div>
          <p className="font-normal leading-[1.4] min-w-full relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px]">
            {getInputExample()}
          </p>
        </div>
      </div>
    </div>
  )
}

export default ApiConfiguration
