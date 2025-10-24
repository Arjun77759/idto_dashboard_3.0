import { motion } from 'framer-motion'

// Image assets from Figma
const imgSearch = "http://localhost:3845/assets/dd51b8c4adb7c8615abf036bb45f6c82ed4a7815.svg"
const imgFileExport = "http://localhost:3845/assets/4a2a492bece68dc111390e7a429ebb7e89431612.svg"
const imgDownload = "http://localhost:3845/assets/f9e6384c3bac5c329a9ff7c481f9c5e9d9752dc7.svg"
const imgCalendar = "http://localhost:3845/assets/843b5e757f3e18c044e38bd591197daeb56b86e6.svg"
const imgArrow = "http://localhost:3845/assets/0767fe49935de804ac4d4ed37fa4a369cccdeb5e.svg"
const imgRestart = "http://localhost:3845/assets/5c48ecd60b568c24fe6f0982e01796d95745aaf4.svg"

const RecentInvoicesTable = () => {
  const invoiceData = [
    {
      id: "Inv-2023-001",
      date: "04/17/23  16:56:07",
      status: "Paid",
      amount: "Rs 1500"
    },
    {
      id: "Inv-2023-002",
      date: "04/17/23  16:56:07",
      status: "Paid",
      amount: "Rs 2800"
    }
  ]

  const handleExportCSV = () => {
    console.log('Export CSV')
  }

  const handleDownloadInvoice = () => {
    console.log('Download Invoice')
  }

  const handleSeeDetails = (invoiceId: string) => {
    console.log('See details for', invoiceId)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.4 }}
      className="bg-white border border-[#e7e8ea] border-solid grow min-h-0 min-w-px relative rounded-2xl shrink-0 w-full"
    >
      <div className="flex flex-col gap-6 items-start overflow-hidden p-6 relative rounded-[inherit] w-full">
        <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
          Recent Invoices
        </p>

        {/* Search and Action Bar */}
        <div className="flex items-center justify-between p-0 relative rounded shrink-0 w-full">
          <div className="flex flex-row items-center self-stretch">
            <div className="bg-white border border-[#e7e8ea] border-solid flex h-full items-center justify-between px-4 py-2 relative rounded-lg shrink-0 w-[500px]">
              <div className="flex gap-2 items-center relative shrink-0">
                <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Search for Id, name product etc
                </p>
              </div>
              <div className="relative shrink-0 size-6">
                <div className="absolute inset-[16.67%_20.83%_20.83%_16.67%]">
                  <img alt="" className="block max-w-none size-full" src={imgSearch} />
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-3 items-center relative shrink-0">
            <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0">
              <button
                onClick={handleExportCSV}
                className="flex gap-2 items-center justify-center overflow-hidden px-3 py-3.5 relative rounded-[inherit]"
              >
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Export CSV
                </p>
                <div className="overflow-hidden relative shrink-0 size-4">
                  <div className="absolute inset-[5.21%_7.29%]">
                    <img alt="" className="block max-w-none size-full" src={imgFileExport} />
                  </div>
                </div>
              </button>
            </div>
            <div className="flex flex-row items-center self-stretch">
              <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
                <button
                  onClick={handleDownloadInvoice}
                  className="flex gap-2 h-full items-center justify-center overflow-hidden px-3 py-3.5 relative rounded-[inherit]"
                >
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                    Download Invoice
                  </p>
                  <div className="overflow-hidden relative shrink-0 size-4">
                    <div className="absolute inset-[18.75%_20.83%]">
                      <img alt="" className="block max-w-none size-full" src={imgDownload} />
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex h-10 items-center justify-between relative shrink-0 w-full">
          <div className="flex gap-4 h-full items-center min-h-0 min-w-px relative shrink-0">
            <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Sep 9, 2024 - Sep 15, 2024
                </p>
                <div className="overflow-hidden relative shrink-0 size-4">
                  <div className="absolute inset-[6.25%_9.38%]">
                    <img alt="" className="block max-w-none size-full" src={imgCalendar} />
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Status
                </p>
                <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
                  <div className="flex-none rotate-[90deg]">
                    <div className="overflow-hidden relative size-4">
                      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                        <div className="absolute inset-[-6.63%_-26.52%_-6.63%_-13.26%]">
                          <img alt="" className="block max-w-none size-full" src={imgArrow} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Amount
                </p>
                <div className="flex h-[calc(1px*((var(--transform-inner-width)*1)+(var(--transform-inner-height)*0)))] items-center justify-center relative shrink-0 w-[calc(1px*((var(--transform-inner-height)*1)+(var(--transform-inner-width)*0)))]" style={{ "--transform-inner-width": "0", "--transform-inner-height": "0" } as React.CSSProperties}>
                  <div className="flex-none rotate-[90deg]">
                    <div className="overflow-hidden relative size-4">
                      <div className="absolute bottom-1/4 left-[37.5%] right-[37.5%] top-1/4">
                        <div className="absolute inset-[-6.63%_-26.52%_-6.63%_-13.26%]">
                          <img alt="" className="block max-w-none size-full" src={imgArrow} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0">
            <div className="flex gap-1 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
              <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                Reset
              </p>
              <div className="overflow-hidden relative shrink-0 size-4">
                <div className="absolute inset-[11.6%_16.67%]">
                  <img alt="" className="block max-w-none size-full" src={imgRestart} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-md shrink-0 w-full">
          <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] w-full">
            {/* Table Header */}
            <div className="bg-white flex items-start relative shrink-0 w-full">
              <div className="h-10 overflow-hidden relative shrink-0 w-12">
                <div className="absolute bg-[#f7f7f8] border border-[#131b31] border-solid left-1/2 rounded top-3 size-4 translate-x-[-50%]" />
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
              <div className="grow h-10 min-h-0 min-w-px relative shrink-0">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-full">
                  <p className="absolute bottom-8 font-normal leading-6 left-0 not-italic right-0 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Invoice ID
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[265px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[265px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Date & Time
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[171px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[171px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Status
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[208px]">
                <div className="h-10 overflow-hidden relative rounded-[inherit] w-[208px]">
                  <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]">
                    Amount
                  </p>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
              </div>
              <div className="h-10 overflow-hidden relative shrink-0 w-[130px]">
                <p className="absolute bottom-8 font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] text-center tracking-[-0.084px] translate-y-[100%]">
                  Actions
                </p>
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
              <div className="h-10 overflow-hidden relative shrink-0 w-[29px]">
                <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
              </div>
            </div>

            {/* Table Rows */}
            {invoiceData.map((invoice, index) => (
              <div key={index} className="flex items-start relative shrink-0 w-full">
                <div className="h-10 overflow-hidden relative shrink-0 w-12">
                  <div className="absolute bg-[#f7f7f8] border border-[#9296a0] border-solid left-1/2 rounded top-3 size-4 translate-x-[-50%]" />
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
                <div className="grow h-10 min-h-0 min-w-px relative shrink-0">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-full">
                    <p className="absolute font-normal leading-6 left-0 not-italic right-0 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {invoice.id}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[265px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[265px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px] whitespace-pre-wrap">
                      {invoice.date}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[171px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[171px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#3ac828] top-2 tracking-[-0.084px]">
                      {invoice.status}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid h-10 relative shrink-0 w-[208px]">
                  <div className="h-10 overflow-hidden relative rounded-[inherit] w-[208px]">
                    <p className="absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]">
                      {invoice.amount}
                    </p>
                    <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                  </div>
                </div>
                <div className="h-10 overflow-hidden relative shrink-0 w-[130px]">
                  <div className="absolute border border-[#e7e8ea] border-solid h-[29px] left-1/2 rounded-lg top-1.5 translate-x-[-50%] w-[79px]">
                    <button
                      onClick={() => handleSeeDetails(invoice.id)}
                      className="flex gap-1 h-[29px] items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit] w-[79px]"
                    >
                      <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-center text-nowrap tracking-[-0.12px] whitespace-pre">
                        See details
                      </p>
                    </button>
                  </div>
                  <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                </div>
                <div className="h-10 overflow-hidden relative shrink-0 w-[29px]">
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

export default RecentInvoicesTable
