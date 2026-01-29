import { Button } from '@/components/ui/button'
import { Receipt, ArrowLeft, FileSpreadsheet } from 'lucide-react'

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
            onClick={onDownloadReport}
            className="flex justify-center items-center gap-2 border-0"
            style={{
              padding: "14px 8px",
              borderRadius: "8px",
              background: "var(--Primary-0, #E6E8FF)",
            }}
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre text-[#0019ff]">
              Download Report
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 20H19V18H5V20Z" fill="#0019ff"/>
                <path d="M12 16L16 12H13V4H11V12H8L12 16Z" fill="#0019ff"/>
              </svg>

          </Button>
          <Button
            onClick={onExportCsv}
            className="flex justify-center items-center gap-2 border-0"
            style={{
              padding: "14px 8px",
              borderRadius: "8px",
              background: "var(--Primary-0, #E6E8FF)",
            }}
          >
            <p className="font-medium leading-[1.4] text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre text-[#0019ff]">
              Export CSV
            </p>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M13.667 11.862L11.1956 14.3334L10.2528 13.3906L11.1147 12.5287L7.39085 12.5287L7.39085 11.1954L11.1147 11.1954L10.2528 10.3334L11.1956 9.39062L13.667 11.862Z" fill="#0019FF" />
              <path d="M12.3333 0.651515C12.3333 0.291693 12.0427 0 11.6842 0H4.92411L0 4.94226V13.6818C0 14.0416 0.290623 14.3333 0.649123 14.3333H5.84204V13.0303H1.29818V5.86367H5.84204L5.84204 1.30306H11.035V7.83336H12.3333V0.651515Z" fill="#0019FF" />
            </svg>
          </Button>
        </div>
      </div>
    </>
  )
}

export default TransactionHeader
