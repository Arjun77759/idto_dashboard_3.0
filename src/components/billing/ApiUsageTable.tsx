import { motion } from 'framer-motion'

const ApiUsageTable = () => {
  const apiUsageData = [
    {
      name: "Digilocker Initiate Session",
      calls: 6,
      perUnitCost: "₹0",
      cost: "₹0"
    },
    {
      name: "Pan Nsdl",
      calls: 8,
      perUnitCost: "₹1",
      cost: "₹7"
    },
    {
      name: "Pan Verification",
      calls: 7,
      perUnitCost: "₹1",
      cost: "₹8"
    },
    {
      name: "Mobile Verify OTP",
      calls: 11,
      perUnitCost: "₹1.5",
      cost: "₹10.5"
    },
    {
      name: "Pan All In One",
      calls: 7,
      perUnitCost: "₹1.5",
      cost: "₹7"
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white border border-[#e7e8ea] border-solid grow min-h-0 min-w-px relative rounded-2xl shrink-0 w-full lg:w-auto"
    >
      <div className="flex flex-col gap-4 sm:gap-6 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] w-full">
        <div className="flex font-medium items-center justify-between leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] w-full whitespace-pre">
          <p className="relative shrink-0">
            API Usage
          </p>
          <p className="relative shrink-0">
            View all
          </p>
        </div>

        <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid relative rounded-md shrink-0 w-full overflow-x-auto">
          <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] w-full min-w-[500px]">
            {/* Table Header */}
            <div className="bg-white flex items-start relative shrink-0 w-full">
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[205px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[205px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    API Name
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[76px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[76px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Calls
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[96px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[96px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-3 not-italic right-[11px] text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Per Unit Cost
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="h-10 overflow-hidden relative shrink-0 w-[77px]">
                <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                  Cost
                </p>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
              <div className="grow h-10 min-h-0 min-w-px overflow-hidden relative shrink-0">
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>

            {/* Table Rows */}
            {apiUsageData.map((row, index) => (
              <div key={index} className="bg-[#f7f7f8] flex items-start relative shrink-0 w-full">
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[205px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[205px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {row.name}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[76px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[76px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {row.calls}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[96px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[96px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {row.perUnitCost}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="h-10 overflow-hidden relative shrink-0 w-[77px]">
                  <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                    {row.cost}
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
                <div className="grow h-10 min-h-0 min-w-px overflow-hidden relative shrink-0">
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default ApiUsageTable
