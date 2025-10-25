import { motion } from 'framer-motion'
import { useState } from 'react'
import SwitchToProductionModal from '../modals/switchToProductionModal/SwitchToProductionModal'
import { AlertTriangle, ArrowRight } from 'lucide-react'

const SimulationModeBanner = () => {
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)

  const handleSwitchToProduction = () => {
    setIsSwitchModalOpen(true)
  }

  const handleConfirmSwitch = () => {
    console.log('Confirmed switch to production')
    // Add your production switch logic here
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-[#fff7ea] flex items-center justify-between overflow-hidden px-4 py-2 relative rounded-[50px] shrink-0 w-fit gap-[50px]"
    >
      <div className="flex gap-2.5 items-center relative">
        <AlertTriangle className="size-4 text-[#b47d1f]" />
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
          <ArrowRight className="size-4 text-white" />
        </button>
      </div>

      {/* Switch to Production Modal */}
      <SwitchToProductionModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        onConfirm={handleConfirmSwitch}
      />
    </motion.div>
  )
}

export default SimulationModeBanner
