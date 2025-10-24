import { motion } from 'framer-motion'
import { useState } from 'react'

// Image assets from Figma
const imgGroup = "http://localhost:3845/assets/562a7c59aabc101ea749df73fab58615d54ff213.svg"
const imgGroup1 = "http://localhost:3845/assets/9c94f829cc934b720be198d2fecb30f308ca0851.svg"
const img = "http://localhost:3845/assets/3062d77ed309b143c337b658b4f3afff93579162.svg"
const img1 = "http://localhost:3845/assets/db47eb2e3e544fb6057c6357a4c374683013f841.svg"
const imgLine3 = "http://localhost:3845/assets/a3dbf166fda25d0d40076d20397c24ed4d221ae9.svg"
const imgGoogleIconStreamlineSvgLogos = "http://localhost:3845/assets/c681046178647741241105969e4263957e1fd2e8.svg"
const imgMicrosoftIconStreamlineSvgLogos = "http://localhost:3845/assets/2a1be36285e66dcfe55d3f54a8f7e71cd3cd02a6.svg"

const RegisterPage = () => {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Registration attempt:', email)
  }

  const handleGoogleSignup = () => {
    console.log('Google signup')
  }

  const handleMicrosoftSignup = () => {
    console.log('Microsoft signup')
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white flex flex-col gap-12 items-center p-10 relative w-full h-screen"
    >
      {/* Logo */}
      <div className="flex gap-2 items-center px-0 py-1.5 relative w-full">
        <div className="h-8 overflow-hidden relative w-14">
          <div className="absolute inset-[14.44%_69.17%_14.26%_7.78%]">
            <img alt="" className="block max-w-none size-full" src={imgGroup} />
          </div>
          <div className="absolute inset-[28.75%_7.98%_28.51%_38.52%]">
            <img alt="" className="block max-w-none size-full" src={imgGroup1} />
          </div>
        </div>
      </div>

      {/* Signup Card */}
      <div className="flex flex-col gap-8 items-center p-5 relative rounded w-[480px]">
        {/* Title Section */}
        <div className="flex flex-col gap-4 items-start relative w-full">
          <h1 className="font-bold leading-[1.24] relative text-[32px] text-[#131b31] tracking-[-0.32px] w-full">
            Sign up for Free
          </h1>
          <p className="font-normal leading-[1.4] relative text-[12px] text-[#616675] tracking-[-0.12px] w-full">
            We recommend using your <span className="font-bold">work email</span> - It keeps work and life separate.
          </p>
        </div>

        {/* Form Section */}
        <div className="flex flex-col gap-4 items-center relative w-full">
          <div className="flex flex-col gap-6 items-start relative w-full">
            <div className="flex flex-col gap-1 items-start relative w-full">
              <label className="flex gap-2.5 items-center overflow-hidden relative w-full">
                <p className="font-medium leading-[1.4] relative text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Enter your work email
                </p>
              </label>
              <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-2 h-12 items-center px-3 py-2 relative rounded-[6px] w-full">
                <div className="overflow-hidden relative shrink-0 size-5">
                  <div className="absolute inset-[12.5%_8.33%]">
                    <img alt="" className="block max-w-none size-full" src={img} />
                  </div>
                </div>
                <div className="flex gap-2 grow items-center justify-center min-h-px min-w-px relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="johndoe@idto.ai"
                    className="font-medium grow leading-[1.5] min-h-px min-w-px relative text-[16px] text-[#1c252e] tracking-[-0.16px] bg-transparent border-none outline-none w-full"
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
            className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-lg w-full"
          >
            <p className="font-bold leading-4 relative text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              Continue
            </p>
            <div className="overflow-hidden relative shrink-0 size-4">
              <div className="absolute inset-[29.17%_16.67%]">
                <div className="absolute bottom-[-7.96%] left-0 right-[-9.94%] top-[-7.95%]">
                  <img alt="" className="block max-w-none size-full" src={img1} />
                </div>
              </div>
            </div>
          </button>
        </div>

        {/* Social Login Section */}
        <div className="flex flex-col gap-4 items-center relative w-full">
          <div className="h-0 relative w-full">
            <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
              <img alt="" className="block max-w-none size-full" src={imgLine3} />
            </div>
          </div>
          
          <button
            onClick={handleGoogleSignup}
            className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-lg w-full"
          >
            <p className="font-bold leading-4 relative text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
              Signup with Google
            </p>
            <div className="relative shrink-0 size-4">
              <img alt="" className="block max-w-none size-full" src={imgGoogleIconStreamlineSvgLogos} />
            </div>
          </button>
          
          <div className="flex flex-col gap-4 items-center relative w-full">
            <button
              onClick={handleMicrosoftSignup}
              className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-2 items-center justify-center px-8 py-3.5 relative rounded-lg w-full"
            >
              <p className="font-bold leading-4 relative text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                Signup with Microsoft
              </p>
              <div className="relative shrink-0 size-4">
                <img alt="" className="block max-w-none size-full" src={imgMicrosoftIconStreamlineSvgLogos} />
              </div>
            </button>
          </div>
        </div>

        {/* Terms and Privacy */}
        <p className="font-normal leading-[1.4] relative text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
          By signing-up, you agree to our <span className="font-medium text-[#8a95ff]">Terms of Service</span> and <span className="font-medium text-[#8a95ff]">Privacy Policy.</span>
        </p>
      </div>
    </motion.div>
  )
}

export default RegisterPage
