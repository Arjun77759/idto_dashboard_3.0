import { motion } from 'framer-motion'

// Image assets from Figma
const imgGroup = "http://localhost:3845/assets/a6f05b6a1da8237d798cc243b4d6d0fbca070cbd.svg"
const imgGroup1 = "http://localhost:3845/assets/761a744d3dc3b73dec1bcbe1daac2764f6cbb6f1.svg"
const imgCancel = "http://localhost:3845/assets/89947c75d150bf6df1476eb2b4099175bb5963fa.svg"
const imgPlay = "http://localhost:3845/assets/54aef033ca57ebaafe2038b97ca133885069a97e.svg"
const imgEllipse = "http://localhost:3845/assets/acc614b4456686314da234f1566643c2e93f6228.svg"

const WelcomeSection = () => {
  const handleClose = () => {
    console.log('Close welcome section')
  }

  const handlePlayVideo = () => {
    console.log('Play video')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="border border-[#e7e8ea] border-solid min-w-[280px] relative rounded-2xl shrink-0 w-full"
      style={{
        backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 1154 344\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(6.1241e-14 55.136 -18 1.758e-14 577 172)\\'><foreignObject x=\\'-609.06\\' y=\\'-609.06\\' width=\\\'1218.1\\' height=\\\'1218.1\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgba(230, 232, 255, 1) 0%, rgba(168, 176, 255, 1) 67.605%, rgba(138, 149, 255, 1) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')"
      }}
    >
      <div className="flex flex-col gap-4 items-end justify-center min-w-inherit overflow-hidden p-8 relative rounded-[inherit] w-full">
        <div className="flex items-start justify-between px-0 py-1.5 relative w-full">
          <div className="h-7 overflow-hidden relative w-[52px]">
            <div className="absolute inset-[14.44%_69.17%_14.26%_7.78%]">
              <img alt="" className="block max-w-none size-full" src={imgGroup} />
            </div>
            <div className="absolute inset-[28.75%_7.98%_28.51%_38.52%]">
              <img alt="" className="block max-w-none size-full" src={imgGroup1} />
            </div>
          </div>
          <div className="flex gap-2 items-center px-3 py-1.5 relative rounded">
            <button
              onClick={handleClose}
              className="flex gap-2 items-center px-3 py-1.5 relative rounded"
            >
              <p className="font-medium leading-[1.4] relative text-[12px] text-[#000b6b] text-nowrap tracking-[-0.12px] whitespace-pre">
                Close
              </p>
              <div className="overflow-hidden relative shrink-0 size-4">
                <div className="absolute inset-[17.708%]">
                  <img alt="" className="block max-w-none size-full" src={imgCancel} />
                </div>
              </div>
            </button>
          </div>
        </div>
        <div className="flex gap-4 h-[223px] items-start relative w-full">
          <div className="flex flex-col gap-6 grow items-start min-h-0 min-w-0 p-6 relative rounded-lg shrink-0">
            <p className="font-medium leading-[1.24] relative text-[32px] text-[#000b6b] tracking-[-0.32px] w-full">
              Welcome aboard!<br />
              Let's get you started.
            </p>
          </div>
          <div className="bg-gradient-to-r from-white gap-2.5 h-[223px] items-center justify-center overflow-hidden px-[277px] py-[95px] relative rounded-lg shrink-0 to-white w-[485px]">
            <button
              onClick={handlePlayVideo}
              className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative"
            >
              <div className="[grid-area:1_/_1] ml-0 mt-0 relative size-[79px]">
                <img alt="" className="block max-w-none size-full" src={imgEllipse} />
              </div>
              <div className="[grid-area:1_/_1] ml-6 mt-6 relative size-8">
                <div className="absolute inset-[13.54%_17.71%]">
                  <img alt="" className="block max-w-none size-full" src={imgPlay} />
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default WelcomeSection
