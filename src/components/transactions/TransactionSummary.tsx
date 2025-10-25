import { Copy } from 'lucide-react'

interface TransactionSummaryProps {
  id: string
  date: string
  api: string
  status: string
  statusColor: string
  onCopyId: () => void
}

const TransactionSummary = ({ 
  id, 
  date, 
  api, 
  status, 
  statusColor, 
  onCopyId 
}: TransactionSummaryProps) => {
  return (
    <div className="bg-white border border-[#e7e8ea] border-solid h-auto sm:h-[105px] relative rounded-2xl shrink-0 w-full">
      <div className="grid grid-cols-2 sm:grid-cols-4 h-auto sm:h-[105px] overflow-hidden relative rounded-[inherit] w-full">
        {/* Transaction ID */}
        <div className="border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Transaction ID
            </p>
            <div className="flex items-center justify-between relative shrink-0 w-full">
              <p className="font-normal leading-6 relative shrink-0 text-[14px] text-[#131b31] text-nowrap tracking-[-0.084px] whitespace-pre">
                {id}
              </p>
              <button 
                onClick={onCopyId}
                className="shrink-0 size-4 hover:opacity-70 transition-opacity"
              >
                <Copy className="size-4 text-[#9296a0]" />
              </button>
            </div>
          </div>
        </div>
        
        {/* Date & Time */}
        <div className="border-r-0 sm:border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Date & Time
            </p>
            <p className="font-normal leading-6 relative shrink-0 text-[14px] text-[#131b31] text-nowrap tracking-[-0.084px] whitespace-pre">
              {date}
            </p>
          </div>
        </div>
        
        {/* API Used */}
        <div className="border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              API Used
            </p>
            <p className="font-normal leading-6 relative shrink-0 text-[14px] text-[#131b31] text-nowrap tracking-[-0.084px] whitespace-pre">
              {api}
            </p>
          </div>
        </div>
        
        {/* Status */}
        <div className="relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Status
            </p>
            <p className="font-normal leading-6 relative shrink-0 text-[14px] text-nowrap tracking-[-0.084px] whitespace-pre" style={{ color: statusColor }}>
              {status}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionSummary
