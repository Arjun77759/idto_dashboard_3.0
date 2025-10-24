import { motion } from 'framer-motion'

// Image assets from Figma
const imgGrap = "http://localhost:3845/assets/a1884144c89a3902537ed2a6b37e32973e459527.svg"
const imgPlus = "http://localhost:3845/assets/159cf5ad90ce0de038b333a6e8361c10004c921e.svg"

const CurrentBalanceCard = () => {
  const handleRechargeCredits = () => {
    console.log('Recharge credits')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl  w-[281px] h-full"
    >
      <div className="flex flex-col gap-2.5 h-full items-start overflow-hidden relative rounded-[inherit] w-[281px]">
        {/* Current Balance Section */}
        <div className="flex flex-col font-medium gap-4 items-start overflow-hidden p-6 relative shrink-0 w-full">
          <p className="leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
            Current Balance
          </p>
          <p className="leading-[1.24] relative shrink-0 text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
            1,250
          </p>
        </div>

        {/* Usage Section */}
        <div className="flex flex-col gap-4 grow items-start min-h-0 min-w-0 p-6 relative shrink-0 w-full">
          <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Usage This Month
          </p>
          <div className="h-2.5 relative rounded-[30px] shrink-0 w-full">
            <div className="absolute h-2.5 left-0 top-0 w-[233px]">
              <img alt="" className="block max-w-none size-full" src={imgGrap} />
            </div>
          </div>
          <div className="flex flex-col items-start relative shrink-0">
            <div className="flex flex-col font-normal justify-center leading-[0] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px]">
              <p className="leading-[1.4] whitespace-pre">600 credits used out of 1,000</p>
            </div>
          </div>
          <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0 w-full">
            <button
              onClick={handleRechargeCredits}
              className="flex gap-2 h-10 items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit] w-full"
            >
              <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                Recharge Credits
              </p>
              <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
                <div className="flex-none rotate-[90deg]">
                  <div className="overflow-hidden relative size-4">
                    <div className="absolute inset-[16.667%]">
                      <img alt="" className="block max-w-none size-full" src={imgPlus} />
                    </div>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CurrentBalanceCard
