import { motion } from 'framer-motion'
import { Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from '../lib/firebase'
import { firebaseAuth, resendVerificationEmail } from '../api/authApi'
import { setAuth } from '../lib/auth'
import { useToast } from '@/hooks/use-toast'
import { useNavigate, useLocation } from 'react-router-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import TermsOfServiceModal from '../components/modals/TermsOfServiceModal'

const CheckInboxPage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { toast } = useToast()
  const isMobile = useIsMobile()
  const [submitting, setSubmitting] = useState(false)
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)

  // Get email from location state
  const email = location.state?.email

  // Redirect to register if no email provided
  useEffect(() => {
    if (!email) {
      navigate('/register')
    }
  }, [email, navigate])

  // Don't render if no email
  if (!email) {
    return null
  }

  const handleResend = async () => {
    try {
      setSubmitting(true)
      
      const response = await resendVerificationEmail({ email })
      
      if (response.status === 'already_verified') {
        toast({
          title: "Email already verified",
          description: "This email is already verified. You can proceed to login.",
        })
      } else if (response.email_sent === false) {
        toast({
          title: "Email queued",
          description: "The email has been queued but may not have been sent. Please try again later.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Email sent",
          description: "Please check your inbox for the sign-in link.",
        })
      }
    } catch (err: any) {
      const message = err?.response?.data?.detail || err?.message || 'Failed to resend email'
      toast({
        title: "Failed to resend",
        description: message,
        variant: "destructive",
      })
    } finally {
      setSubmitting(false)
    }
  }

  const handleChange = () => {
    navigate('/register')
  }

  const handleGoogleSignup = async () => {
    try {
      setSubmitting(true)
      
      // Sign in with Firebase
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      const idToken = await user.getIdToken()
      
      // Send token to backend
      const res = await firebaseAuth({ id_token: idToken })
      
      // Store access token
      setAuth({ access_token: res.access_token, user_agent: 'google' })
      
      toast({
        title: "Signup successful",
        description: "Welcome! Redirecting to dashboard...",
      })
      
      navigate('/dashboard')
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const message = detail || err?.message || 'Failed to sign up with Google'
      
      toast({
        title: "Google sign-up failed",
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen w-full bg-white flex flex-col"
      >
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
          <div className="w-full max-w-full flex flex-col gap-6 items-center">
            {/* Title Section */}
            <div className="flex flex-col gap-2 items-center text-center w-full">
              <h1 className="text-[28px] font-[500] leading-[1.25] text-[#131b31]">Verify your email</h1>
              <p className="text-[14px] font-normal leading-[20px] text-[#616675]">
                A sign-in link has been sent to{' '}
                <button 
                  onClick={handleChange}
                  className="text-[#0019ff] font-medium hover:underline"
                >
                  {email} (change)
                </button>
              </p>
            </div>

            {/* Mail Icon */}
            <div className="flex items-center justify-center">
              <Mail className="size-[58px] text-[#131b31]" strokeWidth={1.5} />
            </div>

            {/* Instruction Text */}
            <p className="text-[16px] font-semibold leading-[24px] text-[#006042] text-center">
              Click the link in your email to continue.
            </p>

            {/* Help Section - Green Background */}
            <div className="bg-[#e6fcf5] flex flex-col gap-4 items-center px-4 py-3 rounded-lg w-full">
              <p className="text-[14px] font-medium leading-[20px] text-[#616675] text-center">
                Didn't receive the email?
              </p>
              <p className="text-[14px] font-normal leading-[20px] text-[#616675] text-center">
                Please check your spam folder or{' '}
                <button 
                  onClick={handleResend}
                  disabled={submitting}
                  className="text-[#0019ff] font-normal hover:underline disabled:cursor-not-allowed disabled:opacity-50"
                >
                  resend it.
                </button>
              </p>
            </div>

            {/* Divider and Google Section */}
            <div className="flex flex-col gap-4 items-center w-full">
              <div className="h-px w-full bg-[#e7e8ea]" />
              <div className="flex items-center justify-center">
                <div className="flex items-center gap-2 px-4 py-3 rounded-full border border-[#e7e8ea]">
                  <span className="text-[14px] font-medium leading-[20px] text-[#616675]">Or continue with</span>
                  <button
                    onClick={handleGoogleSignup}
                    disabled={submitting}
                    className="flex items-center gap-2 text-[14px] font-bold leading-[20px] text-[#616675] transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Please wait...' : 'Google'}
                    <span className="relative inline-flex size-4">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none">
                        <g clipPath="url(#clip0_362_2666)">
                          <path d="M15.6767 8.17422C15.6767 7.53015 15.6245 7.06015 15.5114 6.57275H8.15674V9.47975H12.4737C12.3867 10.2022 11.9167 11.2902 10.8723 12.0212L10.8576 12.1186L13.183 13.92L13.3441 13.9361C14.8237 12.5696 15.6767 10.559 15.6767 8.17422Z" fill="#4285F4" />
                          <path d="M8.15673 15.8334C10.2717 15.8334 12.0472 15.137 13.3441 13.936L10.8723 12.0211C10.2108 12.4824 9.323 12.8045 8.15673 12.8045C6.08527 12.8045 4.32713 11.438 3.7004 9.54932L3.60855 9.55712L1.19056 11.4284L1.15894 11.5163C2.44707 14.0752 5.093 15.8334 8.15673 15.8334Z" fill="#34A853" />
                          <path d="M3.7005 9.5495C3.53511 9.0621 3.43941 8.53983 3.43941 8.00023C3.43941 7.46057 3.53513 6.93837 3.6918 6.45097L3.68741 6.34717L1.23912 4.4458L1.15902 4.4839C0.62812 5.54577 0.323486 6.7382 0.323486 8.00023C0.323486 9.26227 0.62812 10.4546 1.15902 11.5165L3.7005 9.5495Z" fill="#FBBC05" />
                          <path d="M8.15673 3.19537C9.62763 3.19537 10.6198 3.83074 11.1856 4.3617L13.3963 2.20317C12.0386 0.941137 10.2717 0.166504 8.15673 0.166504C5.093 0.166504 2.44707 1.92464 1.15894 4.4835L3.6917 6.45057C4.32713 4.56187 6.08527 3.19537 8.15673 3.19537Z" fill="#EB4335" />
                        </g>
                        <defs>
                          <clipPath id="clip0_362_2666">
                            <rect width="16" height="16" fill="white" />
                          </clipPath>
                        </defs>
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              <div className="h-px w-full bg-[#e7e8ea]" />
            </div>

            {/* Terms of Service */}
            <p className="text-center text-[12px] font-normal leading-[16px] text-[#616675]">
              By signing-up, you agree to our{' '}
              <button
                type="button"
                onClick={() => setIsTermsModalOpen(true)}
                className="text-[#0019ff] font-normal underline hover:opacity-80"
              >
                Terms of Service.
              </button>
            </p>
          </div>
        </div>

        <TermsOfServiceModal
          isOpen={isTermsModalOpen}
          onClose={() => setIsTermsModalOpen(false)}
        />
      </motion.div>
    )
  }

  // Web layout (existing)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen w-full bg-white flex flex-col items-center gap-10 p-10"
    >
      {/* Logo */}
      <div className="flex items-center px-0 py-1.5 w-full">
        <div className="h-8 overflow-hidden relative w-[57px]">
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
      </div>

      {/* Card */}
      <div className="flex flex-col gap-6 items-center p-2 rounded w-full max-w-[397px]">
        {/* Title Section */}
        <div className="flex flex-col gap-2 items-center text-center pt-2 px-0 pb-0 w-full">
          <h1 className="font-medium leading-[1.24] text-[24px] text-[#131b31] tracking-[-0.24px] w-full">
            Verify your email
          </h1>
          <p className="font-medium leading-5 text-[14px] text-[#616675] tracking-[-0.14px] w-full">
            A sign-in link has been sent to{' '}
            <button 
              onClick={handleChange}
              className="text-[#0019ff] hover:underline"
            >
              {email} (change)
            </button>
          </p>
        </div>

        {/* Mail Icon */}
        <div className="overflow-hidden relative shrink-0 size-[58px]">
          <Mail className="size-[58px] text-[#131b31]" strokeWidth={1.5} />
        </div>

        {/* Instruction Text */}
        <p className="font-semibold leading-[1.5] text-[16px] text-[#616675] text-center tracking-[-0.16px] w-full">
          Click the link in your email to continue.
        </p>

        {/* Help Section - Green Background */}
        <div className="bg-[#e6fcf5] flex flex-col gap-4 items-center px-0 py-2 rounded-lg w-full">
          <p className="font-medium leading-5 text-[14px] text-[#616675] tracking-[-0.14px] text-center w-full">
            Didn't receive the email?
          </p>
          <p className="font-medium leading-5 text-[14px] text-[#616675] tracking-[-0.14px] text-center w-full">
            Please check your spam folder or{' '}
            <button 
              onClick={handleResend}
              disabled={submitting}
              className="text-[#0019ff] hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            >
              resend it.
            </button>
          </p>
        </div>

        {/* Divider and Google Section */}
        <div className="flex flex-col gap-4 items-center w-full">
          <div className="h-0 relative w-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px] border-b border-[#e7e8ea] border-solid"></div>
          </div>

          <div className="flex gap-2 items-center justify-center w-full">
            <p className="font-medium leading-5 text-[14px] text-[#616675] text-center tracking-[-0.14px] whitespace-pre">
              Or continue with
            </p>
            <button
              onClick={handleGoogleSignup}
              disabled={submitting}
              className="border border-[#e7e8ea] border-solid rounded-full shrink-0 flex gap-2 items-center justify-center px-[14px] py-3"
            >
              <p className="font-bold leading-4 text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                {submitting ? 'Please wait...' : 'Google'}
              </p>
              <div className="relative shrink-0 size-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <g clipPath="url(#clip0_362_2666)">
                    <path d="M15.6767 8.17422C15.6767 7.53015 15.6245 7.06015 15.5114 6.57275H8.15674V9.47975H12.4737C12.3867 10.2022 11.9167 11.2902 10.8723 12.0212L10.8576 12.1186L13.183 13.92L13.3441 13.9361C14.8237 12.5696 15.6767 10.559 15.6767 8.17422Z" fill="#4285F4" />
                    <path d="M8.15673 15.8334C10.2717 15.8334 12.0472 15.137 13.3441 13.936L10.8723 12.0211C10.2108 12.4824 9.323 12.8045 8.15673 12.8045C6.08527 12.8045 4.32713 11.438 3.7004 9.54932L3.60855 9.55712L1.19056 11.4284L1.15894 11.5163C2.44707 14.0752 5.093 15.8334 8.15673 15.8334Z" fill="#34A853" />
                    <path d="M3.7005 9.5495C3.53511 9.0621 3.43941 8.53983 3.43941 8.00023C3.43941 7.46057 3.53513 6.93837 3.6918 6.45097L3.68741 6.34717L1.23912 4.4458L1.15902 4.4839C0.62812 5.54577 0.323486 6.7382 0.323486 8.00023C0.323486 9.26227 0.62812 10.4546 1.15902 11.5165L3.7005 9.5495Z" fill="#FBBC05" />
                    <path d="M8.15673 3.19537C9.62763 3.19537 10.6198 3.83074 11.1856 4.3617L13.3963 2.20317C12.0386 0.941137 10.2717 0.166504 8.15673 0.166504C5.093 0.166504 2.44707 1.92464 1.15894 4.4835L3.6917 6.45057C4.32713 4.56187 6.08527 3.19537 8.15673 3.19537Z" fill="#EB4335" />
                  </g>
                  <defs>
                    <clipPath id="clip0_362_2666">
                      <rect width="16" height="16" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </div>
            </button>
          </div>

          <div className="h-0 relative w-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px] border-b border-[#e7e8ea] border-solid"></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default CheckInboxPage

