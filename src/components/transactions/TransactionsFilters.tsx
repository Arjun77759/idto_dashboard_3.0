import { Button } from '@/components/ui/button'
import { Search, FileSpreadsheet, Download, Calendar, ChevronDown, RotateCcw } from 'lucide-react'

interface TransactionsFiltersProps {
  onExportCsv: () => void
  onDownloadReport: () => void
  onReset: () => void
}

const TransactionsFilters = ({ onExportCsv, onDownloadReport, onReset }: TransactionsFiltersProps) => {
  return (
    <>
      {/* Search and Export Header */}
      <div className="flex items-center justify-between relative rounded shrink-0 w-full">
        <div className="flex flex-row items-center self-stretch">
          <div className="border border-[#e7e8ea] border-solid flex h-full items-center justify-between px-4 py-2 relative rounded-lg shrink-0 w-[500px]">
            <div className="flex gap-2 items-center relative shrink-0">
              <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                Search for Id, name product etc
              </p>
            </div>
            <Search className="size-6 text-[#9296a0]" />
          </div>
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

      {/* Filter Controls */}
      <div className="flex h-10 items-center justify-between relative shrink-0 w-full">
        <div className="flex gap-4 grow h-full items-center min-h-0 min-w-0 relative shrink-0">
          <Button variant="outline" className="border-[#e7e8ea] h-full rounded-lg">
            <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Sep 9, 2024 - Sep 15, 2024
            </p>
            <Calendar className="size-4 ml-2 text-[#9296a0]" />
          </Button>
          
          <Button variant="outline" className="border-[#e7e8ea] h-full rounded-lg">
            <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Document Type
            </p>
            <ChevronDown className="size-4 ml-2 text-[#9296a0]" />
          </Button>
          
          <Button variant="outline" className="border-[#e7e8ea] h-full rounded-lg">
            <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Status
            </p>
            <ChevronDown className="size-4 ml-2 text-[#9296a0]" />
          </Button>
          
          <Button variant="outline" className="border-[#e7e8ea] h-full rounded-lg">
            <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Location
            </p>
            <ChevronDown className="size-4 ml-2 text-[#9296a0]" />
          </Button>
        </div>
        
        <Button 
          onClick={onReset}
          variant="outline" 
          className="border-[#e7e8ea] h-full rounded-lg"
        >
          <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Reset
          </p>
          <RotateCcw className="size-4 ml-1 text-[#9296a0]" />
        </Button>
      </div>
    </>
  )
}

export default TransactionsFilters
