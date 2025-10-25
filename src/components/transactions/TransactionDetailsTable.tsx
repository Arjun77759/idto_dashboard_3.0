interface DetailItem {
  field: string
  value: string
}

interface TransactionDetailsTableProps {
  details: DetailItem[]
}

const TransactionDetailsTable = ({ details }: TransactionDetailsTableProps) => {
  return (
    <div className="bg-white border border-[#e7e8ea] border-solid grow h-full relative rounded-2xl shrink-0">
      <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
        <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#131b31] tracking-[-0.12px] w-full">
          Transaction Details
        </p>
        <div className="bg-white border border-[#e7e8ea] border-solid grow relative rounded shrink-0 w-full">
          <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] size-full">
            
            {/* Table Header */}
            <div className="bg-white flex items-start relative shrink-0 w-full">
              <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[205px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[205px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Field
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="grow h-10 overflow-hidden relative shrink-0">
                <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                  Value
                </p>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>

            {/* Table Rows */}
            {details.map((detail, index) => (
              <div key={index} className="bg-[#f7f7f8] flex items-start relative shrink-0 w-full">
                <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[205px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[205px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {detail.field}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="grow h-10 overflow-hidden relative shrink-0">
                  <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
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
