import { ArrowRight, Check, Sparkles, UserRound } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import idtoLogo from '../assets/idto-logo.svg'
import { useToast } from '../hooks/use-toast'
import { getSignupDraft } from '../lib/signupDraft'

const readyItems = [
  'Sandbox ready immediately',
  'PAN details collected at go-live',
  'All test APIs unlocked from day one',
]

const SandboxReadyPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleContinue = () => {
    const draft = getSignupDraft()

    if (!draft.email) {
      toast({
        title: 'Email required',
        description: 'Please start signup again so we can create your account.',
        variant: 'destructive',
      })
      navigate('/register')
      return
    }

    if (!draft.emailVerified) {
      toast({
        title: 'Email verification required',
        description: 'Please verify your email OTP before finishing signup.',
        variant: 'destructive',
      })
      navigate('/check-inbox', { state: { email: draft.email } })
      return
    }

    if (!draft.password) {
      toast({
        title: 'Password step required',
        description: 'Please create your password before finishing signup.',
        variant: 'destructive',
      })
      navigate('/create-password?draft=true')
      return
    }

    if (!draft.mobile || !draft.mobileVerified) {
      toast({
        title: 'Mobile verification required',
        description: 'Please verify your mobile number before finishing signup.',
        variant: 'destructive',
      })
      navigate('/confirm-number')
      return
    }

    if (
      !draft.fullName ||
      !draft.jobTitle ||
      !draft.teamFunction ||
      !draft.companyName ||
      draft.operationType !== 'freelancer'
    ) {
      toast({
        title: 'Profile details required',
        description: 'Please complete your profile and business details before finishing signup.',
        variant: 'destructive',
      })
      navigate('/workspace-profile')
      return
    }

    navigate('/workspace-setup')
  }

  return (
    <div className="min-h-screen w-full bg-white p-4 text-[#050c13] sm:p-6 lg:p-[25px]">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-10 lg:min-h-[calc(100vh-50px)] lg:grid-cols-[minmax(420px,669px)_minmax(430px,1fr)] lg:gap-[72px] xl:gap-[108px]">
        <section className="relative hidden min-h-[640px] overflow-hidden rounded-[18px] bg-[#050c13] lg:block">
          <img
            src="/sandbox-ready-hero.png"
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
          <div className="w-full max-w-[501px]">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] px-[13px] py-[5px] text-[12px] leading-4 text-[#62748e] lg:mb-[92px]">
              <UserRound className="size-[14px]" strokeWidth={1.7} />
              Freelancer / Sole proprietor
            </div>

            <div className="flex flex-col items-center">
              <img src={idtoLogo} alt="idto" className="mb-[30px] h-10 w-[70px]" />

              <div className="mb-5 w-full text-center">
                <h1 className="font-serif text-[30px] font-normal leading-9 text-[#050c13]">
                  Jump straight in.
                  <span className="block">Documents can wait.</span>
                </h1>
                <p className="mx-auto mt-6 max-w-[501px] text-[14px] font-normal leading-5 text-[#62748e]">
                  Your sandbox is fully unlocked. We'll ask for your PAN, address proof, and a photo verification only
                  when you're ready to go live.
                </p>
              </div>

              <div className="w-full space-y-4">
                <div className="rounded-[18px] border border-[#e4e4e7] bg-white p-[17px]">
                  <div className="space-y-3">
                    {readyItems.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <span className="flex size-4 shrink-0 items-center justify-center rounded-full bg-[#00e59e]/30 text-[#0a8a5e]">
                          <Check className="size-2.5" strokeWidth={2} />
                        </span>
                        <span className="text-[12px] leading-4 text-[#3f3f46]">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-[#050c13] px-4 text-[14px] font-normal leading-5 text-[#fafcfe] transition hover:bg-[#131b31] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue to sandbox
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

export default SandboxReadyPage
