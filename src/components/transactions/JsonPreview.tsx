// Image assets from Figma
const imgCopyIcon = "http://localhost:3845/assets/fea1075794bb7f6173b15387e1844ccfaee70159.svg"

interface JsonPreviewProps {
  jsonData: any
  onCopy: () => void
}

const JsonPreview = ({ jsonData, onCopy }: JsonPreviewProps) => {
  return (
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full relative rounded-2xl shrink-0">
      <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
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
            <div className="overflow-hidden relative shrink-0 size-4">
              <div className="absolute inset-[8.333%]">
                <div className="absolute inset-[-7.5%]">
                  <img alt="" className="block max-w-none size-full" src={imgCopyIcon} />
                </div>
              </div>
            </div>
          </button>
        </div>
        <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid grow relative rounded shrink-0 w-full">
          <div className="flex flex-col grow items-start relative rounded shrink-0 w-full">
            <div className="flex flex-col gap-2 grow items-start overflow-hidden px-2 py-3.5 relative rounded-lg shrink-0 w-full">
              <pre className="font-normal leading-[1.4] text-[12px] text-[#9296a0] tracking-[-0.12px] whitespace-pre-wrap">
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
