import { useState } from 'react'

// Image assets from Figma
const imgFlash = "http://localhost:3845/assets/79e02c9dfa552c506852f2e767cccc6c1004ef31.svg"
const imgSparkles = "http://localhost:3845/assets/1218014ddb10196a9531d7508588a579e587f952.svg"

interface ApiItem {
  id: string
  name: string
  credits: number
  isSelected?: boolean
}

interface ApiListProps {
  selectedApi: string | null
  onApiSelect: (apiId: string) => void
}

const ApiList = ({ selectedApi, onApiSelect }: ApiListProps) => {
  const [apis] = useState<ApiItem[]>([
    {
      id: 'bank-verification-pennyless',
      name: 'Bank Verification (Pennyless)',
      credits: 10
    },
    {
      id: 'bank-account-verification',
      name: 'Bank Account Verification',
      credits: 10
    },
    {
      id: 'pan-verification',
      name: 'PAN Verification',
      credits: 10,
      isSelected: true
    },
    {
      id: 'verify-uan',
      name: 'Verify UAN',
      credits: 10
    },
    {
      id: 'mobile-to-pan',
      name: 'Mobile To Pan',
      credits: 10
    },
    {
      id: 'bank-account-verification-2',
      name: 'Bank Account Verification',
      credits: 10
    },
    {
      id: 'verify-uan-2',
      name: 'Verify UAN',
      credits: 10
    },
    {
      id: 'bank-account-verification-3',
      name: 'Bank Account Verification',
      credits: 10
    },
    {
      id: 'bank-account-verification-4',
      name: 'Bank Account Verification',
      credits: 10
    }
  ])

  return (
    <div className="border border-[#e7e8ea] border-solid flex flex-col items-start overflow-hidden relative rounded-lg shrink-0 w-full flex-1">
      <div className="flex flex-col items-start overflow-hidden relative rounded-lg w-full h-full">
        {apis.map((api, index) => (
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
                  <div className="overflow-hidden relative shrink-0 size-4">
                    <div className="absolute inset-[5.208%]">
                      <img alt="" className="block max-w-none size-full" src={imgSparkles} />
                    </div>
                  </div>
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                    Selected
                  </p>
                </>
              ) : (
                <>
                  <div className="overflow-hidden relative shrink-0 size-4">
                    <div className="absolute inset-[5.21%_16.67%]">
                      <img alt="" className="block max-w-none size-full" src={imgFlash} />
                    </div>
                  </div>
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                    {api.credits} Credits
                  </p>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ApiList
