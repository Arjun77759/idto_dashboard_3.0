import { motion } from 'framer-motion'

// Image assets from Figma
const imgAlert = "http://localhost:3845/assets/fe0a734bc63c35d83adad3514cf4a7dfbb17408b.svg"
const imgArrow = "http://localhost:3845/assets/1004fe7ff2c1e756e0c1c289091cfefc35a00158.svg"

const SimulationModeBanner = () => {
  const handleSwitchToProduction = () => {
    console.log('Switch to production')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#fff7ea] flex items-center justify-between overflow-hidden px-4 py-2 relative rounded-[50px] shrink-0 w-full"
    >
      <div className="flex gap-2.5 items-center relative">
        <div className="overflow-hidden relative shrink-0 size-4">
          <div className="absolute inset-[9.38%_5.21%]">
            <img alt="" className="block max-w-none size-full" src={imgAlert} />
          </div>
        </div>
        <p className="font-semibold leading-[1.4] relative text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
          <span>You are in </span>
          <span className="font-bold text-[#b47d1f]">Simulation Mode</span>
          <span> — unlock real-time data and actionable insights by switching to Live Mode!</span>
        </p>
      </div>
      <div className="bg-[#b47d1f] border border-[#e7e8ea] border-solid h-10 relative rounded-[35px] shrink-0">
        <button
          onClick={handleSwitchToProduction}
          className="flex gap-2 h-10 items-center justify-center overflow-hidden px-4 py-2 relative rounded-[inherit]"
        >
          <p className="font-medium leading-[1.4] relative text-[12px] text-white text-nowrap tracking-[-0.12px] whitespace-pre">
            Switch to Production
          </p>
          <div className="overflow-hidden relative shrink-0 size-4">
            <div className="absolute inset-[22.917%]">
              <img alt="" className="block max-w-none size-full" src={imgArrow} />
            </div>
          </div>
        </button>
      </div>
    </motion.div>
  )
}

export default SimulationModeBanner
