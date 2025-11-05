import { motion } from 'framer-motion'
import { Lock, MoveRight, Eye, EyeOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useToast } from '../hooks/use-toast'
import { createPassword } from '../api/authApi'

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

  // Check if customer_id exists
  useEffect(() => {
    const customerId = searchParams.get('customer_id')
    
    if (!customerId) {
      toast({
        title: 'Invalid link',
        description: 'Missing customer ID. Redirecting to login...',
        variant: 'destructive'
      })
      navigate('/login')
    }
  }, [searchParams, navigate, toast])

  const validate = () => {
    const next: { password?: string; confirmPassword?: string } = {}
    
    if (!formData.password) {
      next.password = 'Password is required'
    } else if (formData.password.length < 8) {
      next.password = 'Password must be at least 8 characters'
    } else if (!/[A-Z]/.test(formData.password)) {
      next.password = 'Password must contain at least one uppercase letter'
    } else if (!/[a-z]/.test(formData.password)) {
      next.password = 'Password must contain at least one lowercase letter'
    } else if (!/[0-9]/.test(formData.password)) {
      next.password = 'Password must contain at least one number'
    } else if (!/[^A-Za-z0-9]/.test(formData.password)) {
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
    
    const customerId = searchParams.get('customer_id')
    
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
      await createPassword({
        customer_id: customerId,
        password: formData.password
      })
      
      toast({
        title: 'Password created successfully',
        description: 'Your password has been set. Redirecting to login...',
      })
      
      // Navigate to login after successful password creation
      setTimeout(() => {
        navigate('/login')
      }, 1500)
    } catch (err: any) {
      const detail = err?.response?.data?.detail
      const message = detail || err?.response?.data?.message || 'Failed to create password'
      setErrors((prev) => ({ ...prev, form: message }))
      
      toast({
        title: 'Failed to create password',
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

      {/* Create Password Card */}
      <div className="flex flex-col gap-6 sm:gap-8 items-center p-4 sm:p-5 relative rounded w-full max-w-sm sm:max-w-md lg:max-w-lg xl:w-[480px]">
        {/* Title Section */}
        <div className="flex flex-col gap-3 sm:gap-4 items-start relative w-full">
          <h1 className="font-bold leading-[1.24] relative text-[24px] sm:text-[28px] lg:text-[32px] text-[#131b31] tracking-[-0.24px] sm:tracking-[-0.28px] lg:tracking-[-0.32px] w-full">
            Create Password
          </h1>
          <p className="font-normal leading-[1.4] relative text-[12px] sm:text-[13px] text-[#616675] tracking-[-0.12px] w-full">
            Set a strong password to secure your account
          </p>
        </div>

        {/* Form Section */}
        <form className="flex flex-col gap-4 items-center relative w-full" onSubmit={handleSubmit} noValidate>
          <div className="flex flex-col gap-4 sm:gap-6 items-start relative w-full">
            {/* Password Field */}
            <div className="flex flex-col gap-1 items-start relative w-full">
              <label className="flex gap-2.5 items-center overflow-hidden relative w-full">
                <p className="font-medium leading-[1.4] relative text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Password
                </p>
              </label>
              <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-2 h-10 sm:h-12 items-center px-3 py-2 relative rounded-[6px] w-full">
                <div className="overflow-hidden relative shrink-0 size-4 sm:size-5">
                  <div className="absolute inset-[0.5%_8.33%]">
                    <Lock className='size-4 sm:size-5 text-[#9296A0]' strokeWidth={2} color='#9296A0' />
                  </div>
                </div>
                <div className="flex gap-2 grow items-center justify-center min-h-px min-w-px relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="font-medium grow leading-[1.5] min-h-px min-w-px relative text-[14px] sm:text-[16px] text-[#1c252e] tracking-[-0.14px] sm:tracking-[-0.16px] bg-transparent border-none outline-none w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="flex items-center justify-center shrink-0"
                >
                  {showPassword ? (
                    <EyeOff className='size-4 sm:size-5 text-[#9296A0]' strokeWidth={2} />
                  ) : (
                    <Eye className='size-4 sm:size-5 text-[#9296A0]' strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className="text-[12px] text-red-600">{errors.password}</p>
              ) : null}
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-1 items-start relative w-full">
              <label className="flex gap-2.5 items-center overflow-hidden relative w-full">
                <p className="font-medium leading-[1.4] relative text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                  Confirm Password
                </p>
              </label>
              <div className="bg-[#f7f7f8] border border-[#e7e8ea] border-solid flex gap-2 h-10 sm:h-12 items-center px-3 py-2 relative rounded-[6px] w-full">
                <div className="overflow-hidden relative shrink-0 size-4 sm:size-5">
                  <div className="absolute inset-[0.5%_8.33%]">
                    <Lock className='size-4 sm:size-5 text-[#9296A0]' strokeWidth={2} color='#9296A0' />
                  </div>
                </div>
                <div className="flex gap-2 grow items-center justify-center min-h-px min-w-px relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="font-medium grow leading-[1.5] min-h-px min-w-px relative text-[14px] sm:text-[16px] text-[#1c252e] tracking-[-0.14px] sm:tracking-[-0.16px] bg-transparent border-none outline-none w-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="flex items-center justify-center shrink-0"
                >
                  {showConfirmPassword ? (
                    <EyeOff className='size-4 sm:size-5 text-[#9296A0]' strokeWidth={2} />
                  ) : (
                    <Eye className='size-4 sm:size-5 text-[#9296A0]' strokeWidth={2} />
                  )}
                </button>
              </div>
              {errors.confirmPassword ? (
                <p className="text-[12px] text-red-600">{errors.confirmPassword}</p>
              ) : null}
            </div>
          </div>

          {/* Password Requirements */}
          <div className="w-full">
            <p className="text-[11px] text-[#616675] leading-[1.4]">Password must contain:</p>
            <ul className="text-[11px] text-[#616675] leading-[1.4] mt-1 space-y-0.5">
              <li>• At least 8 characters</li>
              <li>• One uppercase letter</li>
              <li>• One lowercase letter</li>
              <li>• One number</li>
              <li>• One special character</li>
            </ul>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="bg-[#e6e8ff] disabled:opacity-70 border border-[#e7e8ea] border-solid flex gap-2 items-center justify-center px-6 sm:px-8 py-3 sm:py-3.5 relative rounded-lg w-full h-10 sm:h-auto"
          >
            <p className="font-bold leading-4 relative text-[12px] sm:text-[13px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              {submitting ? 'Creating Password...' : 'Create Password'}
            </p>
            <div className="overflow-hidden relative shrink-0 size-3 sm:size-4">
              <MoveRight className='size-3 sm:size-4 text-[#0019ff]' strokeWidth={2} color='#0019ff' />
            </div>
          </button>
        </form>
      </div>
    </motion.div>
  )
}

export default CreatePassword
