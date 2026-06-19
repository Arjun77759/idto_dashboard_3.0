import { useIsMobile } from '@/hooks/use-mobile'
import { fetchOnboardingStatus } from '@/store/onboardingStore'
import { signInWithPopup } from 'firebase/auth'
import { ArrowRight, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { firebaseAuth, requestSignupOtp } from '../api/authApi'
import idtoLogo from '../assets/idto-logo.svg'
import { useToast } from '../hooks/use-toast'
import { setAuth } from '../lib/auth'
import { auth, googleProvider } from '../lib/firebase'
import { updateSignupDraft } from '../lib/signupDraft'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({ email: '' })
  const [errors, setErrors] = useState<{ email?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next: { email?: string } = {}
    if (!formData.email) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Please enter a valid email address'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const redirectAfterGoogleSignup = async () => {
    try {
      const onboardingStatus = await fetchOnboardingStatus()
      const isProduction = Boolean(onboardingStatus?.is_onboarded)

      if (isMobile && isProduction) {
        navigate('/mobile-production-redirect')
      } else if (isMobile && !isProduction) {
        navigate('/post-signup-info')
      } else {
        navigate('/dashboard')
      }
    } catch {
      navigate('/dashboard')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return

    try {
      setSubmitting(true)
      await requestSignupOtp({ email: formData.email })
      updateSignupDraft({ email: formData.email, emailVerified: false })
      toast({
        title: 'OTP sent',
        description: `Enter the 6-digit code sent to ${formData.email}.`,
      })
      navigate('/check-inbox', { state: { email: formData.email } })
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const message = detail || err?.response?.data?.message || err?.message || 'Failed to send signup OTP'
      setErrors((prev) => ({ ...prev, form: message }))
      toast({
        title: 'Could not send OTP',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleGoogleSignup = async () => {
    try {
      setErrors({})
      setSubmitting(true)

      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const idToken = await user.getIdToken()

      const res = await firebaseAuth({ id_token: idToken })

      setAuth({ access_token: res.access_token, user_agent: 'google' })

      await redirectAfterGoogleSignup()

      toast({
        title: 'Signup successful',
        description: 'Welcome! Redirecting...',
      })
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const message = detail || err?.response?.data?.message || err?.message || 'Failed to sign up with Google'

      setErrors((prev) => ({ ...prev, form: message }))
      toast({
        title: 'Google signup failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen w-full bg-white p-4 text-[#050c13] sm:p-6 lg:p-[25px]">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-10 lg:min-h-[calc(100vh-50px)] lg:grid-cols-[minmax(420px,669px)_minmax(430px,1fr)] lg:gap-[72px] xl:gap-[108px]">
        <section className="relative hidden min-h-[640px] overflow-hidden rounded-[18px] bg-[#050c13] lg:block">
          <img
            src="/signup-hero.png"
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
            <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[#e2e8f0] px-[13px] py-[5px] text-[12px] leading-4 text-[#62748e] lg:mb-[18px]">
              <ShieldCheck className="size-3" strokeWidth={1.7} />
              Secure
            </div>

            <div className="flex flex-col items-center">
              <img src={idtoLogo} alt="idto" className="mb-[30px] h-10 w-[70px]" />

              <div className="mb-5 w-full text-center">
                <h1 className="font-serif text-[30px] font-normal leading-9 text-[#050c13]">Your sandbox is waiting.</h1>
                <p className="mx-auto mt-6 max-w-[518px] text-[14px] font-normal leading-5 text-[#62748e]">
                  Drop in your work email. We'll send a one-click link - and you'll land in a live sandbox, loaded with real-world data, in seconds.
                </p>
              </div>

              <form className="w-full space-y-8" onSubmit={handleSubmit} noValidate>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="signup-email" className="block text-[14px] font-medium leading-5 text-[#050c13]">
                      Work email
                    </label>
                    <div className="relative">
                      <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#62748e]" strokeWidth={1.7} />
                      <input
                        id="signup-email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@company.com"
                        className="h-[50px] w-full rounded-[20px] border border-[#e2e8f0] bg-white pb-[14px] pl-[41px] pr-[17px] pt-[15px] text-[14px] font-normal leading-normal text-[#050c13] outline-none transition placeholder:text-[#050c13]/50 focus:border-[#8a95ff] focus:ring-2 focus:ring-[#8a95ff]/20"
                      />
                    </div>
                    {errors.email ? <p className="text-[12px] leading-4 text-red-600">{errors.email}</p> : null}
                    <p className="text-[12px] leading-4 text-[#62748e]">We'll send a 6-digit OTP without creating your account yet.</p>
                  </div>

                  {errors.form ? <p className="text-[13px] leading-5 text-red-600">{errors.form}</p> : null}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-[#050c13] px-4 text-[14px] font-normal leading-5 text-[#fafcfe] transition hover:bg-[#131b31] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Submitting...' : 'Continue with email'}
                    <ArrowRight className="size-4" strokeWidth={1.8} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-[12px] leading-4 text-[#62748e]">
                    <div className="h-px flex-1 bg-[#e2e8f0]" />
                    OR
                    <div className="h-px flex-1 bg-[#e2e8f0]" />
                  </div>

                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    disabled={submitting}
                    className="flex h-[46px] w-full items-center justify-center gap-2 rounded-[20px] border border-[#e2e8f0] bg-white px-4 text-[14px] font-normal leading-5 text-[#050c13] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="text-[#fb2c36]">G</span>
                    Continue with Google
                  </button>
                </div>
              </form>

              <p className="mt-4 w-full text-center text-[12px] leading-4 text-[#62748e]">
                By continuing, you agree to our Terms and Privacy Policy.
              </p>

              <p className="mt-[22px] text-center text-[12px] leading-5 text-[#050c13]">
                Already have an account?{' '}
                <Link to="/login" className="text-[#8a95ff] underline underline-offset-2 transition hover:text-[#0019ff]">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
