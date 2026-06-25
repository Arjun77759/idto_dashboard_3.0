import { useState } from "react"
import { ArrowLeft, ArrowRight, Check, Clock3, CreditCard, HelpCircle, Landmark, Mail, MapPin, Save, ShieldCheck } from "lucide-react"
import idtoLogo from "@/assets/idto-logo.svg"
import type { UserProfile } from "@/store/userProfileStore"
import { verifyCustomerBankDetails } from "@/api/onboardingApi"
import { fetchOnboardingStatus } from "@/store/onboardingStore"

interface BankAccountFormProps {
  onNext: () => void
  onSkip?: () => void
  onPrevious?: () => void
  isLoading?: boolean
  userProfile?: UserProfile | null
  completedSteps?: {
    basic_details: boolean
    pan: boolean
    gst: boolean
    digilocker: boolean
    bank: boolean
  }
}

const BankAccountForm = ({ onNext, onSkip, onPrevious, isLoading = false, userProfile, completedSteps }: BankAccountFormProps) => {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationError, setVerificationError] = useState('')
  const [form, setForm] = useState({
    accountNumber: '',
    ifsc: '',
    accountHolder: userProfile?.registered_name || userProfile?.brand_name || '',
    financeEmail: userProfile?.authorized_signatory_email || userProfile?.email || '',
    opsEmail: '',
    billingAddress: userProfile?.business_address || ''
  })

  const progressItems = [
    ['1', 'Company basics', Boolean(completedSteps?.basic_details), false],
    ['2', 'PAN & GST', Boolean(completedSteps?.pan), false],
    ['3', 'Authorized signatory', Boolean(completedSteps?.digilocker), false],
    ['4', 'Bank & review', Boolean(completedSteps?.bank), true],
  ] as const

  const accountDigits = form.accountNumber.replace(/\D/g, '')
  const isIfscValid = /^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifsc)
  const isFinanceEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.financeEmail)
  const isValid = accountDigits.length >= 9
    && isIfscValid
    && form.accountHolder.trim().length > 2
    && isFinanceEmailValid
    && form.billingAddress.trim().length > 5

  const updateField = (field: keyof typeof form, value: string) => {
    setVerificationError('')
    setForm(prev => ({
      ...prev,
      [field]: field === 'ifsc'
        ? value.toUpperCase().replace(/\s/g, '').slice(0, 11)
        : field === 'accountNumber'
          ? value.replace(/\D/g, '').slice(0, 18).replace(/(\d{4})(?=\d)/g, '$1 ').trim()
          : value
    }))
  }

  const handleVerifyAccount = async () => {
    if (!isValid || isVerifying) return

    setIsVerifying(true)
    setVerificationError('')

    try {
      await verifyCustomerBankDetails({
        account_number: accountDigits,
        ifsc_code: form.ifsc,
        account_holder_name: form.accountHolder.trim(),
        finance_email: form.financeEmail.trim(),
        ops_email: form.opsEmail.trim() || undefined,
        billing_address: form.billingAddress.trim(),
      })
      await fetchOnboardingStatus(true).catch(() => null)
      onNext()
    } catch (error: any) {
      const detail = error?.response?.data?.detail
      setVerificationError(
        detail?.message
        || detail
        || error?.response?.data?.message
        || error?.message
        || 'Bank account verification failed. Please check the details and try again.'
      )
    } finally {
      setIsVerifying(false)
    }
  }

  const inputClass = "h-10 w-full rounded-lg border border-[#e0e5eb] bg-white px-3 text-[13px] leading-5 text-[#0c121a] outline-none transition placeholder:text-[#9aa3af] focus:border-[#3061ef] focus:ring-2 focus:ring-[#3061ef]/10"
  const iconInputClass = `${inputClass} pl-9`

  return (
    <div className="h-full w-full overflow-hidden rounded-[20px] border border-[#e0e5eb] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]">
      <div className="grid h-full grid-cols-[280px_minmax(0,1fr)]">
        <aside className="flex h-full flex-col gap-6 border-r border-[#e0e5eb] bg-[#f8fafd] px-5 py-5">
          <div className="flex h-10 items-center justify-between">
            <img src={idtoLogo} alt="idto" className="h-10 w-[70px]" />
            <div className="inline-flex h-[21px] items-center gap-1.5 rounded-full bg-[#e5f2ff] px-2.5 text-[11px] leading-[17px] text-[#1034b1]">
              <span className="size-1.5 rounded-full bg-[#3061ef]" />
              GO LIVE
            </div>
          </div>

          <div className="w-full">
            <div className="mb-1.5 flex items-center justify-between text-[11px] leading-[17px] text-[#6a727d]">
              <span>Production setup</span>
              <span>88%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#f0f4f9]">
              <div className="h-full w-[88%] rounded-full bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)]" />
            </div>
          </div>

          <ol className="flex flex-col gap-1">
            {progressItems.map(([number, title, completed, active]) => (
              <li key={number} className={`flex h-[51px] items-center gap-3 rounded-xl px-2.5 py-2 ${active ? 'bg-[#e1f0ff]' : ''}`}>
                <span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold leading-[15px] ${active ? 'bg-[#0c121a] text-white' : completed ? 'bg-[#00a575] text-white' : 'border border-[#e0e5eb] bg-white text-[#6a727d]'}`}>
                  {completed ? <Check className="size-3.5" /> : number}
                </span>
                <span className="min-w-0">
                  <span className={`block text-[12.5px] leading-[19px] ${active ? 'font-bold text-[#0c121a]' : 'text-[#6a727d]'}`}>{title}</span>
                  <span className="block text-[10.5px] leading-4 text-[#6a727d]">~ under 5 min</span>
                </span>
              </li>
            ))}
          </ol>

          <div className="rounded-2xl border border-[#e0e5eb] bg-white px-3 py-5">
            <div className="flex items-center gap-1.5 text-[11px] leading-[17px] text-[#0c121a]">
              <ShieldCheck className="size-3 text-[#3061ef]" />
              Bank-grade encryption
            </div>
            <p className="mt-2 text-[10.5px] leading-4 text-[#6a727d]">
              Your documents are encrypted at rest and only seen by our onboarding team.
            </p>
          </div>
        </aside>

        <main className="flex min-h-0 flex-col bg-white">
          <header className="flex h-12 shrink-0 items-center justify-between border-b border-[#e0e5eb] px-6">
            <button type="button" onClick={onPrevious} className="inline-flex items-center gap-2 text-[12px] leading-[18px] text-[#6a727d]">
              <ArrowLeft className="size-3.5" />
              Save & exit
            </button>
            <div className="flex items-center gap-3 text-[11px] leading-[17px] text-[#6a727d]">
              <span className="inline-flex items-center gap-1">
                <Save className="size-3" />
                auto-saved 4s ago
              </span>
              <span aria-hidden="true">.</span>
              <button type="button" className="inline-flex items-center gap-1">
                <HelpCircle className="size-3" />
                Help
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-hidden px-10 pb-7 pt-[31px]">
            <div className="max-w-[854px]">
              <div className="mb-7">
                <p className="text-[11px] leading-[17px] text-[#6a727d]">Step 4 of 4</p>
                <h2 className="mt-1.5 text-[26px] font-bold leading-[39px] tracking-[-0.35px] text-[#0c121a]">
                  Where should we settle your money?
                </h2>
                <p className="mt-1.5 inline-flex items-center gap-1.5 text-[12px] leading-[18px] text-[#6a727d]">
                  <Clock3 className="size-3" />
                  ~2 minutes
                </p>
              </div>

              <div className="grid grid-cols-2 gap-x-6 gap-y-5">
                <div>
                  <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px] text-[#0c121a]">
                    Account number
                  </label>
                  <div className="relative">
                    <CreditCard className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9aa3af]" />
                    <input
                      type="text"
                      inputMode="numeric"
                      value={form.accountNumber}
                      onChange={(event) => updateField('accountNumber', event.target.value)}
                      placeholder="0000 0000 0000 00"
                      className={iconInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px] text-[#0c121a]">
                    IFSC
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={form.ifsc}
                      onChange={(event) => updateField('ifsc', event.target.value)}
                      placeholder="Enter IFSC code"
                      className={`${inputClass} pr-[154px] uppercase`}
                    />
                    {isIfscValid && (
                      <span className="pointer-events-none absolute right-3 top-1/2 inline-flex -translate-y-1/2 items-center gap-2 text-[11px] leading-4 text-[#6a727d]">
                        <Check className="size-3.5 text-[#00a575]" />
                        Valid IFSC format
                      </span>
                    )}
                  </div>
                </div>

                <div className="col-span-2">
                  <div className="mb-1.5 flex h-[18px] items-center justify-between text-[12px] leading-[18px]">
                    <label className="text-[#0c121a]">Account holder name</label>
                    <span className="text-[11px] leading-4 text-[#6a727d]">Will be matched against legal name</span>
                  </div>
                  <input
                    type="text"
                    value={form.accountHolder}
                    onChange={(event) => updateField('accountHolder', event.target.value)}
                    placeholder="Enter account holder name"
                    className={inputClass}
                  />
                </div>

                <div className="col-span-2">
                  <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px] text-[#0c121a]">
                    Confirm finance email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9aa3af]" />
                    <input
                      type="email"
                      value={form.financeEmail}
                      onChange={(event) => updateField('financeEmail', event.target.value)}
                      placeholder="Enter finance email"
                      className={iconInputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 flex h-[18px] items-center text-[12px] leading-[18px]">
                    <span className="text-[#0c121a]">Ops email</span>
                    <span className="ml-1 text-[11px] leading-4 text-[#6a727d]">(optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9aa3af]" />
                    <input
                      type="email"
                      value={form.opsEmail}
                      onChange={(event) => updateField('opsEmail', event.target.value)}
                      placeholder="Enter operations email"
                      className={iconInputClass}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1.5 flex h-[18px] items-center justify-between text-[12px] leading-[18px]">
                    <label className="text-[#0c121a]">Billing address</label>
                    <span className="text-[11px] leading-4 text-[#6a727d]">auto-filled from GSTIN</span>
                  </div>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-[#9aa3af]" />
                    <input
                      type="text"
                      value={form.billingAddress}
                      onChange={(event) => updateField('billingAddress', event.target.value)}
                      placeholder="Enter billing address"
                      className={iconInputClass}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-5 flex h-[43px] items-center rounded-xl border border-[#d6e8ff] bg-[#f5faff] px-3 text-[12px] leading-[18px] text-[#2452b5]">
                No auto-debit. Penny-drop is verification only we never charge your account without explicit consent.
              </div>
              {verificationError && (
                <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-[12px] leading-[18px] text-red-700">
                  {verificationError}
                </div>
              )}
            </div>
          </div>

          <footer className="mx-10 flex h-[65px] shrink-0 items-center justify-between border-t border-[#e0e5eb]">
            <button
              type="button"
              onClick={onPrevious}
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#e0e5eb] bg-white px-4 text-[13px] font-medium leading-5 text-[#6a727d] hover:bg-[#f8fafd] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="size-3.5" />
              Back
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onSkip}
                disabled={isLoading || isVerifying}
                className="flex h-10 items-center justify-center rounded-lg border border-[#e0e5eb] bg-white px-4 text-[13px] font-medium leading-5 text-[#6a727d] hover:bg-[#f8fafd] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={handleVerifyAccount}
                disabled={isLoading || isVerifying || !isValid}
                className="flex h-10 w-[143px] items-center justify-center gap-2 rounded-lg bg-[#0019ff] text-[13px] font-bold leading-5 text-white shadow-[0_8px_18px_rgba(0,25,255,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading || isVerifying ? 'Verifying...' : 'Verify account'}
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default BankAccountForm
