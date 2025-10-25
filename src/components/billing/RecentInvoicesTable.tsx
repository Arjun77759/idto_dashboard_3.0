import { motion } from 'framer-motion'
import { Search, FileSpreadsheet, Download, Calendar, ChevronDown, RotateCcw } from 'lucide-react'

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
      <div className="flex flex-col gap-4 sm:gap-6 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] w-full">
        <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
          Recent Invoices
        </p>

        {/* Search and Action Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between p-0 relative rounded shrink-0 w-full">
          <div className="flex flex-row items-center self-stretch w-full sm:w-auto">
            <div className="bg-white border border-[#e7e8ea] border-solid flex h-full items-center justify-between px-4 py-2 relative rounded-lg shrink-0 w-full sm:w-[500px]">
              <div className="flex gap-2 items-center relative shrink-0">
                <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Search for Id, name product etc
                </p>
              </div>
              <Search className="size-6 text-[#9296a0]" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center relative shrink-0 w-full sm:w-auto">
            <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid relative rounded-lg shrink-0 flex-1 sm:flex-none">
              <button
                onClick={handleExportCSV}
                className="flex gap-2 items-center justify-center overflow-hidden px-3 py-3.5 relative rounded-[inherit] w-full"
              >
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Export CSV
                </p>
                <FileSpreadsheet className="size-4 text-[#0019ff]" />
              </button>
            </div>
            <div className="flex flex-row items-center self-stretch flex-1 sm:flex-none">
              <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid h-full relative rounded-lg shrink-0 w-full">
                <button
                  onClick={handleDownloadInvoice}
                  className="flex gap-2 h-full items-center justify-center overflow-hidden px-3 py-3.5 relative rounded-[inherit] w-full"
                >
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
                    Download Invoice
                  </p>
                  <Download className="size-4 text-[#0019ff]" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap gap-2 h-auto sm:h-10 items-center justify-between relative shrink-0 w-full">
          <div className="flex flex-wrap gap-2 h-full items-center min-h-0 min-w-px relative shrink-0">
            <div className="bg-white border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Sep 9, 2024 - Sep 15, 2024
                </p>
                <Calendar className="size-4 text-[#9296a0]" />
              </div>
            </div>
            <div className="bg-white border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Status
                </p>
                <ChevronDown className="size-4 text-[#9296a0]" />
              </div>
            </div>
            <div className="bg-white border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0">
              <div className="flex gap-2 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
                <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Amount
                </p>
                <ChevronDown className="size-4 text-[#9296a0]" />
              </div>
            </div>
          </div>
          <div className="border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0">
            <div className="flex gap-1 h-full items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit]">
              <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                Reset
              </p>
              <RotateCcw className="size-4 text-[#9296a0]" />
            </div>
          </div>
        </div>

        {/* Invoice Table */}
        <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-md shrink-0 w-full overflow-x-auto">
          <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] w-full min-w-[800px]">
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
