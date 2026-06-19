import { motion } from 'framer-motion'
import { AlertTriangle, ArrowRight } from 'lucide-react'
import { type ChangeEvent, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import ConfiguredApisCard from '@/components/billing/ConfiguredApisCard'
import RecentInvoicesTable from '@/components/billing/RecentInvoicesTable'
import ReportsTable, { REPORTS_ALL_APIS_VALUE } from '@/components/billing/ReportsTable'
import SwitchToProductionModal from '@/components/modals/switchToProductionModal/SwitchToProductionModal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { fetchOnboardingStatus } from '@/store/onboardingStore'
import addCreditsIcon from '@/assets/figma/billing/add-credits.svg'
import bankAccountIcon from '@/assets/figma/billing/bank-account.svg'
import confirmTransferIcon from '@/assets/figma/billing/confirm-transfer.svg'
import copyIcon from '@/assets/figma/billing/copy.svg'
import liveModeIcon from '@/assets/figma/billing/live-mode.svg'
import tutorialPlayIcon from '@/assets/figma/billing/tutorial-play.svg'
import uploadPaymentIcon from '@/assets/figma/billing/upload-payment.svg'

const TUTORIAL_URL = 'https://drive.google.com/file/d/1vV3UIcOSrKOvh0_L_qFAPzMoKwroDMsI/view?usp=sharing'

const BANK_DETAILS = {
  accountHolder: 'PAYVRIZ TECHNOLOGIES PRIVATE LIMITED',
  accountNumber: '924020027102018',
  ifsc: 'UTIB0001527',
  accountType: 'Current Account',
}

type BankDetail = {
  label: string
  value: string
}

const bankDetails: BankDetail[] = [
  { label: 'Name', value: BANK_DETAILS.accountHolder },
  { label: 'Account Number', value: BANK_DETAILS.accountNumber },
  { label: 'IFSC Code', value: BANK_DETAILS.ifsc },
  { label: 'Acc Type', value: BANK_DETAILS.accountType },
]

const BillingPage = () => {
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const [selectedReportApiName, setSelectedReportApiName] = useState(REPORTS_ALL_APIS_VALUE)
  const [isSwitchToProductionModalOpen, setIsSwitchToProductionModalOpen] = useState(false)
  const [transferAmount, setTransferAmount] = useState('1000')
  const [transferReference, setTransferReference] = useState('')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const copyableBankDetails = useMemo(
    () => bankDetails.map((detail) => `${detail.label}: ${detail.value}`).join('\n'),
    []
  )

  const handleCopy = async (value: string, label = 'Details') => {
    try {
      await navigator.clipboard.writeText(value)
      toast.success(`${label} copied`)
    } catch {
      toast.error('Failed to copy')
    }
  }

  const handleSubmitTransfer = () => {
    toast.info('Transfer verification upload is not connected yet.')
  }

  const handleViewTutorial = () => {
    window.open(TUTORIAL_URL, '_blank', 'noopener,noreferrer')
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploadedFileName(file.name)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex h-full w-full flex-col gap-6 overflow-y-auto bg-transparent"
    >
      {!isProduction ? (
        <section className="rounded-[22px] border border-[#e5e5e5]/80 bg-white p-8 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)]">
          <div className="flex flex-col items-center justify-center gap-6 py-12 text-center">
            <div className="grid size-16 place-items-center rounded-[18px] bg-[#fff7ea]">
              <AlertTriangle className="size-8 text-[#b47d1f]" />
            </div>
            <div>
              <p className="text-[16px] font-semibold leading-7 text-[#171717]">You are in Simulation Mode</p>
              <p className="mt-1 max-w-md text-[12px] leading-[18px] text-[#737373]">
                Please switch to production to see billing details and add credits.
              </p>
            </div>
            <Button
              onClick={() => setIsSwitchToProductionModalOpen(true)}
              className="h-10 rounded-[10px] bg-[#b47d1f] px-5 text-[12px] font-medium text-white hover:bg-[#9d6a1a]"
            >
              Switch to Production
              <ArrowRight className="size-4" />
            </Button>
          </div>
        </section>
      ) : (
        <>
          <LiveModeBanner onViewTutorial={handleViewTutorial} />

          <header className="flex flex-wrap items-end gap-3">
            <h1 className="text-[20px] font-semibold leading-[30px] tracking-[-0.45px] text-[#171717]">
              Billing
            </h1>
            <p className="pb-[5px] text-[12px] leading-[18.75px] text-[#737373]">
              Manage credits, payments and invoices
            </p>
          </header>

          <section className="rounded-[22px] border border-[#e5e5e5]/80 bg-white p-5 shadow-[0_1px_0_rgba(15,23,42,0.04),0_8px_24px_-12px_rgba(15,23,42,0.08)] sm:p-[33px]">
            <div className="flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-[18px] bg-[#0019ff]/[0.06]">
                <img src={addCreditsIcon} alt="" className="size-5" />
              </div>
              <div>
                <h2 className="text-[16px] font-semibold leading-[27px] tracking-[-0.45px] text-[#171717]">
                  Add credits
                </h2>
                <p className="text-[12px] leading-[18.75px] text-[#737373]">
                  Choose how you'd like to pay
                </p>
              </div>
            </div>

            <div className="mt-6 inline-flex rounded-[14px] bg-[#f5f5f5]/80 p-1">
              <button className="h-7 rounded-[10px] bg-white px-4 text-[12px] font-medium leading-[19.5px] text-[#020618] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
                Bank Transfer
              </button>
              <button
                type="button"
                onClick={() => toast.info('Coming soon!')}
                className="flex h-7 items-center gap-2 rounded-[10px] px-4 text-[12px] font-medium leading-[19.5px] text-[#62748e]"
              >
                Payment Gateway
                <span className="rounded-full bg-[#00e59e]/20 px-1.5 py-px text-[10px] font-semibold uppercase leading-[14px] tracking-[0.475px] text-[#047857]">
                  coming Soon
                </span>
              </button>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-2">
              <div className="flex min-w-0 flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="grid size-9 place-items-center rounded-[14px] bg-[#0019ff]/[0.07]">
                      <img src={bankAccountIcon} alt="" className="size-4" />
                    </div>
                    <div>
                      <p className="text-[14px] font-semibold leading-[20.25px] text-[#171717]">Bank account</p>
                      <p className="text-[12px] leading-[18px] text-[#737373]">Transfer to the account below</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCopy(copyableBankDetails, 'Bank details')}
                    className="flex shrink-0 items-center gap-1.5 pt-0.5 text-[12px] font-medium leading-4 text-[#737373] hover:text-[#171717]"
                  >
                    <img src={copyIcon} alt="" className="size-3.5" />
                    Copy all
                  </button>
                </div>

                <div className="overflow-hidden rounded-[18px] border border-[#e5e5e5] bg-white">
                  {bankDetails.map((detail) => (
                    <BankDetailRow key={detail.label} detail={detail} onCopy={handleCopy} />
                  ))}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-4">
                <div className="flex items-start gap-3">
                  <div className="grid size-9 place-items-center rounded-[14px] bg-[#00e59e]/15">
                    <img src={confirmTransferIcon} alt="" className="size-4" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold leading-[20.25px] text-[#171717]">
                      Confirm your transfer
                    </p>
                    <p className="text-[12px] leading-[18px] text-[#737373]">
                      Upload your payment screenshot so we can credit it instantly.
                    </p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-[5.5px] pt-[5.5px] text-[12px] font-medium uppercase leading-[16.5px] tracking-[0.55px] text-[#a1a1a1]">
                    Amount (₹)
                    <Input
                      value={transferAmount}
                      onChange={(event) => setTransferAmount(event.target.value)}
                      className="h-10 rounded-[14px] border-[#e5e5e5] bg-white text-[14px] font-normal text-[#62748e] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
                    />
                  </label>
                  <label className="flex flex-col gap-[5.5px] pt-[5.5px] text-[12px] font-medium uppercase leading-[16.5px] tracking-[0.55px] text-[#a1a1a1]">
                    UTR / Reference
                    <Input
                      value={transferReference}
                      onChange={(event) => setTransferReference(event.target.value)}
                      placeholder="e.g. AXISN12345678"
                      className="h-10 rounded-[14px] border-[#e5e5e5] bg-white text-[14px] font-normal text-[#62748e] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] placeholder:text-[#62748e]"
                    />
                  </label>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex min-h-[143px] flex-col items-center justify-center gap-[7px] rounded-[18px] border border-dashed border-[#d4d4d4] bg-[#fafafa]/60 px-[17px] pb-[25px] pt-[26px] text-center transition hover:border-[#0019ff]/40 hover:bg-[#fafafa]"
                >
                  <span className="grid size-10 place-items-center rounded-[14px] bg-[#0019ff]/[0.06]">
                    <img src={uploadPaymentIcon} alt="" className="size-[18px]" />
                  </span>
                  <span className="text-[12px] font-medium leading-[19.5px] text-[#171717]">
                    {uploadedFileName || 'Upload payment screenshot'}
                  </span>
                  <span className="text-[10px] leading-[17.25px] text-[#737373]">
                    PNG, JPG or PDF · up to 5 MB
                  </span>
                </button>

                <Button
                  type="button"
                  onClick={handleSubmitTransfer}
                  className="h-[45px] rounded-[14px] bg-[#195cdf] text-[14px] font-semibold text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#164fbe]"
                >
                  Submit for verification
                </Button>

                <p className="text-center text-[12px] leading-[17.25px] text-[#737373]">
                  Credits are added within 15 minutes of verification on business days.
                </p>
              </div>
            </div>
          </section>

          <div className="grid min-w-0 gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
            <ConfiguredApisCard
              selectedApiName={selectedReportApiName}
              allApisValue={REPORTS_ALL_APIS_VALUE}
              onSelectApiName={setSelectedReportApiName}
            />
            <ReportsTable
              selectedApiName={selectedReportApiName}
              onSelectedApiNameChange={setSelectedReportApiName}
              className="min-w-0"
            />
          </div>

          <RecentInvoicesTable />
        </>
      )}

      <SwitchToProductionModal
        isOpen={isSwitchToProductionModalOpen}
        onClose={() => setIsSwitchToProductionModalOpen(false)}
        onConfirm={async () => {
          try {
            const updatedStatus = await fetchOnboardingStatus()
            if (updatedStatus?.is_onboarded) setIsSwitchToProductionModalOpen(false)
          } catch {
            setIsSwitchToProductionModalOpen(false)
          }
        }}
      />
    </motion.div>
  )
}

const LiveModeBanner = ({ onViewTutorial }: { onViewTutorial: () => void }) => (
  <section className="flex flex-col gap-4 rounded-[18px] border border-[#0019ff]/10 bg-gradient-to-r from-[#0019ff]/[0.03] to-[#00e59e]/[0.06] px-[21px] py-[17px] sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-center gap-3">
      <div className="grid size-9 place-items-center rounded-[14px] bg-[#0019ff]">
        <img src={liveModeIcon} alt="" className="size-4" />
      </div>
      <div>
        <p className="text-[14px] font-semibold leading-[21px] text-[#171717]">You're in Live Mode</p>
        <p className="text-[12px] leading-[18.75px] text-[#525252]">
          Follow the setup guide to start populating your dashboard with real data.
        </p>
      </div>
    </div>
    <Button
      type="button"
      onClick={onViewTutorial}
      className="h-8 w-fit rounded-full bg-[#0019ff] px-4 text-[12px] font-medium text-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] hover:bg-[#0015d6]"
    >
      <img src={tutorialPlayIcon} alt="" className="size-4" />
      View Tutorial
    </Button>
  </section>
)

const BankDetailRow = ({
  detail,
  onCopy,
}: {
  detail: BankDetail
  onCopy: (value: string, label?: string) => void
}) => (
  <div className="flex min-h-16 items-center justify-between gap-4 border-b border-[#f5f5f5] px-4 py-3 last:border-b-0">
    <div className="min-w-0">
      <p className="text-[12px] font-medium uppercase leading-[16.5px] tracking-[0.55px] text-[#a1a1a1]">
        {detail.label}
      </p>
      <p className="mt-0.5 truncate text-[14px] font-medium leading-[20.25px] text-[#171717]" title={detail.value}>
        {detail.value}
      </p>
    </div>
    <button
      type="button"
      onClick={() => onCopy(detail.value, detail.label)}
      className="flex shrink-0 items-center gap-1.5 text-[12px] font-medium leading-4 text-[#737373] hover:text-[#171717]"
    >
      <img src={copyIcon} alt="" className="size-3.5" />
      Copy
    </button>
  </div>
)

export default BillingPage
