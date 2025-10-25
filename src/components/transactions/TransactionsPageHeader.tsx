import { Receipt } from 'lucide-react'

const TransactionsPageHeader = () => {
  return (
    <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
      <Receipt className="size-5 sm:size-6 text-[#131b31]" />
      <p className="font-medium leading-[1.4] relative text-lg sm:text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
        Transactions
      </p>
    </div>
  )
}

export default TransactionsPageHeader
