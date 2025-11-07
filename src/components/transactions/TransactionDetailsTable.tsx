interface DetailItem {
  field: string
  value: string
}

interface TransactionDetailsTableProps {
  details: DetailItem[]
}

const TransactionDetailsTable = ({ details }: TransactionDetailsTableProps) => {
  const getValueColor = (field: string, value: string) => {
    if (field === 'Status') {
      return value === 'Success' ? '#54eebe' : '#ff4d4f'
    }
    return '#9296a0' // Default color
  }

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid flex-1 relative rounded-2xl w-full lg:w-auto">
      <div className="box-border flex flex-col gap-4 items-start overflow-clip p-6 relative rounded-[inherit] size-full">
        <p className="font-['Inter'] font-medium leading-[1.4] not-italic relative shrink-0 text-[12px] text-[#131b31] tracking-[-0.12px] w-full whitespace-pre-wrap">
          Transaction Details
        </p>
        <div className="bg-white border border-[#e7e8ea] border-solid flex-1 min-h-0 relative rounded w-full">
          <div className="flex flex-col items-start overflow-clip relative rounded-[inherit] size-full">
            
            {/* Table Header */}
            <div className="bg-white flex items-start relative shrink-0 w-full">
              <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[280px]">
                <div className="h-10 overflow-clip relative rounded-[inherit] w-[280px]">
                  <p className="absolute bottom-8 font-['Inter'] font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%] whitespace-pre-wrap">
                    Field
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="flex-1 min-w-0 h-10 overflow-clip relative shrink-0">
                <p className="absolute bottom-8 font-['Inter'] font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%] whitespace-pre-wrap">
                  Value
                </p>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>

            {/* Table Rows */}
            {details.map((detail, index) => (
              <div key={index} className="bg-[#f7f7f8] flex items-start relative shrink-0 w-full">
                <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[280px]">
                  <div className="h-10 overflow-clip relative rounded-[inherit] w-[280px]">
                    <p className="absolute font-['Inter'] font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px] whitespace-pre-wrap">
                      {detail.field}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 h-10 overflow-clip relative shrink-0">
                  <p 
                    className="absolute font-['Inter'] font-normal leading-6 left-4 not-italic right-4 text-[14px] top-2 tracking-[-0.084px] whitespace-pre-wrap truncate"
                    style={{ color: getValueColor(detail.field, detail.value) }}
                  >
                    {detail.value}
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionDetailsTable
