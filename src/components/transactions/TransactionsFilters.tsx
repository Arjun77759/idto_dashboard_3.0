import { Button } from '@/components/ui/button'

// Image assets from Figma
const imgSearch = "http://localhost:3845/assets/dd51b8c4adb7c8615abf036bb45f6c82ed4a7815.svg"
const imgFileExport = "http://localhost:3845/assets/03e40a8e830051f869b267ea98e64f833c2f5518.svg"
const imgDownload = "http://localhost:3845/assets/843b5e757f3e18c044e38bd591197daeb56b86e6.svg"
const imgCalendar = "http://localhost:3845/assets/0767fe49935de804ac4d4ed37fa4a369cccdeb5e.svg"
const imgArrowDown = "http://localhost:3845/assets/5c48ecd60b568c24fe6f0982e01796d95745aaf4.svg"
const imgReset = "http://localhost:3845/assets/e1073cf8fbc2aaf8b5b207843936bedf5f904d5d.svg"

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
            <div className="relative shrink-0 size-6">
              <div className="absolute inset-[16.67%_20.83%_20.83%_16.67%]">
                <img alt="" className="block max-w-none size-full" src={imgSearch} />
              </div>
            </div>
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

      {/* Filter Controls */}
      <div className="flex h-10 items-center justify-between relative shrink-0 w-full">
        <div className="flex gap-4 grow h-full items-center min-h-0 min-w-0 relative shrink-0">
          <Button variant="outline" className="border-[#e7e8ea] h-full rounded-lg">
            <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Sep 9, 2024 - Sep 15, 2024
            </p>
            <div className="overflow-hidden relative shrink-0 size-4 ml-2">
              <div className="absolute inset-[6.25%_9.38%]">
                <img alt="" className="block max-w-none size-full" src={imgCalendar} />
              </div>
            </div>
          </Button>
          
          <Button variant="outline" className="border-[#e7e8ea] h-full rounded-lg">
            <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Document Type
            </p>
            <div className="flex items-center justify-center relative shrink-0 size-4 ml-2">
              <div className="flex-none rotate-90">
                <div className="overflow-hidden relative size-4">
                  <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                    <img alt="" className="block max-w-none size-full" src={imgArrowDown} />
                  </div>
                </div>
              </div>
            </div>
          </Button>
          
          <Button variant="outline" className="border-[#e7e8ea] h-full rounded-lg">
            <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Status
            </p>
            <div className="flex items-center justify-center relative shrink-0 size-4 ml-2">
              <div className="flex-none rotate-90">
                <div className="overflow-hidden relative size-4">
                  <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                    <img alt="" className="block max-w-none size-full" src={imgArrowDown} />
                  </div>
                </div>
              </div>
            </div>
          </Button>
          
          <Button variant="outline" className="border-[#e7e8ea] h-full rounded-lg">
            <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Location
            </p>
            <div className="flex items-center justify-center relative shrink-0 size-4 ml-2">
              <div className="flex-none rotate-90">
                <div className="overflow-hidden relative size-4">
                  <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                    <img alt="" className="block max-w-none size-full" src={imgArrowDown} />
                  </div>
                </div>
              </div>
            </div>
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
          <div className="overflow-hidden relative shrink-0 size-4 ml-1">
            <div className="absolute inset-[11.6%_16.67%]">
              <img alt="" className="block max-w-none size-full" src={imgReset} />
            </div>
          </div>
        </Button>
      </div>
    </>
  )
}

export default TransactionsFilters
