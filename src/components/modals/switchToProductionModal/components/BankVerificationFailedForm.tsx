import { useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  CreditCard,
  FileCheck2,
  Save,
  ShieldCheck,
  Upload,
  X
} from 'lucide-react'
import idtoLogo from '@/assets/idto-logo.svg'

export type BankRecoveryMethod = 'different-account' | 'cancelled-cheque'

interface BankVerificationFailedFormProps {
  onNext: (method: BankRecoveryMethod) => void
  onPrevious?: () => void
  isLoading?: boolean
}

const BankVerificationFailedForm = ({
  onNext,
  onPrevious,
  isLoading = false
}: BankVerificationFailedFormProps) => {
  const [method, setMethod] = useState<BankRecoveryMethod>('cancelled-cheque')
  const [chequeFile, setChequeFile] = useState<File | null>(null)

  const progressItems = [
    ['1', 'Company basics'],
    ['2', 'PAN & GST'],
    ['3', 'Authorized signatory'],
    ['4', 'Bank & review']
  ] as const

  const methods = [
    {
      id: 'different-account' as const,
      title: 'Try a different account',
      description: "Use the company's primary current account.",
      icon: CreditCard
    },
    {
      id: 'cancelled-cheque' as const,
      title: 'Upload cancelled cheque',
      description: 'Bypasses penny-drop. Goes to ~24h manual review.',
      icon: Upload
    }
  ]

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
            {progressItems.map(([number, title], index) => {
              const active = index === progressItems.length - 1
              return (
                <li
                  key={number}
                  className={`flex h-[51px] items-center gap-3 rounded-xl px-2.5 py-2 ${active ? 'bg-[#e1f0ff]' : ''}`}
                >
                  <span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold leading-[15px] ${active ? 'bg-[#0c121a] text-white' : 'bg-[#00a575] text-white'}`}>
                    {active ? number : <Check className="size-3.5" />}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[12.5px] leading-[19px] ${active ? 'font-bold text-[#0c121a]' : 'text-[#6a727d]'}`}>
                      {title}
                    </span>
                    <span className="block text-[10.5px] leading-4 text-[#6a727d]">~ under 5 min</span>
                  </span>
                </li>
              )
            })}
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
              <span aria-hidden="true">·</span>
              <button type="button" className="inline-flex items-center gap-1">
                <CircleHelp className="size-3" />
                Help
              </button>
            </div>
          </header>

          <div className="flex-1 px-10 pt-[31px]">
            <div className="max-w-[672px]">
              <p className="text-[11px] uppercase leading-[17px] tracking-[1.54px] text-[#1034b1]">
                Bank · couldn&apos;t verify
              </p>
              <h2 className="mt-1.5 text-[26px] font-bold leading-[39px] tracking-[-0.65px] text-[#0c121a]">
                The bank account didn&apos;t match
              </h2>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 rounded-2xl border border-[#e0e5eb] bg-[#f8fafd] p-4">
              <div>
                <p className="text-[10.5px] leading-4 text-[#6a727d]">You entered</p>
                <p className="mt-1 text-[12.5px] font-medium leading-[19px] text-[#0c121a]">Acme Payments Pvt Ltd</p>
              </div>
              <div>
                <p className="text-[10.5px] leading-4 text-[#6a727d]">Bank returned</p>
                <p className="mt-1 text-[12.5px] font-medium leading-[19px] text-[#0c121a]">ACME PAYMENT PVT LTD</p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              {methods.map((item) => {
                const selected = method === item.id
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setMethod(item.id)}
                    className={`flex h-[75px] items-start gap-3 rounded-2xl border bg-white p-[17px] text-left transition ${
                      selected
                        ? 'border-[#0c121a] shadow-[0_0_0_2px_rgba(12,18,26,0.1)]'
                        : 'border-[#e0e5eb] hover:border-[#aeb7c2]'
                    }`}
                  >
                    <span className={`flex size-9 shrink-0 items-center justify-center rounded-xl ${
                      selected
                        ? 'bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)] text-white'
                        : 'bg-[#f0f4f9] text-[#0c121a]'
                    }`}>
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="flex items-center gap-2 text-[13.5px] font-bold leading-[20px] text-[#0c121a]">
                        {item.title}
                        {selected && <Check className="size-3.5 text-[#008a5d]" />}
                      </span>
                      <span className="mt-0.5 block text-[12px] leading-[18px] text-[#6a727d]">
                        {item.description}
                      </span>
                    </span>
                  </button>
                )
              })}
            </div>

            {method === 'cancelled-cheque' && (
              <label
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault()
                  setChequeFile(event.dataTransfer.files[0] ?? null)
                }}
                className="mt-4 flex h-24 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-[#b9c4d1] bg-[#fbfdff] transition hover:border-[#3061ef] hover:bg-[#f5f9ff]"
              >
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="sr-only"
                  onChange={(event) => setChequeFile(event.target.files?.[0] ?? null)}
                />
                {chequeFile ? (
                  <span className="flex items-center gap-3">
                    <span className="flex size-9 items-center justify-center rounded-xl bg-[#ddfcef] text-[#008a5d]">
                      <FileCheck2 className="size-4" />
                    </span>
                    <span className="max-w-[360px] text-left">
                      <span className="block truncate text-[12.5px] font-medium leading-[19px] text-[#0c121a]">{chequeFile.name}</span>
                      <span className="block text-[10.5px] leading-4 text-[#6a727d]">Ready for manual review</span>
                    </span>
                    <button
                      type="button"
                      aria-label="Remove cancelled cheque"
                      onClick={(event) => {
                        event.preventDefault()
                        setChequeFile(null)
                      }}
                      className="flex size-7 items-center justify-center rounded-lg text-[#6a727d] hover:bg-[#eef2f6]"
                    >
                      <X className="size-3.5" />
                    </button>
                  </span>
                ) : (
                  <span className="text-center">
                    <Upload className="mx-auto size-4 text-[#3061ef]" />
                    <span className="mt-1 block text-[12px] leading-[18px] text-[#0c121a]">Drop cancelled cheque or browse</span>
                    <span className="block text-[10.5px] leading-4 text-[#6a727d]">PDF, PNG or JPG</span>
                  </span>
                )}
              </label>
            )}
          </div>

          <footer className="mx-10 flex h-[82px] shrink-0 items-center justify-between border-t border-[#e0e5eb]">
            <button
              type="button"
              onClick={onPrevious}
              disabled={isLoading}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[13px] leading-5 text-[#0c121a] hover:bg-[#f8fafd] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ArrowLeft className="size-3.5" />
              Back
            </button>
            <button
              type="button"
              onClick={() => onNext(method)}
              disabled={isLoading || (method === 'cancelled-cheque' && !chequeFile)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0c121a] px-4 text-[13px] leading-5 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? 'Continuing...' : 'Continue'}
              <ArrowRight className="size-3.5" />
            </button>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default BankVerificationFailedForm
