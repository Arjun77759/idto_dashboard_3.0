import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ApiResponseModal from './ApiResponseModal'

// Image assets from Figma
const imgSourceCode = "http://localhost:3845/assets/4f7194d3bbc36421b9c4955db6c64b413c875ba5.svg"
const imgSourceCodeLarge = "http://localhost:3845/assets/aa1b2545df3d945f2b4d80cc80ad8919b8b23009.svg"
const imgPlay = "http://localhost:3845/assets/26945b4356ea80bed7bb8db1d126e8d10b3caf2a.svg"

interface ApiResponseProps {
  response: any
}

const ApiResponse = ({ response }: ApiResponseProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleViewDetails = () => {
    if (response) {
      setIsModalOpen(true)
    }
  }

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 h-full flex-1">
      <div className="flex flex-col gap-2.5 items-start overflow-hidden p-4 relative rounded-2xl w-full h-full">
        {/* Header */}
        <div className="flex items-center justify-between overflow-hidden p-1 relative rounded shrink-0 w-full">
          <div className="flex gap-2 items-center relative shrink-0">
            <div className="overflow-hidden relative shrink-0 size-6">
              <div className="absolute inset-[9.375%]">
                <img alt="" className="block max-w-none size-full" src={imgPlay} />
              </div>
            </div>
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#00a370] text-nowrap tracking-[-0.12px] whitespace-pre">
              API Response
            </p>
          </div>
          {response && (
            <Button
              onClick={handleViewDetails}
              className="bg-gradient-to-r from-[#e6fcf5] to-[#e6fcf5] hover:from-[#d1f2eb] hover:to-[#d1f2eb] text-[#00a370] border-0 px-4 py-2 h-auto rounded-lg"
            >
              <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
                View Details
              </p>
              <div className="overflow-hidden relative shrink-0 size-4 ml-2">
                <div className="absolute inset-[14.58%_10.41%]">
                  <img alt="" className="block max-w-none size-full" src={imgSourceCode} />
                </div>
              </div>
            </Button>
          )}
        </div>

        {/* Response Content */}
        <div className="flex flex-col gap-2 grow items-center justify-center min-h-0 min-w-0 p-6 relative shrink-0 w-full">
          {response ? (
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="bg-gray-50 border border-[#e7e8ea] border-solid rounded-lg p-4 w-full max-h-96 overflow-auto">
                <pre className="text-[12px] text-[#616675] font-mono leading-[1.4] tracking-[-0.12px] whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-hidden relative shrink-0 size-8">
                <div className="absolute inset-[14.58%_10.41%]">
                  <img alt="" className="block max-w-none size-full" src={imgSourceCodeLarge} />
                </div>
              </div>
              <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                No Response Yet
              </p>
              <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                Run the API to see the response here
              </p>
            </>
          )}
        </div>
      </div>
      
      {/* Modal */}
      <ApiResponseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        response={response}
      />
    </div>
  )
}

export default ApiResponse
