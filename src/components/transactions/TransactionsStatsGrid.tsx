const TransactionsStatsGrid = () => {
  return (
    <div className="bg-white border border-[#e7e8ea] border-solid h-[125px] relative rounded-2xl shrink-0 w-full">
      <div className="grid grid-cols-4 h-[125px] overflow-hidden relative rounded-[inherit] w-full">
        {/* Total Today */}
        <div className="border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Total Today
            </p>
            <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
              320
            </p>
          </div>
        </div>
        
        {/* Success Rate */}
        <div className="border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Success Rate
            </p>
            <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
              92%
            </p>
          </div>
        </div>
        
        {/* Average Time */}
        <div className="border-r border-[#e7e8ea] border-solid relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Average Time
            </p>
            <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
              2.1s
            </p>
          </div>
        </div>
        
        {/* Total Today (duplicate) */}
        <div className="relative shrink-0">
          <div className="flex flex-col gap-4 items-start overflow-hidden p-6 relative rounded-[inherit] size-full">
            <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
              Total Today
            </p>
            <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
              320
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransactionsStatsGrid
