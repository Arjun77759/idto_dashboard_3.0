import { useState } from 'react'
import { ArrowLeft, ArrowRight, Check, CircleHelp, Save, ShieldCheck } from 'lucide-react'
import idtoLogo from '@/assets/idto-logo.svg'
import { formatEntityType } from '@/lib/entityType'
import type { UserProfile } from '@/store/userProfileStore'

interface KYCFinalReviewFormProps {
  onSubmit: () => void
  onPrevious?: () => void
  onSaveAndExit?: () => void
  isLoading?: boolean
  userProfile?: UserProfile | null
}

const KYCFinalReviewForm = ({
  onSubmit,
  onPrevious,
  onSaveAndExit,
  isLoading = false,
  userProfile,
}: KYCFinalReviewFormProps) => {
  const [confirmed, setConfirmed] = useState(false)
  const emptyValue = 'Not provided'
  const companyName = userProfile?.registered_name || userProfile?.brand_name || ''

  const reviewSections = [
    {
      title: 'Company basics',
      rows: [
        ['Brand', userProfile?.brand_name || emptyValue],
        ['Legal name', userProfile?.registered_name || emptyValue],
        ['Entity', formatEntityType(userProfile?.entity_type) || emptyValue],
        ['Industry', userProfile?.industry || emptyValue],
        ['Address', userProfile?.business_address || emptyValue],
      ],
    },
    {
      title: 'PAN & GST',
      rows: [
        ['Business PAN', userProfile?.pan_number ? `${userProfile.pan_number} · Verified` : emptyValue],
        ['GSTIN', userProfile?.gst_number ? `${userProfile.gst_number} · Verified` : 'Not applicable or not provided'],
      ],
    },
    {
      title: 'Authorized signatory',
      rows: [
        ['Name', userProfile?.name || emptyValue],
        ['Email', userProfile?.authorized_signatory_email || userProfile?.email || emptyValue],
        ['Mobile', userProfile?.mobile || emptyValue],
      ],
    },
    {
      title: 'Bank account',
      rows: [
        ['Status', 'Pending verification'],
        ['Holder', companyName || emptyValue],
        ['Finance email', userProfile?.authorized_signatory_email || userProfile?.email || emptyValue],
      ],
    },
  ]

  const progressItems = [
    ['1', 'Company basics'],
    ['2', 'PAN & GST'],
    ['3', 'Authorized signatory'],
    ['4', 'Bank & review'],
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
              <span>96%</span>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-[#f0f4f9]">
              <div className="h-full w-[96%] rounded-full bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)]" />
            </div>
          </div>

          <ol className="flex flex-col gap-1">
            {progressItems.map(([number, title], index) => {
              const active = index === progressItems.length - 1
              return (
                <li key={number} className={`flex h-[51px] items-center gap-3 rounded-xl px-2.5 py-2 ${active ? 'bg-[#e1f0ff]' : ''}`}>
                  <span className={`flex size-6 items-center justify-center rounded-full text-[10px] font-bold ${active ? 'bg-[#0c121a] text-white' : 'bg-[#00a575] text-white'}`}>
                    {active ? number : <Check className="size-3.5" />}
                  </span>
                  <span>
                    <span className={`block text-[12.5px] leading-[19px] ${active ? 'font-bold text-[#0c121a]' : 'text-[#6a727d]'}`}>{title}</span>
                    <span className="block text-[10.5px] leading-4 text-[#6a727d]">~ under 5 min</span>
                  </span>
                </li>
              )
            })}
          </ol>

          <div className="rounded-2xl border border-[#e0e5eb] bg-white px-3 py-5">
            <div className="flex items-center gap-1.5 text-[11px] text-[#0c121a]">
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
            <button type="button" onClick={onSaveAndExit} className="inline-flex items-center gap-2 text-[12px] text-[#6a727d]">
              <ArrowLeft className="size-3.5" />
              Save & exit
            </button>
            <div className="flex items-center gap-3 text-[11px] text-[#6a727d]">
              <span className="inline-flex items-center gap-1"><Save className="size-3" />auto-saved</span>
              <span>·</span>
              <button type="button" className="inline-flex items-center gap-1"><CircleHelp className="size-3" />Help</button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-10 pb-6 pt-[31px]">
            <p className="text-[11px] leading-[17px] text-[#6a727d]">Step 4 of 4</p>
            <h2 className="mt-1.5 text-[26px] font-bold leading-[39px] tracking-[-0.65px] text-[#0c121a]">
              One last look before we submit
            </h2>
            <p className="mt-1.5 text-[12px] leading-[18px] text-[#6a727d]">
              Review the information currently stored for your account. Missing values are shown as not provided.
            </p>

            <div className="mt-7 flex flex-col gap-3">
              {reviewSections.map((section) => (
                <section key={section.title} className="rounded-2xl border border-[#e0e5eb] p-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[13.5px] font-bold leading-5 text-[#0c121a]">{section.title}</h3>
                    <button type="button" onClick={onPrevious} className="text-[12px] leading-[18px] text-[#3061ef]">Edit</button>
                  </div>
                  <dl className="mt-2 grid grid-cols-2 gap-x-6 gap-y-2">
                    {section.rows.map(([label, value]) => (
                      <div key={label} className="flex min-w-0 items-center justify-between gap-3 text-[12px] leading-[18px]">
                        <dt className="shrink-0 text-[#6a727d]">{label}</dt>
                        <dd className="truncate text-right font-medium text-[#0c121a]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              ))}

              <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-[#f8fafd] p-3 text-[12px] leading-[18px] text-[#0c121a]">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  className="mt-0.5 size-4 accent-[#0019ff]"
                />
                I confirm the above information is accurate and I&apos;m authorised to submit
                {companyName ? ` on behalf of ${companyName}` : ''}.
              </label>
            </div>
          </div>

          <footer className="mx-10 flex h-[65px] shrink-0 items-center justify-between border-t border-[#e0e5eb]">
            <button type="button" onClick={onPrevious} className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-[13px] text-[#0c121a] hover:bg-[#f8fafd]">
              <ArrowLeft className="size-3.5" />Back
            </button>
            <div className="flex gap-2">
              <button type="button" onClick={onSaveAndExit} className="h-10 rounded-xl border border-[#e0e5eb] px-4 text-[13px] text-[#0c121a]">
                Save & exit
              </button>
              <button
                type="button"
                onClick={onSubmit}
                disabled={!confirmed || isLoading}
                className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#0c121a] px-4 text-[13px] text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isLoading ? 'Submitting...' : 'Submit for review'}<ArrowRight className="size-3.5" />
              </button>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}

export default KYCFinalReviewForm
