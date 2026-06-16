import { motion } from 'framer-motion'
import { Play, Radio } from 'lucide-react'

const SimulationModeBanner = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full rounded-[18px] border border-[rgba(0,25,255,0.1)] bg-gradient-to-r from-[rgba(0,25,255,0.03)] to-[rgba(0,229,158,0.06)] px-[21px] py-[17px]"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#0019ff] text-white">
            <Radio className="size-4" />
          </div>
          <div>
            <p className="text-[14px] font-semibold leading-[20.25px] text-[#171717]">
              You're in Sandbox Mode
            </p>
            <p className="text-[12px] font-normal leading-[18.75px] text-[#525252]">
              Follow the setup guide to start building with dummy data - switch to production any time.
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            window.open('https://drive.google.com/file/d/1vV3UIcOSrKOvh0_L_qFAPzMoKwroDMsI/view?usp=sharing', '_blank')
          }}
          type="button"
          className="inline-flex h-8 shrink-0 items-center justify-center gap-[14px] rounded-full bg-[#0019ff] px-4 text-[12px] font-medium leading-4 text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
        >
          <Play className="size-3.5" fill="currentColor" />
          View Tutorial
        </button>
      </div>
    </motion.div>
  )
}

export default SimulationModeBanner
