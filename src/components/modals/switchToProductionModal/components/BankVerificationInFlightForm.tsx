import { useEffect } from 'react'
import { ArrowLeft, Check, CircleHelp, LoaderCircle, Save, ShieldCheck } from 'lucide-react'
import idtoLogo from '@/assets/idto-logo.svg'

interface BankVerificationInFlightFormProps {
  onComplete: () => void
  onPrevious?: () => void
}

const BankVerificationInFlightForm = ({ onComplete, onPrevious }: BankVerificationInFlightFormProps) => {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 3200)
    return () => window.clearTimeout(timer)
  }, [onComplete])

  const progressItems = [
    ['1', 'Company basics'],
    ['2', 'PAN & GST'],
    ['3', 'Authorized signatory'],
    ['4', 'Bank & review']
  ] as const

  const verificationSteps = [
    { title: 'Initiating transfer via IMPS', state: 'complete' },
    { title: 'Bank received the request', state: 'complete' },
    { title: 'Confirming account holder name', state: 'loading' },
    { title: 'Done', state: 'pending' }
  ] as const

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
                <li key={number} className={`flex h-[51px] items-center gap-3 rounded-xl px-2.5 py-2 ${active ? 'bg-[#e1f0ff]' : ''}`}>
                  <span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold leading-[15px] ${active ? 'bg-[#0c121a] text-white' : 'bg-[#00a575] text-white'}`}>
                    {active ? number : <Check className="size-3.5" />}
                  </span>
                  <span className="min-w-0">
                    <span className={`block text-[12.5px] leading-[19px] ${active ? 'font-bold text-[#0c121a]' : 'text-[#6a727d]'}`}>{title}</span>
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
              <p className="text-[11px] uppercase leading-[17px] tracking-[1.54px] text-[#1034b1]">Bank · verifying</p>
              <h2 className="mt-1.5 text-[26px] font-bold leading-[39px] tracking-[-0.65px] text-[#0c121a]">
                Sending ₹1 to your account…
              </h2>
            </div>

            <div className="mt-7 rounded-2xl border border-[#e0e5eb] p-5">
              <ol className="flex flex-col gap-3">
                {verificationSteps.map((item, index) => (
                  <li key={item.title} className="flex h-5 items-center gap-3 text-[12.5px] leading-[19px] text-[#0c121a]">
                    <span className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                      item.state === 'complete'
                        ? 'bg-[#00a575] text-white'
                        : item.state === 'loading'
                          ? 'border border-[#3061ef] bg-[#eef5ff] text-[#3061ef]'
                          : 'bg-[#f0f4f9] text-[#6a727d]'
                    }`}>
                      {item.state === 'complete' ? <Check className="size-3" /> : item.state === 'loading' ? <LoaderCircle className="size-3 animate-spin" /> : index + 1}
                    </span>
                    {item.title}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <footer className="mx-10 flex h-[82px] shrink-0 items-center justify-between border-t border-[#e0e5eb]">
            <button type="button" onClick={onPrevious} className="inline-flex h-10 items-center justify-center gap-2 rounded-xl px-4 text-[13px] leading-5 text-[#0c121a] hover:bg-[#f8fafd]">
              <ArrowLeft className="size-3.5" />
              Back
            </button>
            <button type="button" disabled className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#0c121a] px-4 text-[13px] leading-5 text-white opacity-60">
              <LoaderCircle className="size-3.5 animate-spin" />
              Verifying…
            </button>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default BankVerificationInFlightForm
