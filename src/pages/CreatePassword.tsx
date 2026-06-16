import { useToast } from '@/hooks/use-toast'
import { Check, Eye, EyeOff, LockKeyhole, Sparkles, X, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { createPassword } from '../api/authApi'
import idtoLogo from '../assets/idto-logo.svg'
import { getSignupDraft, updateSignupDraft } from '../lib/signupDraft'

const CreatePassword = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState<{ password?: string; confirmPassword?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const isResetPassword = searchParams.get('isReset') === 'true'
  const token = searchParams.get('token')
  const customerId = searchParams.get('customer_id')
  const isDraftSignup = searchParams.get('draft') === 'true'

  useEffect(() => {
    if (!customerId && !isDraftSignup) {
      toast({
        title: 'Invalid link',
        description: 'Missing customer ID. Redirecting to login...',
        variant: 'destructive'
      })
      navigate('/login')
    }
  }, [customerId, isDraftSignup, navigate, toast])

  const passwordRequirements = {
    minLength: formData.password.length >= 8,
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[^A-Za-z0-9]/.test(formData.password),
  }

  const validate = () => {
    const next: { password?: string; confirmPassword?: string } = {}

    if (!formData.password) {
      next.password = 'Password is required'
    } else if (!passwordRequirements.minLength) {
      next.password = 'Password must be at least 8 characters'
    } else if (!passwordRequirements.hasNumber) {
      next.password = 'Password must contain at least one number'
    } else if (!passwordRequirements.hasSpecialChar) {
      next.password = 'Password must contain at least one special character'
    }

    if (!formData.confirmPassword) {
      next.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      next.confirmPassword = "Passwords don't match"
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return

    if (isDraftSignup) {
      const draft = getSignupDraft()

      if (!draft.email) {
        setErrors((prev) => ({ ...prev, form: 'Please enter your email first.' }))
        navigate('/register')
        return
      }

      updateSignupDraft({ password: formData.password })
      toast({
        title: 'Password saved',
        description: 'Continuing setup before we create your account.',
      })
      navigate('/confirm-number')
      return
    }

    if (!customerId) {
      setErrors((prev) => ({ ...prev, form: 'Missing customer ID. Please use the link from your email.' }))
      toast({
        title: 'Invalid link',
        description: 'Missing customer ID. Please use the link from your email.',
        variant: 'destructive'
      })
      return
    }

    try {
      setSubmitting(true)
      const payload: any = {
        customer_id: customerId,
        password: formData.password
      }

      if (token) {
        payload.token = token
      }

      await createPassword(payload)

      toast({
        title: isResetPassword ? 'Password reset successfully' : 'Password created successfully',
        description: isResetPassword
          ? 'Your password has been reset. Redirecting to login...'
          : 'Your password has been set. Redirecting to login...',
      })

      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const message = detail || err?.response?.data?.message || (isResetPassword ? 'Failed to reset password' : 'Failed to create password')
      setErrors((prev) => ({ ...prev, form: message }))

      toast({
        title: isResetPassword ? 'Failed to reset password' : 'Failed to create password',
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

  const Requirement = ({ met, label }: { met: boolean; label: string }) => (
    <div className="flex items-center gap-2 text-[12px] leading-4">
      <span className={`grid size-4 place-items-center rounded-full ${met ? 'bg-[#00e59e]/30 text-[#0a8a5e]' : 'bg-[#f4f4f5] text-[#71717b]'}`}>
        {met ? <Check className="size-2.5" strokeWidth={2.2} /> : <X className="size-2.5" strokeWidth={2} />}
      </span>
      <span className={met ? 'text-[#3f3f46]' : 'text-[#71717b]'}>{label}</span>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-white p-4 text-[#050c13] sm:p-6 lg:p-[25px]">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-10 lg:min-h-[calc(100vh-50px)] lg:grid-cols-[minmax(420px,669px)_minmax(430px,1fr)] lg:gap-[72px] xl:gap-[108px]">
        <section className="relative hidden min-h-[640px] overflow-hidden rounded-[18px] bg-[#050c13] lg:block">
          <img
            src="/create-password-hero.png"
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
              <LockKeyhole className="size-[14px]" strokeWidth={1.7} />
              Set password
            </div>

            <div className="flex flex-col items-center">
              <img src={idtoLogo} alt="idto" className="mb-[30px] h-10 w-[70px]" />

              <h1 className="mb-5 w-full text-center font-serif text-[30px] font-normal leading-9 text-[#050c13]">
                Create your password
              </h1>

              <form className="w-full space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="space-y-1.5 pt-[5.5px]">
                  <label htmlFor="new-password" className="block text-[12px] leading-4 text-[#3f3f46]">
                    New password
                  </label>
                  <div className="flex items-center gap-2 rounded-[14px] border border-[#e4e4e7] bg-white p-[13px]">
                    <LockKeyhole className="size-4 shrink-0 text-[#9f9fa9]" strokeWidth={1.8} />
                    <input
                      id="new-password"
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      className="min-w-0 flex-1 bg-transparent text-[14px] leading-none text-[#050c13] outline-none placeholder:text-[#0a0e1f]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(prev => !prev)}
                      className="text-[#9f9fa9] transition hover:text-[#050c13]"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="size-4" strokeWidth={1.8} /> : <Eye className="size-4" strokeWidth={1.8} />}
                    </button>
                  </div>
                  {errors.password ? <p className="text-[12px] leading-4 text-red-600">{errors.password}</p> : null}
                </div>

                <div className="space-y-1.5 pt-[5.5px]">
                  <label htmlFor="confirm-password" className="block text-[12px] leading-4 text-[#3f3f46]">
                    Confirm password
                  </label>
                  <div className="flex items-center gap-2 rounded-[14px] border border-[#e4e4e7] bg-white p-[13px]">
                    <LockKeyhole className="size-4 shrink-0 text-[#9f9fa9]" strokeWidth={1.8} />
                    <input
                      id="confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="min-w-0 flex-1 bg-transparent text-[14px] leading-none text-[#050c13] outline-none placeholder:text-[#0a0e1f]/50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(prev => !prev)}
                      className="text-[#9f9fa9] transition hover:text-[#050c13]"
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <EyeOff className="size-4" strokeWidth={1.8} /> : <Eye className="size-4" strokeWidth={1.8} />}
                    </button>
                  </div>
                  {errors.confirmPassword ? <p className="text-[12px] leading-4 text-red-600">{errors.confirmPassword}</p> : null}
                </div>

                <div className="space-y-2 rounded-[14px] border border-[#e4e4e7] bg-white p-[17px]">
                  <p className="text-[12px] leading-4 text-[#3f3f46]">Password must include:</p>
                  <Requirement met={passwordRequirements.minLength} label="Minimum 8 characters" />
                  <Requirement met={passwordRequirements.hasNumber} label="At least 1 number" />
                  <Requirement met={passwordRequirements.hasSpecialChar} label="At least 1 special character" />
                </div>

                {errors.form ? <p className="text-[13px] leading-5 text-red-600">{errors.form}</p> : null}

                <button
                  type="submit"
                  disabled={submitting}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-[#050c13] px-4 text-[14px] font-normal leading-5 text-[#fafcfe] transition hover:bg-[#131b31] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save & continue'}
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

export default CreatePassword
