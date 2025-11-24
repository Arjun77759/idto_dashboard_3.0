import { motion } from 'framer-motion'
import { Building, CreditCard, IndianRupee, Plus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

import RecentInvoicesTable from '@/components/billing/RecentInvoicesTable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Textarea } from '@/components/ui/textarea'
import { Spinner } from '@/components/ui/spinner'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useSimulationModeModal } from '@/contexts/SimulationModeModalContext'
import { useMonthlyUsage } from '@/hooks/useMonthlyUsage'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useRazorpay } from '@/hooks/useRazorpay'
import { useUserProfileStore } from '@/store/userProfileStore'

const formatCurrency = (value: number) => {
  if (!value) return '-'
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
}

const BillingPage = () => {
  const { data, loading } = useMonthlyUsage()
  const userProfile = useUserProfileStore((state) => state.data)
  const { openModal } = useSimulationModeModal()
  const { data: onboardingStatus } = useOnboardingStatus()
  const { initiatePayment, loading: paymentLoading } = useRazorpay()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const [creditAmount, setCreditAmount] = useState<string>('')
  const [hasGst, setHasGst] = useState<'yes' | 'no'>(userProfile?.gst_number ? 'yes' : 'no')
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'bank'>('razorpay')
  const [gstNumber, setGstNumber] = useState<string>(userProfile?.gst_number ?? '')
  const [companyName, setCompanyName] = useState<string>(userProfile?.brand_name ?? '')
  const [stateName, setStateName] = useState<string>(userProfile?.business_state ?? '')
  const [businessAddress, setBusinessAddress] = useState<string>(userProfile?.business_address ?? '')
  const [showBankDetailsModal, setShowBankDetailsModal] = useState(false)

  useEffect(() => {
    setGstNumber(userProfile?.gst_number ?? '')
    setCompanyName(userProfile?.brand_name ?? '')
    setStateName(userProfile?.business_state ?? '')
    setBusinessAddress(userProfile?.business_address ?? '')
    setHasGst(userProfile?.gst_number ? 'yes' : 'no')
  }, [userProfile])

  const parsedAmount = Number(creditAmount) || 0
  const taxes = useMemo(() => {
    if (!parsedAmount) {
      return { sgst: 0, cgst: 0, finalAmount: 0 }
    }
    const sgst = parsedAmount * 0.09
    const cgst = parsedAmount * 0.09
    return {
      sgst,
      cgst,
      finalAmount: parsedAmount + sgst + cgst,
    }
  }, [parsedAmount])

  const liveCredits = loading ? '...' : formatCurrency(data?.balance ?? 0)
  const testingCredits = loading ? '...' : formatCurrency(Math.max((data?.total ?? 0) - (data?.used ?? 0), 0))

  const handleProceedToPayment = () => {
    if (!parsedAmount || parsedAmount <= 0) {
      toast.error('Please enter a valid credit amount.')
      return
    }

    if (hasGst === 'yes' && !gstNumber.trim()) {
      toast.error('Please enter your GST number.')
      return
    }

    if (paymentMethod === 'bank') {
      setShowBankDetailsModal(true)
      return
    }

    if (!isProduction) {
      openModal()
      return
    }

    const taxTotal = taxes.sgst + taxes.cgst
    const sanitizedGstNumber = gstNumber.trim()
    const sanitizedCompanyName = companyName.trim()
    const sanitizedStateName = stateName.trim()
    const sanitizedBusinessAddress = businessAddress.trim()

    initiatePayment({
      amount: parsedAmount,
      tax: taxTotal,
      description: 'Add Live Credits',
      prefill: {
        name: userProfile?.name || undefined,
        email: userProfile?.email || undefined,
        contact: userProfile?.mobile || undefined,
      },
      gst_number: hasGst === 'yes' && sanitizedGstNumber ? sanitizedGstNumber : undefined,
      company_name: sanitizedCompanyName || undefined,
      state: sanitizedStateName || undefined,
      address: sanitizedBusinessAddress || undefined,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-[#f7f7f8] flex flex-col gap-6 p-4 sm:p-6 rounded-2xl w-full h-full overflow-y-auto"
    >
      <header className="flex flex-wrap items-center gap-4 rounded-md">
        <div className="flex items-center gap-3">
          <CreditCard className="size-6 text-[#141b34]" />
          <p className="text-xl font-semibold text-[#131b31] tracking-[-0.2px]">Billing</p>
        </div>
        <div className="ml-auto flex flex-wrap gap-3">
          <CreditStat label="Live Credits" value={liveCredits} />
          <CreditStat label="Testing Credits" value={testingCredits} />
        </div>
      </header>

      <section className="flex flex-col gap-6 rounded-2xl border border-[#e7e8ea] bg-white p-6">
        <div className="border-b border-[#e7e8ea] pb-4">
          <p className="text-sm font-bold text-[#616675]">Add Live Credits</p>
          <p className="text-xs text-[#9296a0]">1 Credit = 1 Rupee</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_minmax(0,1fr)_280px]">
          <div className="flex flex-col gap-4">
            <Label className="text-xs text-[#616675]">Enter Credit Amount</Label>
            <Input
              type="number"
              value={creditAmount}
              onChange={(event) => setCreditAmount(event.target.value)}
              placeholder="Enter amount"
              className="h-10 rounded-lg border-[#e7e8ea] text-sm"
            />
            <p className="text-xs text-[#9296a0]">
              Select the number of credits you want to purchase. Up to 1000 API calls with 3000 credits.
            </p>
            <Button
              variant="secondary"
              onClick={handleProceedToPayment}
              disabled={!parsedAmount || paymentLoading}
              className="w-fit rounded-lg border border-[#e7e8ea] bg-[#e6e8ff] text-xs font-medium text-[#0019ff] disabled:opacity-60"
            >
              {paymentLoading ? (
                <>
                  <Spinner className="size-4 text-[#0019ff]" />
                  Processing...
                </>
              ) : (
                'Proceed'
              )}
            </Button>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <p className="text-xs text-[#c8cacf]">Do you have GST number?</p>
              <RadioGroup
                value={hasGst}
                onValueChange={(value) => setHasGst(value as 'yes' | 'no')}
                className="mt-3 flex flex-wrap gap-6"
              >
                {[
                  { label: 'Yes', value: 'yes' },
                  { label: 'No', value: 'no' },
                ].map((option) => (
                  <div key={option.value} className="flex items-center gap-2 text-xs text-[#9296a0]">
                    <RadioGroupItem
                      value={option.value}
                      className="border-[#c8cacf] text-[#8a95ff] focus-visible:ring-[#8a95ff]"
                    />
                    <span>{option.label}</span>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="flex flex-col gap-2 text-xs text-[#9296a0]">
              <div className="flex items-center justify-between">
                <span>GST Number</span>
              </div>
              <Input
                value={gstNumber}
                onChange={(event) => setGstNumber(event.target.value)}
                placeholder="Enter GST Number"
                className="h-10 rounded-lg border-[#e7e8ea] text-xs text-[#131b31]"
                disabled={hasGst === 'no'}
              />
            </div>

            <div className="flex flex-col gap-2 text-xs text-[#9296a0]">
              <div>
                <span>Company Name</span>
              </div>
              <Input
                value={companyName}
                onChange={(event) => setCompanyName(event.target.value)}
                placeholder="Enter company name"
                className="h-10 rounded-lg border-[#e7e8ea] text-xs text-[#131b31]"
              />
            </div>

            <div className="flex flex-col gap-2 text-xs text-[#9296a0]">
              <div>
                <span>State</span>
              </div>
              <Input
                value={stateName}
                onChange={(event) => setStateName(event.target.value)}
                placeholder="Select state"
                className="h-10 rounded-lg border-[#e7e8ea] text-xs text-[#131b31]"
              />
            </div>

            <div className="flex flex-col gap-2 text-xs text-[#9296a0]">
              <div>
                <span>Address</span>
              </div>
              <Textarea
                value={businessAddress}
                onChange={(event) => setBusinessAddress(event.target.value)}
                className="rounded-lg border-[#e7e8ea] text-xs text-[#131b31]"
                placeholder="Enter billing address"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 justify-between">
            <div className='flex flex-col gap-4'>
              <p className="text-xs text-[#9296a0]">Order Summary</p>
              <div className="flex flex-col gap-4 rounded-lg bg-[#f7f7f8] p-4 text-xs text-[#9296a0]">
                <SummaryRow label="Credits" value={parsedAmount ? `${parsedAmount} Credits` : '-'} />
                <SummaryRow label="Desired Amount" value={formatCurrency(parsedAmount)} />
                <SummaryRow label="SGST @ 9%" value={formatCurrency(taxes.sgst)} />
                <SummaryRow label="CGST @ 9%" value={formatCurrency(taxes.cgst)} />
                <div className="border-t border-[#c8cacf] pt-3 text-sm font-semibold text-[#131b31]">
                  <SummaryRow label="Final Amount" value={formatCurrency(taxes.finalAmount)} bold />
                </div>
              </div>
              <p className="text-xs text-[#9296a0]">Select Payment Method</p>
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value) => setPaymentMethod(value as 'razorpay' | 'bank')}
                className="flex flex-col gap-4"
              >
                <div className="flex flex-wrap gap-6">
                  {[
                    { label: 'Razorpay PG', value: 'razorpay' },
                    { label: 'Bank Transfer', value: 'bank' },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 text-xs text-[#9296a0]">
                      <RadioGroupItem
                        value={option.value}
                        className="border-[#c8cacf] text-[#8a95ff] focus-visible:ring-[#8a95ff]"
                      />
                      {option.label}
                    </label>
                  ))}
                </div>
                {/* {paymentMethod === 'bank' && <BankTransferDetails desiredAmount={taxes.finalAmount} />} */}
              </RadioGroup>
            </div>
            <Button
              onClick={handleProceedToPayment}
              disabled={!parsedAmount || paymentLoading}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#e7e8ea] bg-[#e7e8ea] text-xs font-medium text-[#9296a0] disabled:bg-[#e7e8ea]"
            >
              {paymentLoading ? (
                <>
                  <Spinner className="size-4 text-[#9296a0]" />
                  Processing...
                </>
              ) : (
                <>
                  Proceed to Pay
                  <IndianRupee className="size-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6">
        <RecentInvoicesTable />
      </div>
      <Dialog open={showBankDetailsModal} onOpenChange={setShowBankDetailsModal}>
        <DialogContent className="max-w-md rounded-2xl border border-[#e7e8ea] p-6">
          <DialogHeader className="text-left">
            <DialogTitle className="text-lg font-semibold text-[#131b31]">Bank Transfer Details</DialogTitle>
            <DialogDescription className="text-sm text-[#616675]">
              Transfer {taxes.finalAmount ? formatCurrency(taxes.finalAmount) : '-'} via RTGS/NEFT/IMPS using the account
              details below.
            </DialogDescription>
          </DialogHeader>
          <BankTransferDetails desiredAmount={taxes.finalAmount} />
          <DialogFooter className="mt-4 flex w-full justify-end">
            <Button onClick={() => setShowBankDetailsModal(false)} className="rounded-lg bg-[#0019ff] text-white">
              Okay, Got It
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  )
}

type SummaryRowProps = {
  label: string
  value: string
  bold?: boolean
}

const SummaryRow = ({ label, value, bold }: SummaryRowProps) => {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-[#9296a0]">{label}</span>
      <span className={bold ? 'text-base font-semibold text-[#131b31]' : 'text-[#c8cacf]'}>{value}</span>
    </div>
  )
}

type CreditStatProps = {
  label: string
  value: string
}

const CreditStat = ({ label, value }: CreditStatProps) => (
  <div className="flex items-center gap-3 rounded-xl border border-[#e7e8ea] bg-white px-4 py-2 text-sm text-[#616675] shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
    <p className="text-xs leading-[1.4] text-[#616675]">
      {label} : <span className="text-base font-[500] text-[#131b31]">{value}</span>
    </p>
    <Plus className="size-4 text-[#616675]" />
  </div>
)

const BANK_DETAILS = {
  bankName: 'AXIS BANK',
  accountHolder: 'PAYVRIZ TECHNOLOGIES PRIVATE LIMITED',
  accountNumber: '924020027102018',
  ifsc: 'UTIB0001527',
  accountType: 'Current Account',
}

type BankTransferDetailsProps = {
  desiredAmount: number
}

const BankTransferDetails = ({ desiredAmount }: BankTransferDetailsProps) => (
  <div className="flex flex-col gap-4 rounded-xl border border-[#e7e8ea] bg-[#f7f7f8] p-4">
    <div className="flex items-center gap-3">
      <div className="flex size-10 items-center justify-center rounded-full bg-[#e6e8ff]">
        <Building className="size-5 text-[#0019ff]" />
      </div>
      <div>
        <p className="text-xs font-semibold text-[#131b31]">Bank Transfer Details</p>
        <p className="text-[11px] text-[#9296a0]">Transfer via RTGS/NEFT/IMPS using the details below.</p>
      </div>
    </div>
    <div className="space-y-3 text-xs text-[#131b31]">
      <BankDetailRow label="Bank Name" value={BANK_DETAILS.bankName} />
      <BankDetailRow label="Account Holder" value={BANK_DETAILS.accountHolder} />
      <BankDetailRow label="Account Number" value={BANK_DETAILS.accountNumber} />
      <BankDetailRow label="IFSC Code" value={BANK_DETAILS.ifsc} />
      <BankDetailRow label="Account Type" value={BANK_DETAILS.accountType} />
      <BankDetailRow label="Amount to Transfer" value={formatCurrency(desiredAmount)} />
    </div>
  </div>
)

type BankDetailRowProps = {
  label: string
  value: string
}

const BankDetailRow = ({ label, value }: BankDetailRowProps) => (
  <div className="flex items-center justify-between gap-3">
    <span className="text-[#9296a0]">{label}</span>
    <span className="font-medium text-[#131b31]">{value}</span>
  </div>
)

export default BillingPage
