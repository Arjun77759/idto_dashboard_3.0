import { Button } from '@/components/ui/button'
import { Receipt, ArrowLeft, FileSpreadsheet } from 'lucide-react'

interface TransactionHeaderProps {
  onBack: () => void
  onExportCsv: () => void
}

const TransactionHeader = ({ onBack, onExportCsv }: TransactionHeaderProps) => {
  return (
    <>
      {/* Transactions Header */}
      <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
        <Receipt className="size-5 sm:size-6 text-[#131b31]" />
        <p className="font-medium leading-[1.4] relative text-lg sm:text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
          Transactions
        </p>
      </div>

      {/* Back and Export Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between relative shrink-0 w-full">
        <Button
          variant="ghost"
          onClick={onBack}
          className="text-[#9296a0] hover:text-[#131b31] hover:bg-transparent px-3 py-1.5 h-auto"
        >
          <ArrowLeft className="size-4 mr-2" />
          <span className="font-medium text-[12px] text-nowrap tracking-[-0.12px]">
            Back
          </span>
        </Button>
        
        <div className="flex flex-wrap gap-2 sm:gap-3 items-center relative shrink-0 w-full sm:w-auto">
          <Button 
            onClick={onExportCsv}
            className="bg-[#e6e8ff] hover:bg-[#d0d4ff] text-[#0019ff] border-0 px-2 py-3.5 h-auto rounded-lg flex-1 sm:flex-none"
          >
            <span className="font-medium text-[12px] text-nowrap tracking-[-0.12px]">
              Export CSV
            </span>
            <FileSpreadsheet className="size-4 ml-2" />
          </Button>
        </div>
      </div>
    </>
  )
}

export default TransactionHeader
