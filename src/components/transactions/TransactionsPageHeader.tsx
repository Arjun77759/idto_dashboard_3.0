// Image assets from Figma
const imgTransaction = "http://localhost:3845/assets/911fef62cce1a7942624cb80789b75a9a7cd22d5.svg"

const TransactionsPageHeader = () => {
  return (
    <div className="flex gap-2 items-center px-3 py-1.5 relative rounded w-full">
      <div className="overflow-hidden relative shrink-0 size-6">
        <div className="absolute inset-[5.208%]">
          <img alt="" className="block max-w-none size-full" src={imgTransaction} />
        </div>
      </div>
      <p className="font-medium leading-[1.4] relative text-[20px] text-[#131b31] text-nowrap tracking-[-0.2px] whitespace-pre">
        Transactions
      </p>
    </div>
  )
}

export default TransactionsPageHeader
