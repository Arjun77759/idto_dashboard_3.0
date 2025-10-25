import { Button } from '@/components/ui/button'
import { Receipt, ArrowLeft, FileSpreadsheet, Download } from 'lucide-react'

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
        <Receipt className="size-6 text-[#131b31]" />
        <p className="font-medium leading-[1.4] relative text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
          Transactions
        </p>
      </div>

      {/* Back and Export Controls */}
      <div className="flex items-center justify-between relative shrink-0 w-full">
        <div className="flex gap-2 items-center px-3 py-1.5 relative rounded">
          <ArrowLeft className="size-4 text-[#9296a0]" />
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
            <FileSpreadsheet className="size-4 ml-2 text-[#0019ff]" />
          </Button>
          
          <Button 
            onClick={onDownloadReport}
            className="bg-[#e6e8ff] hover:bg-[#d0d4ff] text-[#0019ff] border-0 px-2 py-3.5 h-auto rounded-lg"
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
              Download Report
            </p>
            <Download className="size-4 ml-2 text-[#0019ff]" />
          </Button>
        </div>
      </div>
    </>
  )
}

export default TransactionHeader
