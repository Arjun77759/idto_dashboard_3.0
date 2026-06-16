import { Check, Sparkles } from 'lucide-react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import idtoLogo from '../assets/idto-logo.svg'

const GoogleConnectingPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const email = location.state?.email || 'arjun@company.com'
  const redirectTo = location.state?.redirectTo

  useEffect(() => {
    if (!redirectTo) return

    const timeout = window.setTimeout(() => {
      navigate(redirectTo, { replace: true })
    }, 1200)

    return () => window.clearTimeout(timeout)
  }, [navigate, redirectTo])

  return (
    <div className="min-h-screen w-full bg-white p-4 text-[#050c13] sm:p-6 lg:p-[25px]">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-10 lg:min-h-[calc(100vh-50px)] lg:grid-cols-[minmax(420px,669px)_minmax(430px,1fr)] lg:gap-[72px] xl:gap-[108px]">
        <section className="relative hidden min-h-[640px] overflow-hidden rounded-[18px] bg-[#050c13] lg:block">
          <img
            src="/google-connecting-hero.png"
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
          <div className="w-full max-w-[518px]">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] px-[13px] py-[5px] text-[12px] leading-4 text-[#62748e] lg:mb-[72px]">
              <Sparkles className="size-[14px]" strokeWidth={1.7} />
              Connecting Google
            </div>

            <div className="flex flex-col items-center">
              <img src={idtoLogo} alt="idto" className="mb-[30px] h-10 w-[70px]" />

              <div className="mb-[30px] h-[110px] w-[116px] rounded-full bg-[radial-gradient(circle_at_35%_30%,#9bb7ff_0%,#466cff_38%,#0019ff_72%,#0012b5_100%)] blur-[0.2px] shadow-[0_20px_35px_rgba(0,25,255,0.2)]" />

              <div className="w-full text-center">
                <h1 className="font-serif text-[30px] font-normal leading-9 text-[#050c13]">
                  Signing you in with Google.
                </h1>
                <p className="mx-auto mt-5 max-w-[518px] text-[14px] font-normal leading-5 text-[#62748e]">
                  Grabbing your name and email from Google Workspace. Just a second.
                </p>
              </div>

              <div className="mt-5 flex w-full items-center gap-3 rounded-[14px] border border-[#e4e4e7] bg-white p-[13px]">
                <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#00e59e]/20 text-[#0a8a5e]">
                  <Check className="size-4" strokeWidth={2} />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[14px] leading-5 text-[#0a0e1f]">{email}</p>
                  <p className="text-[12px] leading-4 text-[#71717b]">Connected via Google Workspace</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoogleConnectingPage
