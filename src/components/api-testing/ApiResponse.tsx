import { useState } from 'react'
import { Button } from '@/components/ui/button'
import ApiResponseModal from './ApiResponseModal'
import { Play, Code, Code2, CodeXml, SquareTerminal } from 'lucide-react'

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
    <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 h-full flex-1 w-full">
      <div className="flex flex-col gap-2.5 items-start overflow-hidden p-4 relative rounded-2xl w-full h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center justify-between overflow-hidden p-1 relative rounded shrink-0 w-full">
          <div className="flex gap-2 items-center relative shrink-0">
            <SquareTerminal className="size-6 text-[#00a370]" />
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#00a370] text-nowrap tracking-[-0.12px] whitespace-pre">
              API Response
            </p>
          </div>
          {response && (
            <Button
              onClick={handleViewDetails}
              className="bg-gradient-to-r from-[#e6fcf5] to-[#e6fcf5] hover:from-[#d1f2eb] hover:to-[#d1f2eb] text-[#00a370] border-0 px-4 py-2 h-auto rounded-lg w-full sm:w-auto"
            >
              <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
                View Details
              </p>
              <CodeXml className="size-4 ml-2" />

            </Button>
          )}
        </div>

        {/* Response Content */}
        <div className="flex flex-col gap-2 grow items-center justify-center min-h-0 min-w-0 p-4 sm:p-6 relative shrink-0 w-full">
          {response ? (
            <div className="flex flex-col gap-4 items-start w-full">
              <div className="bg-gray-50 border border-[#e7e8ea] border-solid rounded-lg p-4 w-full max-h-96 overflow-auto">
                <pre className="text-[10px] sm:text-[12px] text-[#616675] font-mono leading-[1.4] tracking-[-0.12px] whitespace-pre-wrap">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </div>
          ) : (
            <>
              <Code2 className="size-8 text-[#9296a0]" />
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
