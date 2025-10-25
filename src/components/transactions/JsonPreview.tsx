import { Copy } from 'lucide-react'

interface JsonPreviewProps {
  jsonData: any
  onCopy: () => void
}

const JsonPreview = ({ jsonData, onCopy }: JsonPreviewProps) => {
  return (
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full relative rounded-2xl shrink-0 w-full lg:w-auto">
      <div className="flex flex-col gap-4 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] size-full">
        <div className="flex items-center justify-between relative shrink-0 w-full">
          <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#131b31] text-nowrap tracking-[-0.12px] whitespace-pre">
            JSON Preview
          </p>
          <button 
            onClick={onCopy}
            className="flex gap-2 items-center relative shrink-0 hover:opacity-70 transition-opacity"
          >
            <p className="font-medium leading-[1.4] text-[12px] text-[#8a95ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              Copy
            </p>
            <Copy className="size-4 text-[#8a95ff]" />
          </button>
        </div>
        <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid grow relative rounded shrink-0 w-full">
          <div className="flex flex-col grow items-start relative rounded shrink-0 w-full">
            <div className="flex flex-col gap-2 grow items-start overflow-hidden px-2 py-3.5 relative rounded-lg shrink-0 w-full">
              <pre className="font-normal leading-[1.4] text-[10px] sm:text-[12px] text-[#9296a0] tracking-[-0.12px] whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(jsonData, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default JsonPreview
