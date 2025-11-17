import { motion } from 'framer-motion'
import { ArrowUpRight, Play, X } from 'lucide-react'

const LOGO_SRC =
  'https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/dashboard_2.0/idto_color_logo.png'

const WelcomeSection = () => {
  const handleClose = () => {
    console.log('Close welcome section')
  }

  const handlePlayVideo = () => {
    console.log('Play video')
  }

  const handleSwitchMode = () => {
    console.log('Switch to live mode')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-[#f7f7f8] border border-[#eceef2] min-w-[280px] relative rounded-2xl shadow-sm w-full"
    >
      <div className="flex flex-col h-full gap-4 sm:gap-5 items-end justify-center overflow-hidden p-4 sm:p-6 lg:p-8 relative rounded-[inherit] w-full">
        <div className="flex items-start justify-between w-full">
          <div className="h-6 sm:h-7 overflow-hidden relative w-[45px] sm:w-[52px]">
            <img
              alt="idto logo"
              className="block max-w-none size-full"
              src={LOGO_SRC}
              style={{
                filter: 'brightness(0) invert(0)',
                WebkitFilter: 'brightness(0) invert(0)',
              }}
            />
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="flex gap-2 items-center px-2 sm:px-3 py-1.5 rounded hover:bg-white transition-colors"
          >
            <p className="font-medium leading-[1.4] text-[10px] sm:text-[12px] text-[#131b31] tracking-[-0.1px] sm:tracking-[-0.12px]">
              Close
            </p>
            <X className="size-3 sm:size-4 text-[#131b31]" />
          </button>
        </div>

        <div className="flex flex-col h-full lg:flex-row gap-4 lg:gap-6 items-start w-full">
          <div className="flex justify-between h-full flex-col gap-4 sm:gap-6 grow items-start min-w-0">
            <p className="font-medium leading-[1.2] text-[20px] sm:text-[24px] lg:text-[28px] text-[#131b31] tracking-[-0.2px] sm:tracking-[-0.24px] lg:tracking-[-0.28px]">
              Welcome aboard! Let’s get you started.
            </p>

            <div className="flex flex-col gap-4 rounded-lg">
              <div className="flex flex-col gap-2">
                <p className="font-medium text-[15px] sm:text-[16px] text-[#131b31] tracking-[-0.16px]">
                  You’re currently in <span className="text-[#b47d1f]">Simulation Mode</span>
                </p>
                <p className="text-[12px] sm:text-[13px] leading-[1.4] text-[#616675]">
                  This environment uses simulated data for testing.
                </p>
                <p className="text-[12px] sm:text-[13px] leading-[1.4] text-[#616675]">
                  Switch to Live Mode to view real-time data, insights, and reports.
                </p>
              </div>

              <button
                type='button'
                onClick={handleSwitchMode}
                className="bg-[#e6e8ff] flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-[#0019ff] font-medium text-[12px] tracking-[-0.12px] hover:bg-[#d8dbff] transition-colors w-max"
              >
                Switch to Live Mode
                <ArrowUpRight className="size-4" />
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#f0f0f4] overflow-hidden rounded-2xl w-full lg:w-[420px] h-[180px] sm:h-[200px] lg:h-[223px] flex items-center justify-center">

            <button
              onClick={handlePlayVideo}
              className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative"
            >
              <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[60px] sm:size-[70px] lg:size-[79px]">
                <div className='bg-[#E6E8FF] rounded-full size-[60px] sm:size-[70px] lg:size-[79px]' />
              </div>
              <div className="[grid-area:1_/_1] ml-4 sm:ml-5 lg:ml-6 mt-4 sm:mt-5 lg:mt-6 relative size-6 sm:size-7 lg:size-8">
                <Play className="size-6 sm:size-7 lg:size-8 text-[#3143e6]" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default WelcomeSection
