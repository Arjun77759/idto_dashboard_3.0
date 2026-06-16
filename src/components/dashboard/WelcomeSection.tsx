import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Rocket, Zap } from 'lucide-react'
import SwitchToProductionModal from '@/components/modals/switchToProductionModal/SwitchToProductionModal'

export const LOGO_SRC =
  'https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/Dashboard+walkthrough+v1.mov'

const WelcomeSection = () => {
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)

  const handleConfirmSwitch = () => {
    console.log('Confirmed switch to production')
    setIsSwitchModalOpen(false)
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="relative w-full overflow-hidden rounded-[22px] bg-gradient-to-r from-[#3168dd] via-[#118fcb] to-[#02b8aa] px-[50px] py-8 text-white shadow-[0_16px_38px_rgba(17,143,203,0.22)]"
    >
      <div className="relative z-10 flex max-w-[845px] gap-[18px]">
        <div className="relative grid size-14 shrink-0 place-items-center rounded-[18px] bg-white/16 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.2)] backdrop-blur">
          <Rocket className="size-6 text-white" />
          <span className="absolute -right-1 -top-1 size-3 rounded-full bg-[#ffde59]" />
        </div>

        <div className="flex flex-col items-start">
          <div className="mb-[18px] inline-flex h-[23px] items-center gap-2 rounded-full border border-[#998332] bg-[rgba(255,210,48,0.2)] px-3 py-1 text-[10px] font-bold leading-[15px] tracking-[1.6px] text-[#fee685] backdrop-blur-[4px]">
            <Zap className="size-3 shrink-0" />
            You're in sandbox
          </div>
          <h2 className="text-[40px] font-bold leading-none tracking-[-0.7px] text-white">
            Stop testing. <span className="text-[#ffe28a]">Start verifying real users.</span>
          </h2>
          <p className="mt-[18px] max-w-[769px] text-[18px] leading-7 text-white/85">
            Flip one switch to go live same endpoints, real UIDAI / NPCI data, production-grade rate limits. Onboarding finishes in under 2 minutes.
          </p>
          <button
            type="button"
            onClick={() => setIsSwitchModalOpen(true)}
            className="mt-5 inline-flex h-[42px] items-center gap-2 rounded-full bg-white px-5 text-[14px] font-bold leading-5 text-[#3168dd] shadow-[0_12px_24px_rgba(19,27,49,0.18)]"
          >
            Move to Production
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>

      <div className="absolute -right-20 -top-24 size-72 rounded-full bg-white/10 blur-3xl" />
      <SwitchToProductionModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        onConfirm={handleConfirmSwitch}
      />
    </motion.section>
  )
}

export default WelcomeSection
