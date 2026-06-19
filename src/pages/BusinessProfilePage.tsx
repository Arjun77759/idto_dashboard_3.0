import { ArrowRight, Building2, Sparkles, Store, UserRound } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import idtoLogo from '../assets/idto-logo.svg'

type OperationType = 'business' | 'freelancer'

const operationOptions: Array<{
  id: OperationType
  icon: typeof Building2
  title: string
  description: string
}> = [
  {
    id: 'business',
    icon: Building2,
    title: 'Business / Company',
    description: 'Registered with PAN, GST & CIN',
  },
  {
    id: 'freelancer',
    icon: UserRound,
    title: 'Freelancer / Sole proprietor',
    description: "Personal PAN - we'll collect this later",
  },
]

const BusinessProfilePage = () => {
  const navigate = useNavigate()
  const [companyName, setCompanyName] = useState('Acme Verification Pvt. Ltd.')
  const [operationType, setOperationType] = useState<OperationType>('business')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate(operationType === 'business' ? '/business-type' : '/workspace-setup')
  }

  return (
    <div className="min-h-screen w-full bg-white p-4 text-[#050c13] sm:p-6 lg:p-[25px]">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-10 lg:min-h-[calc(100vh-50px)] lg:grid-cols-[minmax(420px,669px)_minmax(430px,1fr)] lg:gap-[72px] xl:gap-[108px]">
        <section className="relative hidden min-h-[640px] overflow-hidden rounded-[18px] bg-[#050c13] lg:block">
          <img
            src="/business-profile-hero.png"
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
          <div className="w-full max-w-[521px]">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] px-[13px] py-[5px] text-[12px] leading-4 text-[#62748e] lg:mb-[64px]">
              <Store className="size-[14px]" strokeWidth={1.7} />
              Your business
            </div>

            <div className="flex flex-col items-center">
              <img src={idtoLogo} alt="idto" className="mb-[30px] h-10 w-[70px]" />

              <div className="mb-5 w-full text-center">
                <h1 className="font-serif text-[30px] font-normal leading-9 text-[#050c13]">
                  Now, tell us about your business.
                </h1>
                <p className="mx-auto mt-6 max-w-[518px] text-[14px] font-normal leading-5 text-[#62748e]">
                  We'll set up your verification flow and pre-load the right compliance checklist.
                </p>
              </div>

              <form className="w-full space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <label htmlFor="company-name" className="block text-[14px] font-medium leading-5 text-[#050c13]">
                    Company name
                  </label>
                  <div className="flex items-center gap-2 rounded-[14px] border border-[#e4e4e7] bg-white p-[13px]">
                    <Building2 className="size-4 shrink-0 text-[#9f9fa9]" strokeWidth={1.8} />
                    <input
                      id="company-name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="min-w-0 flex-1 bg-transparent text-[14px] leading-5 text-[#0a0e1f] outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-2.5">
                  <p className="text-center text-[14px] font-medium leading-5 text-[#050c13]">
                    How do you operate?
                  </p>

                  <div className="grid gap-3 sm:grid-cols-2">
                    {operationOptions.map((option) => {
                      const Icon = option.icon
                      const selected = operationType === option.id

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setOperationType(option.id)}
                          className={`flex min-h-[118px] flex-col items-center justify-center rounded-[14px] border px-4 py-5 text-center transition ${
                            selected
                              ? 'border-[#0019ff] bg-[#0019ff]/[0.04] shadow-[0_0_0_3px_rgba(0,25,255,0.08)]'
                              : 'border-[#e4e4e7] bg-white hover:border-[#9f9fa9]'
                          }`}
                        >
                          <span
                            className={`mb-3 flex size-9 items-center justify-center rounded-full ${
                              selected ? 'bg-[#0019ff] text-white' : 'bg-[#f4f4f5] text-[#62748e]'
                            }`}
                          >
                            <Icon className="size-4" strokeWidth={1.8} />
                          </span>
                          <span className="text-[14px] font-medium leading-5 text-[#050c13]">{option.title}</span>
                          <span className="mt-1 text-[12px] leading-4 text-[#62748e]">{option.description}</span>
                        </button>
                      )
                    })}
                  </div>

                  <p className="text-center text-[12px] leading-4 text-[#62748e]">
                    Choosing Business / Company? You'll pick your company type next.
                  </p>
                </div>

                <button
                  type="submit"
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-[#050c13] px-4 text-[14px] font-normal leading-5 text-[#fafcfe] transition hover:bg-[#131b31]"
                >
                  Continue
                  <ArrowRight className="size-4" strokeWidth={1.8} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BusinessProfilePage
