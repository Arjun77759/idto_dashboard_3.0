import { Mail, MoveRight, ArrowUpRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { requestPasswordReset } from '../api/authApi'
import { useToast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'

const ForgetPasswordPage = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<{ email?: string; form?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  const validate = () => {
    const next: { email?: string } = {}
    if (!email) {
      next.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = 'Enter a valid email'
    }
    setErrors(next)
    return Object.keys(next).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    if (!validate()) return

    try {
      setSubmitting(true)
      const res = await requestPasswordReset({ email })

      if (res.email_sent === false) {
        toast({
          title: "Email queued",
          description: "The reset link has been queued but may not have been sent. Please try again later.",
          variant: "destructive",
        })
      } else {
        // Navigate to check inbox page
        navigate('/reset-password-check-inbox', { state: { email } })
      }
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const message = detail || err?.response?.data?.message || 'Failed to send reset link'
      setErrors((prev) => ({ ...prev, form: message }))
      toast({
        title: "Failed to send reset link",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  // Mobile-specific layout matching Figma design
  if (isMobile) {
    return (
      <div className="min-h-screen w-full bg-white flex flex-col">
        {/* Logo at top left */}
        <div className="px-4 pt-6 pb-8">
          <svg xmlns="http://www.w3.org/2000/svg" width="57" height="32" viewBox="0 0 57 32" fill="none">
            <path d="M17.5745 20.5918H11.0039V27.4367H17.5745V20.5918Z" fill="#00E59E" />
            <path d="M17.5748 16.0283V9.1834H11.0042V4.62012H4.43359V20.5916H11.0042V16.0283H17.5748Z" fill="#0019FF" />
            <path d="M23.3594 9.37695C22.97 9.37695 22.6384 9.51956 22.3647 9.80159C22.0909 10.0868 21.957 10.429 21.957 10.8378C21.957 11.2466 22.0939 11.5889 22.3647 11.8741C22.6354 12.1561 22.967 12.2987 23.3594 12.2987C23.7518 12.2987 24.0803 12.1561 24.3541 11.8741C24.6248 11.592 24.7617 11.2466 24.7617 10.8378C24.7617 10.429 24.6248 10.0868 24.3541 9.80159C24.0803 9.51956 23.7518 9.37695 23.3594 9.37695Z" fill="#131B31" />
            <path d="M24.6403 13.2432H22.082V22.8736H24.6403V13.2432Z" fill="#131B31" />
            <path d="M35.1131 9.19922H32.5548V14.3678H32.494C32.2263 13.8861 31.8491 13.5153 31.3624 13.2523C30.8757 12.9893 30.2916 12.8593 29.6133 12.8593C28.7311 12.8593 27.9737 13.0653 27.3409 13.4773C26.7082 13.8893 26.2306 14.4723 25.899 15.2265C25.5705 15.9808 25.4062 16.8617 25.4062 17.8663C25.4062 18.8708 25.5766 19.736 25.9143 20.4902C26.2519 21.2444 26.7538 21.8306 27.417 22.2489C28.0801 22.6672 28.8832 22.8764 29.8292 22.8764C30.608 22.8764 31.2742 22.7211 31.8248 22.4105C32.3753 22.1 32.8134 21.6658 33.1419 21.1113H33.7899V22.6831H36.3785V20.0497H35.1161V9.19922H35.1131ZM32.5579 18.3004C32.5579 19.0071 32.3541 19.5617 31.9495 19.961C31.5449 20.3634 30.9973 20.5631 30.3099 20.5631C29.5281 20.5631 28.944 20.3222 28.5547 19.8405C28.1653 19.3589 27.9706 18.6997 27.9706 17.8663C27.9706 17.0328 28.1653 16.3737 28.5547 15.892C28.944 15.4103 29.5311 15.1695 30.3099 15.1695C30.9973 15.1695 31.5449 15.3692 31.9495 15.7716C32.3541 16.1741 32.5579 16.7255 32.5579 17.4321V18.3004Z" fill="#131B31" />
            <path d="M40.1978 15.3307H42.3089V13.2455H40.1674V10.3555H37.673V13.2455H36.0547V15.3307H37.6426V20.7559C37.6426 21.4721 37.8251 22.0045 38.1901 22.3531C38.5552 22.7017 39.0662 22.876 39.7233 22.876H42.5279V20.7908H40.2009V15.3339L40.1978 15.3307Z" fill="#131B31" />
            <path d="M51.8479 15.2012C51.4463 14.4534 50.8775 13.8734 50.1383 13.4678C49.3991 13.0622 48.5261 12.8594 47.5192 12.8594C46.5123 12.8594 45.618 13.0622 44.8696 13.4678C44.1183 13.8734 43.5434 14.4534 43.1357 15.2012C42.7312 15.9491 42.5273 16.8332 42.5273 17.8505C42.5273 18.8677 42.7342 19.7645 43.1449 20.5155C43.5555 21.2666 44.1335 21.8465 44.8788 22.2553C45.624 22.6673 46.5001 22.8732 47.504 22.8732C48.5078 22.8732 49.3869 22.6704 50.1292 22.2648C50.8744 21.8592 51.4463 21.2793 51.8479 20.525C52.2494 19.7708 52.4502 18.8867 52.4502 17.8695C52.4502 16.8522 52.2494 15.9554 51.8479 15.2044V15.2012ZM49.2744 19.8311C48.8637 20.3191 48.2736 20.5599 47.504 20.5599C46.7344 20.5599 46.126 20.3159 45.7092 19.8311C45.2925 19.343 45.0856 18.6839 45.0856 17.8505C45.0856 17.017 45.2925 16.3611 45.7092 15.8857C46.126 15.4104 46.7222 15.1727 47.504 15.1727C48.2857 15.1727 48.8637 15.4104 49.2744 15.8857C49.685 16.3611 49.8919 17.017 49.8919 17.8505C49.8919 18.6839 49.685 19.3462 49.2744 19.8311Z" fill="#131B31" />
          </svg>
        </div>

        {/* Main content - centered vertically */}
        <div className="flex-1 flex justify-center px-4 pb-8">
          <div className="w-full max-w-full flex flex-col gap-6">
            {/* Header */}
            <div className="text-center flex flex-col gap-2">
              <h1 className="text-[24px] font-[500] leading-[1.25] text-[#131b31]">Need to reset your password?</h1>
              <p className="text-[14px] font-medium leading-[20px] text-[#616675]">Enter your email to get a reset link.</p>
            </div>

            {/* Form */}
            <form className="flex flex-col gap-6" onSubmit={handleSubmit} noValidate>
              {/* Email field */}
              <div className="flex flex-col gap-1">
                <label className="text-[12px] font-medium leading-[16.8px] text-[#616675]">Enter your work email</label>
                <div className="flex h-12 items-center gap-3 rounded-lg border border-[#e7e8ea] bg-[#f7f7f8] px-3">
                  <Mail className="size-5 text-[#9296a0]" strokeWidth={1.5} />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@idto.ai"
                    className="flex-1 border-none bg-transparent text-[16px] font-medium leading-[24px] text-[#1c252e] outline-none placeholder:text-[#9296a0]"
                  />
                </div>
                {errors.email && <p className="text-[12px] text-red-600">{errors.email}</p>}
              </div>

              {/* Info text */}
              <p className="text-[12px] font-medium leading-[16.8px] text-[#616675]">Make sure to use the email linked to your account.</p>

              {errors.form && <p className="text-[13px] text-red-600">{errors.form}</p>}

              {/* Send reset link button */}
              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e7e8ea] bg-[#E6E8FF] text-[12px] font-bold leading-[16px] text-[#0019FF] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Sending...' : 'Send reset link'}
                <MoveRight className="size-4" strokeWidth={2} />
              </button>
            </form>

            {/* Register link */}
            <div className="flex items-center justify-center gap-2 text-[14px] font-medium leading-[20px] text-[#616675]">
              <span>Don't have an account?</span>
              <Link to="/register" className="flex items-center gap-1 text-[#006042] underline">
                Create new account
                <ArrowUpRight className="size-4" strokeWidth={2} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Web layout (existing)
  return (
    <div className="min-h-screen w-full bg-white px-4 py-8 sm:py-12 flex flex-col gap-[40px]">
      <div className="flex items-center px-10">
        <svg xmlns="http://www.w3.org/2000/svg" width="57" height="32" viewBox="0 0 57 32" fill="none">
          <path d="M17.5745 20.5918H11.0039V27.4367H17.5745V20.5918Z" fill="#00E59E" />
          <path d="M17.5748 16.0283V9.1834H11.0042V4.62012H4.43359V20.5916H11.0042V16.0283H17.5748Z" fill="#0019FF" />
          <path d="M23.3594 9.37695C22.97 9.37695 22.6384 9.51956 22.3647 9.80159C22.0909 10.0868 21.957 10.429 21.957 10.8378C21.957 11.2466 22.0939 11.5889 22.3647 11.8741C22.6354 12.1561 22.967 12.2987 23.3594 12.2987C23.7518 12.2987 24.0803 12.1561 24.3541 11.8741C24.6248 11.592 24.7617 11.2466 24.7617 10.8378C24.7617 10.429 24.6248 10.0868 24.3541 9.80159C24.0803 9.51956 23.7518 9.37695 23.3594 9.37695Z" fill="#131B31" />
          <path d="M24.6403 13.2432H22.082V22.8736H24.6403V13.2432Z" fill="#131B31" />
          <path d="M35.1131 9.19922H32.5548V14.3678H32.494C32.2263 13.8861 31.8491 13.5153 31.3624 13.2523C30.8757 12.9893 30.2916 12.8593 29.6133 12.8593C28.7311 12.8593 27.9737 13.0653 27.3409 13.4773C26.7082 13.8893 26.2306 14.4723 25.899 15.2265C25.5705 15.9808 25.4062 16.8617 25.4062 17.8663C25.4062 18.8708 25.5766 19.736 25.9143 20.4902C26.2519 21.2444 26.7538 21.8306 27.417 22.2489C28.0801 22.6672 28.8832 22.8764 29.8292 22.8764C30.608 22.8764 31.2742 22.7211 31.8248 22.4105C32.3753 22.1 32.8134 21.6658 33.1419 21.1113H33.7899V22.6831H36.3785V20.0497H35.1161V9.19922H35.1131ZM32.5579 18.3004C32.5579 19.0071 32.3541 19.5617 31.9495 19.961C31.5449 20.3634 30.9973 20.5631 30.3099 20.5631C29.5281 20.5631 28.944 20.3222 28.5547 19.8405C28.1653 19.3589 27.9706 18.6997 27.9706 17.8663C27.9706 17.0328 28.1653 16.3737 28.5547 15.892C28.944 15.4103 29.5311 15.1695 30.3099 15.1695C30.9973 15.1695 31.5449 15.3692 31.9495 15.7716C32.3541 16.1741 32.5579 16.7255 32.5579 17.4321V18.3004Z" fill="#131B31" />
          <path d="M40.1978 15.3307H42.3089V13.2455H40.1674V10.3555H37.673V13.2455H36.0547V15.3307H37.6426V20.7559C37.6426 21.4721 37.8251 22.0045 38.1901 22.3531C38.5552 22.7017 39.0662 22.876 39.7233 22.876H42.5279V20.7908H40.2009V15.3339L40.1978 15.3307Z" fill="#131B31" />
          <path d="M51.8479 15.2012C51.4463 14.4534 50.8775 13.8734 50.1383 13.4678C49.3991 13.0622 48.5261 12.8594 47.5192 12.8594C46.5123 12.8594 45.618 13.0622 44.8696 13.4678C44.1183 13.8734 43.5434 14.4534 43.1357 15.2012C42.7312 15.9491 42.5273 16.8332 42.5273 17.8505C42.5273 18.8677 42.7342 19.7645 43.1449 20.5155C43.5555 21.2666 44.1335 21.8465 44.8788 22.2553C45.624 22.6673 46.5001 22.8732 47.504 22.8732C48.5078 22.8732 49.3869 22.6704 50.1292 22.2648C50.8744 21.8592 51.4463 21.2793 51.8479 20.525C52.2494 19.7708 52.4502 18.8867 52.4502 17.8695C52.4502 16.8522 52.2494 15.9554 51.8479 15.2044V15.2012ZM49.2744 19.8311C48.8637 20.3191 48.2736 20.5599 47.504 20.5599C46.7344 20.5599 46.126 20.3159 45.7092 19.8311C45.2925 19.343 45.0856 18.6839 45.0856 17.8505C45.0856 17.017 45.2925 16.3611 45.7092 15.8857C46.126 15.4104 46.7222 15.1727 47.504 15.1727C48.2857 15.1727 48.8637 15.4104 49.2744 15.8857C49.685 16.3611 49.8919 17.017 49.8919 17.8505C49.8919 18.6839 49.685 19.3462 49.2744 19.8311Z" fill="#131B31" />
        </svg>
      </div>
      <div className="flex w-full max-w-[480px] flex-col gap-6 sm:gap-8 mx-auto">
        <div className="bg-white/90 p-5 sm:p-8 flex flex-col gap-6">
          <div className="text-center flex flex-col gap-2">
            <h1 className="text-[24px] font-[500] leading-[1.24] text-[#131b31]">Need to reset your password?</h1>
            <p className="text-[14px] font-medium leading-5 text-[#616675]">Enter your email to get a reset link.</p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="flex flex-col gap-6">
              <div className='flex flex-col gap-2'>
                <label className="text-[12px] font-medium text-[#616675]">Enter your work email</label>
                <div className="flex h-12 items-center gap-3 rounded-lg border border-[#e7e8ea] bg-[#f7f7f8] px-3">
                  <Mail className="size-5 text-[#9296a0]" strokeWidth={1.5} />
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eg. johndoe@idto.ai"
                    className="w-full border-none bg-transparent text-[16px] font-medium text-[#1c252e] outline-none placeholder:text-[#9296a0]"
                  />
                </div>
                {errors.email ? <p className="text-[12px] text-red-600">{errors.email}</p> : null}
              </div>
              <p className="text-[12px] font-medium text-[#616675]">Make sure to use the email linked to your account.</p>
            </div>

            {errors.form ? <p className="text-[13px] text-red-600">{errors.form}</p> : null}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-[#e7e8ea] bg-[#e6e8ff] text-[12px] font-bold text-[#0019ff] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send reset link'}
              <MoveRight className="size-4" strokeWidth={2} />
            </button>
          </form>

          <div className="flex items-center justify-center gap-2 text-[14px] font-medium text-[#616675]">
            <span>Don't have an account?</span>
            <Link to="/register" className="flex items-center gap-1 text-[#006042] underline">
              Create new account
              <ArrowUpRight className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgetPasswordPage
