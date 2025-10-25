import { motion } from 'framer-motion'
import { Calendar } from 'lucide-react'

const img11 = "http://localhost:3845/assets/1d23a3b007e445753832051adfc9f2947e69b7a6.svg"
const img12 = "http://localhost:3845/assets/ed5bf0472cf2d7a9a3f60e7bdbe2fa928fc002e9.svg"
const img18 = "http://localhost:3845/assets/72f9cf9a6416e01e4e43621edf733810784f001d.svg"
const img19 = "http://localhost:3845/assets/eaa7f932bffa2e62653007615a039d39b48b724e.svg"
const img20 = "http://localhost:3845/assets/b0b4a84f32af6cf332c83e4e7ede4dd496fe50a3.svg"

const ChartSection = () => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="bg-white border border-[#e7e8ea] border-solid min-w-[280px] relative rounded-2xl self-stretch w-[411px]"
    >
      <div className="flex flex-col h-full items-start justify-between min-w-inherit overflow-hidden p-4 relative rounded-[inherit] w-[411px]">
        <div className="flex flex-col grow items-start justify-between min-h-0 min-w-0 relative w-full">
          <div className="flex items-center justify-between relative w-full">
            <div className="content-center flex flex-wrap gap-2 items-center relative rounded-3 shrink-0 w-[238px]">
              <div className="flex flex-col items-start justify-center relative rounded-3 shrink-0">
                <p className="font-medium leading-[1.4] relative text-[12px] text-[#616675] tracking-[-0.12px] w-full">
                  Verification Volume over Time
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center self-stretch">
              <div className="flex gap-1 h-full items-center justify-center px-2 py-0 relative rounded-lg shrink-0">
                <p className="font-medium leading-[1.4] relative text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Jan 2025 - Aug 2025
                </p>
                <div className="overflow-hidden relative shrink-0 size-4">
                  <div className="absolute inset-[6.25%_9.38%]">
                    <Calendar className="size-4 text-[#9296a0]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-4 h-[172px] items-center relative w-full">
            <div className="grow h-full min-h-0 min-w-0 relative shrink-0">
              <div className="absolute flex flex-col inset-0 items-start">
                <div className="h-7 shrink-0 w-5" />
              </div>
              <div className="absolute bottom-0 flex items-center left-0 right-0">
                {months.map((month, index) => (
                  <div key={index} className="grow flex flex-col items-start justify-center min-h-0 min-w-0 relative rounded-3 shrink-0">
                    <p className="font-normal leading-[16px] relative text-[12px] text-[#616675] text-center tracking-[0px] w-full">
                      {month}
                    </p>
                  </div>
                ))}
              </div>
              <div className="absolute inset-0">
                <div className="absolute bottom-0 left-0 right-[-0.06%] top-0">
                  <div className="absolute bottom-0 flex items-center justify-between left-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_26.947px] mask-size-[800.5px_212.841px] right-[0.06%] top-0"
                    style={{ maskImage: `url('${img11}')` }}>
                    {/* Grid lines */}
                    {Array.from({ length: 12 }).map((_, i) => (
                      <div key={i} className="flex h-full items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]"
                        style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
                        <div className="flex-none h-full rotate-[90deg]">
                          <div className="h-full relative w-[240px]">
                            <img alt="" className="block max-w-none size-full" src={img12} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="absolute inset-0">
                  <img alt="" className="block max-w-none size-full" src={img18} />
                </div>
                <div className="absolute bottom-[22%] left-0 right-[-0.06%] top-[8.25%]">
                  <div className="absolute inset-[0.98%_-0.13%_0.39%_-0.13%]">
                    <img alt="" className="block max-w-none size-full" src={img19} />
                  </div>
                </div>
                <div className="absolute inset-[26.25%_8.31%_25.25%_8.38%]">
                  <div className="absolute inset-[-8.39%_-2.85%_-13.19%_-2.85%]">
                    <img alt="" className="block max-w-none size-full" src={img20} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ChartSection
