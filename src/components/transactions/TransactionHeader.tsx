import { Button } from '@/components/ui/button'

// Image assets from Figma
const imgTransaction = "http://localhost:3845/assets/f8a2584ddc442f342a28fd590888ed09b2909983.svg"
const imgArrowUp = "http://localhost:3845/assets/190f53b651f845c9b4d9a15585c39fa9fe6fd8b6.svg"
const imgFileExport = "http://localhost:3845/assets/41d55edbebfe3cd625ee4efa970f164630aa1cb4.svg"
const imgDownload = "http://localhost:3845/assets/8d96502e2e893e5dc8b63174c64c644849ac5766.svg"

interface TransactionHeaderProps {
  onBack: () => void
  onExportCsv: () => void
  onDownloadReport: () => void
}

const TransactionHeader = ({ onBack, onExportCsv, onDownloadReport }: TransactionHeaderProps) => {
  return (
    <>
      {/* Transactions Header */}
      <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
        <div className="overflow-hidden relative shrink-0 size-6">
          <div className="absolute inset-[5.208%]">
            <img alt="" className="block max-w-none size-full" src={imgTransaction} />
          </div>
        </div>
        <p className="font-medium leading-[1.4] relative text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
          Transactions
        </p>
      </div>

      {/* Back and Export Controls */}
      <div className="flex items-center justify-between relative shrink-0 w-full">
        <div className="flex gap-2 items-center px-3 py-1.5 relative rounded">
          <div className="flex items-center justify-center relative shrink-0 size-4">
            <div className="flex-none rotate-[270deg]">
              <div className="overflow-hidden relative size-4">
                <div className="absolute inset-[14.58%_27.08%]">
                  <img alt="" className="block max-w-none size-full" src={imgArrowUp} />
                </div>
              </div>
            </div>
          </div>
          <button 
            onClick={onBack}
            className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre hover:text-[#131b31] transition-colors"
          >
            Back
          </button>
        </div>
        
        <div className="flex gap-3 items-center relative shrink-0">
          <Button 
            onClick={onExportCsv}
            className="bg-[#e6e8ff] hover:bg-[#d0d4ff] text-[#0019ff] border-0 px-2 py-3.5 h-auto rounded-lg"
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
              Export CSV
            </p>
            <div className="overflow-hidden relative shrink-0 size-4 ml-2">
              <div className="absolute inset-[5.21%_7.29%]">
                <img alt="" className="block max-w-none size-full" src={imgFileExport} />
              </div>
            </div>
          </Button>
          
          <Button 
            onClick={onDownloadReport}
            className="bg-[#e6e8ff] hover:bg-[#d0d4ff] text-[#0019ff] border-0 px-2 py-3.5 h-auto rounded-lg"
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
              Download Report
            </p>
            <div className="overflow-hidden relative shrink-0 size-4 ml-2">
              <div className="absolute inset-[18.75%_20.83%]">
                <img alt="" className="block max-w-none size-full" src={imgDownload} />
              </div>
            </div>
          </Button>
        </div>
      </div>
    </>
  )
}

export default TransactionHeader
