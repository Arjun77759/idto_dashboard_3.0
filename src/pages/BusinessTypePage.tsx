import { ArrowRight, Building2, Check, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import idtoLogo from '../assets/idto-logo.svg'
import { updateSignupDraft } from '../lib/signupDraft'

const businessTypes = [
  'Private Limited',
  'Sole Proprietor',
  'Partnership',
  'LLP',
  'Public Limited',
  'NGO',
  'Government Entity',
  'Trust',
  'Society',
  'Section 8 Company',
  'One Person Company (OPC)',
  'Other',
]

const BusinessTypePage = () => {
  const navigate = useNavigate()
  const [selectedType, setSelectedType] = useState('Private Limited')

  const handleSubmit = () => {
    updateSignupDraft({ businessType: selectedType })
    navigate('/workspace-setup')
  }

  return (
    <div className="min-h-screen w-full bg-white p-4 text-[#050c13] sm:p-6 lg:p-[25px]">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-10 lg:min-h-[calc(100vh-50px)] lg:grid-cols-[minmax(420px,669px)_minmax(430px,1fr)] lg:gap-[72px] xl:gap-[91px]">
        <section className="relative hidden min-h-[640px] overflow-hidden rounded-[18px] bg-[#050c13] lg:block">
          <img
            src="/business-type-hero.png"
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute left-[41px] right-[42px] top-[44px] rounded-[24px] border border-white/20 bg-white/10 p-[21px] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-md">
            <div className="mb-5 inline-flex h-6 items-center gap-2 rounded-full bg-white/10 px-3 text-[12px] leading-4 text-white/80">
              <Sparkles className="size-3" strokeWidth={1.5} />
              AI-native identity verification
            </div>
            <h1 className="font-['TikTok_Sans'] text-[44px] font-medium leading-[42px] text-white xl:text-[56px] xl:leading-[50px]">
              Verify smarter.
              <span className="block text-[#5ee9b5]">Decide faster.</span>
            </h1>
            <p className="mt-5 max-w-[430px] text-[28px] font-normal leading-[1.23] tracking-normal text-white xl:text-[32px]">
              Everything you need,
              <span className="block">
                in <span className="font-serif italic">one place</span>.
              </span>
            </p>
          </div>
        </section>

        <div className="flex min-h-[calc(100vh-32px)] items-center justify-center py-5 lg:min-h-[calc(100vh-50px)] lg:py-0">
          <div className="w-full max-w-[577px]">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] px-[13px] py-[5px] text-[12px] leading-4 text-[#62748e] lg:mb-[70px]">
              <Building2 className="size-[14px]" strokeWidth={1.7} />
              Your Business
            </div>

            <div className="flex flex-col items-center">
              <img src={idtoLogo} alt="idto" className="mb-[30px] h-10 w-[70px]" />

              <div className="mb-5 w-full text-center">
                <h1 className="font-serif text-[30px] font-normal leading-9 text-[#050c13]">
                  What kind of business are you?
                </h1>
                <p className="mx-auto mt-6 max-w-[577px] text-[14px] font-normal leading-5 text-[#62748e]">
                  We'll set up the right verification flow instantly.
                </p>
              </div>

              <div className="w-full space-y-4">
                <div className="grid gap-2.5 sm:grid-cols-2">
                  {businessTypes.map((type) => {
                    const selected = selectedType === type

                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSelectedType(type)}
                        className={`flex min-h-[38px] items-center justify-between gap-3 rounded-[14px] border px-[15px] py-[9px] text-left text-[14px] leading-5 transition ${
                          selected
                            ? 'border-[#0019ff] bg-[#0019ff]/[0.05] text-[#0a0e1f]'
                            : 'border-[#e4e4e7] bg-white text-[#0a0e1f] hover:border-[#9f9fa9]'
                        }`}
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span
                            className={`flex size-4 shrink-0 items-center justify-center rounded-full border ${
                              selected ? 'border-[#0019ff] bg-[#0019ff]' : 'border-[#d4d4d8] bg-white'
                            }`}
                          >
                            {selected ? <span className="size-1.5 rounded-full bg-white" /> : null}
                          </span>
                          <span className="truncate">{type}</span>
                        </span>
                        {selected ? <Check className="size-4 shrink-0 text-[#0019ff]" strokeWidth={1.8} /> : null}
                      </button>
                    )
                  })}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-[#050c13] px-4 text-[14px] font-normal leading-5 text-[#fafcfe] transition hover:bg-[#131b31]"
                >
                  Set Up My Workspace
                  <ArrowRight className="size-4" strokeWidth={1.8} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessTypePage
