import { motion } from 'framer-motion'
import { Building2, MoveRight } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RegisterPage = () => {
  const [email, setEmail] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Registration attempt:', email)
    navigate('/dashboard')
  }

  const handleGoogleSignup = () => {
    console.log('Google signup')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white flex flex-col gap-6 sm:gap-8 lg:gap-12 items-center p-4 sm:p-6 lg:p-10 relative w-full min-h-screen"
    >
      {/* Logo */}
      <div className="flex gap-2 items-center px-0 py-1.5 relative w-full max-w-sm sm:max-w-md">
        <div className="h-6 sm:h-8 overflow-hidden relative w-10 sm:w-14">
          <img alt="" className="block max-w-none size-full" src={'https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/dashboard_2.0/idto_logo_black.png'} />
        </div>
      </div>

      {/* Signup Card */}
      <div className="flex flex-col gap-6 sm:gap-8 items-center p-4 sm:p-5 relative rounded w-full max-w-sm sm:max-w-md lg:max-w-lg xl:w-[480px]">
        {/* Title Section */}
        <div className="flex flex-col gap-3 sm:gap-4 items-start relative w-full">
          <h1 className="font-bold leading-[1.24] relative text-[24px] sm:text-[28px] lg:text-[32px] text-[#131b31] tracking-[-0.24px] sm:tracking-[-0.28px] lg:tracking-[-0.32px] w-full">
            Sign up for Free
          </h1>
          <p className="font-normal leading-[1.4] relative text-[12px] sm:text-[13px] text-[#616675] tracking-[-0.12px] w-full">
            We recommend using your <span className="font-bold">work email</span> - It keeps work and life separate.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-4 items-center relative w-full">
          <div className="flex flex-col gap-4 sm:gap-6 items-start relative w-full">
            <div className="flex flex-col gap-1 items-start relative w-full">
              <label className="flex gap-2.5 items-center overflow-hidden relative w-full">
                <p className="font-medium leading-[1.4] relative text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Enter your work email
                </p>
              </label>
              <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-2 h-10 sm:h-12 items-center px-3 py-2 relative rounded-[6px] w-full">
                <div className="overflow-hidden relative shrink-0 size-4 sm:size-5">
                  <div className="absolute inset-[0.5%_8.33%]">
                    <Building2 className='size-4 sm:size-5 text-[#9296A0]' strokeWidth={2} color='#9296A0' />
                  </div>
                </div>
                <div className="flex gap-2 grow items-center justify-center min-h-px min-w-px relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@idto.ai"
                    className="font-medium grow leading-[1.5] min-h-px min-w-px relative text-[14px] sm:text-[16px] text-[#1c252e] tracking-[-0.14px] sm:tracking-[-0.16px] bg-transparent border-none outline-none w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="font-normal leading-[1.4] relative text-[12px] text-[#616675] tracking-[-0.12px] w-full">
            No password required. You'll receive a sign-in link
          </p>

          <button
            onClick={handleSubmit}
            className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid flex gap-2 items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 relative rounded-lg w-full h-10 sm:h-auto"
          >
            <p className="font-bold leading-4 relative text-[12px] sm:text-[13px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              Continue
            </p>
            <div className="overflow-hidden relative shrink-0 size-3 sm:size-4">
              <MoveRight className='size-3 sm:size-4 text-[#0019ff]' strokeWidth={2} color='#0019ff' />
            </div>
          </button>
        </div>

        {/* Social Login Section */}
        <div className="flex flex-col gap-4 items-center relative w-full">
          <div className="h-0 relative w-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px] border-b border-[#9296A0] border-solid">
            </div>
          </div>

          <button
            onClick={handleGoogleSignup}
            className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-2 items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 relative rounded-lg w-full h-10 sm:h-auto"
          >
            <p className="font-bold leading-4 relative text-[12px] sm:text-[13px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
              Signup with Google
            </p>
            <div className="relative shrink-0 size-3 sm:size-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                <g clip-path="url(#clip0_362_2666)">
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

        {/* Terms and Privacy */}
        <p className="font-normal leading-[1.4] relative text-[12px] text-[#616675] text-center tracking-[-0.12px]">
          By signing-up, you agree to our <span className="font-medium text-[#8a95ff]">Terms of Service</span> and <span className="font-medium text-[#8a95ff]">Privacy Policy.</span>
        </p>
      </div>
    </motion.div>
  )
}

export default RegisterPage
