import { ArrowRight, Phone, Sparkles } from 'lucide-react'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import idtoLogo from '../assets/idto-logo.svg'
import { useToast } from '../hooks/use-toast'
import { auth } from '../lib/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import type { ConfirmationResult } from 'firebase/auth'

const CODE_LENGTH = 6

const ConfirmNumberPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [mobile, setMobile] = useState('9821047621')
  const [code, setCode] = useState(Array(CODE_LENGTH).fill(''))
  const [codeError, setCodeError] = useState('')
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null)
  const inputsRef = useRef<Array<HTMLInputElement | null>>([])
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null)

  const formattedMobile = mobile.replace(/(\d{5})(\d{5})/, '$1 $2')

  const handleMobileChange = (value: string) => {
    setMobile(value.replace(/\D/g, '').slice(0, 10))
  }

  const getRecaptchaVerifier = () => {
    if (!recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, 'mobile-otp-recaptcha', {
        size: 'invisible',
      })
    }

    return recaptchaVerifierRef.current
  }

  const handleSendCode = async () => {
    if (mobile.length !== 10) {
      setCodeError('Enter a valid 10-digit mobile number.')
      return
    }

    try {
      setSubmitting(true)
      setCodeError('')

      const result = await signInWithPhoneNumber(auth, `+91${mobile}`, getRecaptchaVerifier())

      setConfirmationResult(result)
      setSent(true)
      setCode(Array(CODE_LENGTH).fill(''))
      toast({
        title: 'Code sent',
        description: `We sent a 6-digit code to +91 ${formattedMobile}.`,
      })
      window.setTimeout(() => inputsRef.current[0]?.focus(), 50)
    } catch (err: any) {
      const message = err?.message || 'Failed to send verification code.'
      setCodeError(message)
      toast({
        title: 'Failed to send code',
        description: message,
        variant: 'destructive',
      })
      recaptchaVerifierRef.current?.clear()
      recaptchaVerifierRef.current = null
    } finally {
      setSubmitting(false)
    }
  }

  const handleCodeChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const next = [...code]
    next[index] = digit
    setCode(next)
    setCodeError('')

    if (digit && index < CODE_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus()
    }
  }

  const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputsRef.current[index - 1]?.focus()
    }
  }

  const handleCodePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, CODE_LENGTH).split('')
    if (!digits.length) return

    const next = Array(CODE_LENGTH).fill('')
    digits.forEach((digit, index) => {
      next[index] = digit
    })
    setCode(next)
    setCodeError('')
    inputsRef.current[Math.min(digits.length, CODE_LENGTH) - 1]?.focus()
  }

  const handleConfirmCode = async () => {
    const enteredCode = code.join('')

    if (enteredCode.length !== CODE_LENGTH) {
      setCodeError('Enter the 6-digit code to continue.')
      return
    }

    if (!confirmationResult) {
      setCodeError('Please send the code first.')
      return
    }

    try {
      setSubmitting(true)
      setCodeError('')

      await confirmationResult.confirm(enteredCode)

      toast({
        title: 'Number confirmed',
        description: 'Continuing to your profile setup.',
      })

      navigate('/workspace-profile')
    } catch (err: any) {
      const message = err?.message || 'Invalid or expired verification code.'
      setCodeError(message)
      toast({
        title: 'Verification failed',
        description: message,
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const resetNumber = () => {
    setSent(false)
    setConfirmationResult(null)
    setCode(Array(CODE_LENGTH).fill(''))
    setCodeError('')
  }

  return (
    <div className="min-h-screen w-full bg-white p-4 text-[#050c13] sm:p-6 lg:p-[25px]">
      <div className="grid min-h-[calc(100vh-32px)] grid-cols-1 gap-10 lg:min-h-[calc(100vh-50px)] lg:grid-cols-[minmax(420px,669px)_minmax(430px,1fr)] lg:gap-[72px] xl:gap-[108px]">
        <section className="relative hidden min-h-[640px] overflow-hidden rounded-[18px] bg-[#050c13] lg:block">
          <img
            src="/confirm-number-hero.png"
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
              <Phone className="size-[14px]" strokeWidth={1.7} />
              Quick security check
            </div>

            <div className="flex flex-col items-center">
              <img src={idtoLogo} alt="idto" className="mb-[30px] h-10 w-[70px]" />

              <div className="mb-5 w-full text-center">
                <h1 className="font-serif text-[30px] font-normal leading-9 text-[#050c13]">Confirm your number.</h1>
                <p className="mx-auto mt-6 max-w-[518px] text-[14px] font-normal leading-5 text-[#62748e]">
                  We'll send a 6-digit code to verify it's you.
                </p>
              </div>

              <div className="w-full space-y-5">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label htmlFor="mobile-number" className="block text-[14px] font-medium leading-5 text-[#050c13]">
                      Mobile number
                    </label>
                    <div className="flex overflow-hidden rounded-[14px] border border-[#e4e4e7] bg-white">
                      <div className="flex items-center gap-2 border-r border-[#e4e4e7] bg-[#fafafa] px-3 text-[14px] leading-5 text-[#0a0e1f]">
                        <span aria-hidden="true">IN</span>
                        <span>+91</span>
                      </div>
                      <input
                        id="mobile-number"
                        value={formattedMobile}
                        onChange={(e) => handleMobileChange(e.target.value)}
                        inputMode="numeric"
                        className="min-w-0 flex-1 p-3 text-[14px] leading-5 text-[#0a0e1f] outline-none"
                        aria-label="Mobile number"
                      />
                    </div>
                  </div>

                    <button
                    type="button"
                    onClick={handleSendCode}
                    disabled={submitting}
                    className="flex h-11 w-full items-center justify-center gap-2 rounded-[20px] bg-[#050c13] px-4 text-[14px] font-normal leading-5 text-[#fafcfe] transition hover:bg-[#131b31] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting && !sent ? 'Sending...' : sent ? 'Send code again' : 'Send me the code'}
                    <ArrowRight className="size-4" strokeWidth={1.8} />
                  </button>
                </div>

                <div className="space-y-2.5">
                  <p className="text-center text-[14px] font-medium leading-5 text-[#050c13]">
                    Enter the code we just sent
                  </p>
                  <div className="grid grid-cols-6 gap-2 sm:gap-3">
                    {code.map((digit, index) => (
                      <input
                        key={index}
                        ref={(node) => {
                          inputsRef.current[index] = node
                        }}
                        value={digit}
                        onChange={(e) => handleCodeChange(index, e.target.value)}
                        onKeyDown={(e) => handleCodeKeyDown(index, e)}
                        onPaste={handleCodePaste}
                        inputMode="numeric"
                        autoComplete={index === 0 ? 'one-time-code' : 'off'}
                        aria-label={`Mobile verification code digit ${index + 1}`}
                        className="aspect-square w-full rounded-[14.583px] border border-[#e2e8f0] bg-[#f9fafb] text-center text-[28px] leading-none text-[#050c13] outline-none transition focus:border-[#050c13] focus:bg-white focus:ring-2 focus:ring-[#050c13]/10"
                        maxLength={1}
                      />
                    ))}
                  </div>
                  {codeError ? <p className="text-center text-[12px] leading-4 text-red-600">{codeError}</p> : null}
                </div>
              </div>

              <p className="mt-5 w-full text-center text-[12px] leading-4 text-[#62748e]">
                Didn't get it?{' '}
                <button
                  type="button"
                  onClick={handleSendCode}
                  disabled={submitting}
                  className="text-[#8a95ff] transition hover:text-[#0019ff]"
                >
                  Resend the code
                </button>
              </p>

              <button
                type="button"
                onClick={sent ? handleConfirmCode : resetNumber}
                disabled={submitting}
                className="mt-[22px] text-center text-[12px] leading-5 text-[#62748e] transition hover:text-[#050c13] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {sent ? submitting ? 'Confirming...' : 'Confirm code' : 'Use a different number'}
              </button>
              <div id="mobile-otp-recaptcha" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfirmNumberPage
