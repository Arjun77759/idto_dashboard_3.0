import { useIsMobile } from '@/hooks/use-mobile'
import { useToast } from '@/hooks/use-toast'
import { fetchOnboardingStatus } from '@/store/onboardingStore'
import { signInWithPopup } from 'firebase/auth'
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, ShieldCheck, Sparkles } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { firebaseAuth, login } from '../api/authApi'
import idtoLogo from '../assets/idto-logo.svg'
import { setAuth } from '../lib/auth'
import { auth, googleProvider } from '../lib/firebase'

const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [keepSignedIn, setKeepSignedIn] = useState(true)

  useEffect(() => {
    const stateEmail = location.state?.email
    if (stateEmail) {
      setFormData(prev => ({ ...prev, email: stateEmail }))
    }
  }, [location.state])

  const validate = () => {
    const next: { email?: string; password?: string } = {}
    if (!formData.email) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      next.email = 'Enter a valid email'
    }
    if (!formData.password) {
      next.password = 'Password is required'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const redirectAfterLogin = async () => {
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
      const res = await login({ email: formData.email, password: formData.password })
      setAuth({ access_token: res.access_token, user_agent: res.user_agent }, { persist: keepSignedIn })

      await redirectAfterLogin()

      toast({
        title: 'Login successful',
        description: 'Welcome back! Redirecting...',
      })
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const message = detail || err?.response?.data?.message || 'Failed to sign in'
      setErrors((prev) => ({ ...prev, form: message }))
      toast({
        title: 'Login failed',
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

  const handleGoogleLogin = async () => {
    try {
      setErrors({})
      setSubmitting(true)

      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const idToken = await user.getIdToken()

      const res = await firebaseAuth({ id_token: idToken })

      setAuth({ access_token: res.access_token, user_agent: 'google' }, { persist: keepSignedIn })

      await redirectAfterLogin()

      toast({
        title: 'Login successful',
        description: 'Welcome! Redirecting...',
      })
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const message = detail || err?.response?.data?.message || err?.message || 'Failed to sign in with Google'
      setErrors((prev) => ({ ...prev, form: message }))

      toast({
        title: 'Google sign-in failed',
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
            src="/login-hero.png"
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

              <div className="mb-2 w-full text-center">
                <h1 className="font-serif text-[30px] font-normal leading-9 text-[#050c13]">Welcome back.</h1>
                <p className="mx-auto mt-2 max-w-[518px] text-[13.9px] font-normal leading-5 text-[#62748e]">
                  Sign in to your dashboard and continue where you left off. We've shipped a few
                  <span className="hidden sm:inline"><br /></span> new things - check the release notes after you're in.
                </p>
              </div>

              <form className="mt-2 w-full space-y-[13px]" onSubmit={handleSubmit} noValidate>
                <div className="space-y-1.5">
                  <label htmlFor="login-email" className="block text-[13.9px] leading-5 text-[#050c13]">
                    Work email
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#62748e]" strokeWidth={1.7} />
                    <input
                      id="login-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@company.com"
                      className="h-[50px] w-full rounded-[20px] border border-[#e2e8f0] bg-white px-[17px] py-[15px] pl-[41px] text-[13.9px] font-normal leading-normal text-[#050c13] outline-none transition placeholder:text-[#050c13]/50 focus:border-[#8a95ff] focus:ring-2 focus:ring-[#8a95ff]/20"
                    />
                  </div>
                  {errors.email ? <p className="text-[12px] leading-4 text-red-600">{errors.email}</p> : null}
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <label htmlFor="login-password" className="text-[14px] leading-5 text-[#050c13]">
                      Password
                    </label>
                    <Link to="/forgot-password" className="text-[12px] leading-4 text-[#62748e] transition hover:text-[#050c13]">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#62748e]" strokeWidth={1.7} />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="********"
                      className="h-[50px] w-full rounded-[20px] border border-[#e2e8f0] bg-white px-[41px] py-[15px] text-[13px] font-normal leading-normal text-[#050c13] outline-none transition placeholder:text-[#050c13]/50 focus:border-[#8a95ff] focus:ring-2 focus:ring-[#8a95ff]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="absolute right-3.5 top-1/2 flex size-4 -translate-y-1/2 items-center justify-center text-[#62748e] transition hover:text-[#050c13]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-4" strokeWidth={1.7} /> : <Eye className="size-4" strokeWidth={1.7} />}
                    </button>
                  </div>
                  {errors.password ? <p className="text-[12px] leading-4 text-red-600">{errors.password}</p> : null}
                </div>

                <label className="flex items-center gap-2 text-[14px] leading-5 text-[#050c13]">
                  <input
                    type="checkbox"
                    checked={keepSignedIn}
                    onChange={e => setKeepSignedIn(e.target.checked)}
                    className="size-[13px] rounded-[2.5px] border-[#e2e8f0] text-[#050c13] focus:ring-[#050c13]"
                  />
                  Keep me signed in for 30 days
                </label>

                {errors.form ? <p className="text-[13px] leading-5 text-red-600">{errors.form}</p> : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-[#050c13] px-4 text-[14px] font-normal leading-5 text-[#fafcfe] transition hover:bg-[#131b31] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Signing in...' : 'Sign in securely'}
                  <ArrowRight className="size-4" strokeWidth={1.8} />
                </button>

                <div className="flex items-center gap-3 text-[12px] leading-4 text-[#62748e]">
                  <div className="h-px flex-1 bg-[#e2e8f0]" />
                  OR
                  <div className="h-px flex-1 bg-[#e2e8f0]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={submitting}
                  className="flex h-[48px] w-full items-center justify-center gap-2 rounded-[20px] border border-[#e2e8f0] bg-white px-4 text-[14px] font-normal leading-5 text-[#050c13] transition hover:bg-[#f8fafc] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="text-[#fb2c36]">G</span>
                  Continue with Google
                </button>
              </form>

              <p className="mt-[22px] text-center text-[12px] leading-5 text-[#050c13]">
                Don't have an account?{' '}
                <Link to="/register" className="text-[#8a95ff] underline underline-offset-2 transition hover:text-[#0019ff]">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
