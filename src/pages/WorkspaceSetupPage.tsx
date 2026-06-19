import { Check, Loader2, Sparkles, UserRound } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { completeSignup } from '../api/authApi'
import idtoLogo from '../assets/idto-logo.svg'
import { useToast } from '../hooks/use-toast'
import { setAuth } from '../lib/auth'
import { clearSignupDraft, getSignupDraft } from '../lib/signupDraft'

const setupItems = [
  'Creating workspace · acme-verification',
  'Provisioning test environment',
  'Generating test API keys',
  'Preloading sample KYC & KYB data',
  'Personalizing your dashboard',
]

const WorkspaceSetupPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const startedRef = useRef(false)
  const [activeStep, setActiveStep] = useState(0)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActiveStep((step) => Math.min(step + 1, setupItems.length - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [])

  useEffect(() => {
    if (startedRef.current) {
      return
    }

    startedRef.current = true

    const finishSignup = async () => {
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

      try {
        const startedAt = Date.now()
        const response = await completeSignup({
          email: draft.email,
          password: draft.password,
          verification_token: draft.emailVerificationToken,
          mobile: draft.mobile,
        })

        clearSignupDraft()

        if (response.access_token) {
          setAuth({ access_token: response.access_token, user_agent: response.user_agent || 'email' })
        }

        setActiveStep(setupItems.length - 1)

        const remainingDelay = Math.max(0, 2500 - (Date.now() - startedAt))
        window.setTimeout(() => {
          toast({
            title: 'Workspace ready',
            description: response.access_token ? 'Opening your dashboard.' : 'Your account is ready. Please sign in.',
          })
          navigate(response.access_token ? '/dashboard' : '/login', { state: { email: draft.email } })
        }, remainingDelay)
      } catch (err: any) {
        const detail = err?.response?.data?.detail
        const message = detail || err?.response?.data?.message || err?.message || 'Failed to complete signup'

        setFailed(true)
        toast({
          title: err?.response?.status === 409 ? 'Email already registered' : 'Signup failed',
          description: message,
          variant: 'destructive',
        })

        if (err?.response?.status === 409) {
          navigate('/login', { state: { email: draft.email } })
        }
      }
    }

    finishSignup()
  }, [navigate, toast])

  return (
    <div className="min-h-screen w-full bg-white p-4 text-[#050c13] sm:p-6 lg:p-[25px]">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-10 lg:min-h-[calc(100vh-50px)] lg:grid-cols-[minmax(420px,669px)_minmax(430px,1fr)] lg:gap-[72px] xl:gap-[105px]">
        <section className="relative hidden min-h-[640px] overflow-hidden rounded-[18px] bg-[#050c13] lg:block">
          <img
            src="/workspace-setup-hero.png"
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
              Almost there
            </div>

            <div className="flex flex-col items-center">
              <img src={idtoLogo} alt="idto" className="mb-[30px] h-10 w-[70px]" />

              <div className="mb-[30px] flex size-20 items-center justify-center rounded-full border-4 border-[#0019ff] bg-[#0019ff]/5">
                {failed ? (
                  <span className="text-[24px] font-medium text-[#ef4444]">!</span>
                ) : (
                  <Loader2 className="size-5 animate-spin text-[#0019ff]" strokeWidth={2} />
                )}
              </div>

              <div className="mb-5 w-full text-center">
                <h1 className="font-serif text-[30px] font-normal leading-9 tracking-normal text-[#050c13]">
                  Your workspace is coming to life.
                </h1>
                <p className="mx-auto mt-6 max-w-[501px] text-[14px] font-normal leading-5 text-[#62748e]">
                  Takes about 10 seconds - we're doing the heavy lifting.
                </p>
              </div>

              <div className="w-full rounded-[18px] border border-[#e4e4e7] bg-white p-[17px]">
                <div className="space-y-3">
                  {setupItems.map((item, index) => {
                    const isDone = index < activeStep || activeStep === setupItems.length - 1
                    const isActive = index === activeStep && !isDone

                    return (
                      <div key={item} className="flex items-center gap-3">
                        <span
                          className={`flex size-5 shrink-0 items-center justify-center rounded-full ${
                            isDone
                              ? 'bg-[#00e59e] text-white'
                              : isActive
                                ? 'bg-[#0019ff] text-white'
                                : 'bg-[#f4f4f5] text-[#9f9fa9]'
                          }`}
                        >
                          {isDone ? (
                            <Check className="size-3" strokeWidth={2.2} />
                          ) : isActive ? (
                            <Loader2 className="size-3 animate-spin" strokeWidth={2.2} />
                          ) : (
                            <span className="size-1.5 rounded-full bg-current" />
                          )}
                        </span>
                        <span className={`text-[12px] leading-4 ${isDone || isActive ? 'text-[#3f3f46]' : 'text-[#9f9fa9]'}`}>
                          {item}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkspaceSetupPage
