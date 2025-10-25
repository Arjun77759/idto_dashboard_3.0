// Image assets from Figma
const imgCopy = "http://localhost:3845/assets/e1073cf8fbc2aaf8b5b207843936bedf5f904d5d.svg"

interface Transaction {
  id: string
  type: string
  date: string
  status: string
  statusColor: string
}

interface TransactionsTableProps {
  transactions: Transaction[]
  onViewDetails: (transactionId: string) => void
}

const TransactionsTable = ({ transactions, onViewDetails }: TransactionsTableProps) => {
  return (
    <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-md shrink-0 w-full">
      <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] w-full">
        
        {/* Table Header */}
        <div className="bg-white flex items-start relative shrink-0 w-full">
          <div className="h-10 overflow-hidden relative shrink-0 w-12">
            <div className="absolute bg-[#f7f7f8] border border-[#131b31] border-solid left-1/2 rounded size-4 top-3 translate-x-[-50%]" />
            <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
          </div>
          <div className="border-r border-[#e7e8ea] border-solid grow h-10 min-h-0 min-w-0 relative shrink-0">
            <div className="h-10 overflow-hidden relative rounded-[inherit] w-full">
              <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                Transaction ID
              </p>
              <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
            </div>
          </div>
          <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[252px]">
            <div className="h-10 overflow-hidden relative rounded-[inherit] w-[252px]">
              <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                Type
              </p>
              <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
            </div>
          </div>
          <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[224px]">
            <div className="h-10 overflow-hidden relative rounded-[inherit] w-[224px]">
              <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                Date & Time
              </p>
              <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
            </div>
          </div>
          <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[148px]">
            <div className="h-10 overflow-hidden relative rounded-[inherit] w-[148px]">
              <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                Status
              </p>
              <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
            </div>
          </div>
          <div className="h-10 overflow-hidden relative shrink-0 w-[107px]">
            <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] text-center tracking-[-0.084px] translate-y-[100%]">
              Actions
            </p>
            <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
          </div>
          <div className="h-10 overflow-hidden relative shrink-0 w-16">
            <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
          </div>
        </div>

        {/* Table Rows */}
        {transactions.map((transaction, index) => (
          <div key={index} className={`${index % 2 === 0 ? 'bg-[#f7f7f8]' : 'bg-white'} flex items-start relative shrink-0 w-full`}>
            <div className="h-10 overflow-hidden relative shrink-0 w-12">
              <div className={`absolute ${index % 2 === 0 ? 'bg-[#f7f7f8]' : 'bg-white'} border border-[#9296a0] border-solid left-1/2 rounded size-4 top-3 translate-x-[-50%]`} />
              <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
            </div>
            <div className="border-r border-[#e7e8ea] border-solid grow h-10 min-h-0 min-w-0 relative shrink-0">
              <div className="h-10 overflow-hidden relative rounded-[inherit] w-full">
                <div className="absolute flex gap-2 items-center left-4 top-2">
                  <p className="font-normal leading-6 text-[14px] text-[#9296a0] text-nowrap tracking-[-0.084px] whitespace-pre">
                    {transaction.id}
                  </p>
                  <div className="overflow-hidden relative shrink-0 size-4">
                    <div className="absolute inset-[5.208%]">
                      <img alt="" className="block max-w-none size-full" src={imgCopy} />
                    </div>
                  </div>
                </div>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>
            <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[252px]">
              <div className="h-10 overflow-hidden relative rounded-[inherit] w-[252px]">
                <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                  {transaction.type}
                </p>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>
            <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[224px]">
              <div className="h-10 overflow-hidden relative rounded-[inherit] w-[224px]">
                <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px] whitespace-pre-wrap">
                  {transaction.date}
                </p>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>
            <div className="border-r border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[148px]">
              <div className="h-10 overflow-hidden relative rounded-[inherit] w-[148px]">
                <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] top-2 tracking-[-0.084px]" style={{ color: transaction.statusColor }}>
                  {transaction.status}
                </p>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>
            <div className="h-10 overflow-hidden relative shrink-0 w-[107px]">
              <button 
                onClick={() => onViewDetails(transaction.id)}
                className="absolute border border-[#e7e8ea] border-solid h-[29px] left-1/2 rounded-lg top-1.5 translate-x-[-50%] w-[79px] hover:bg-[#f7f7f8] transition-colors"
              >
                <div className="flex gap-1 h-[29px] items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit] w-[79px]">
                  <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-center text-nowrap tracking-[-0.12px] whitespace-pre">
                    See details
                  </p>
                </div>
              </button>
              <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
            </div>
            <div className="h-10 overflow-hidden relative shrink-0 w-16">
              <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TransactionsTable
