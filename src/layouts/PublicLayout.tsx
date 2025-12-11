import { getAccessToken } from '@/lib/auth'
import { ChevronLeft, ChevronRight, Workflow } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'



// Central content variants for the carousel
const centralVariants = [
  {
    icon: <Workflow className="w-6 h-6 text-white" />,
    title: 'Ready-made workflows.',
    description: 'Build, automate, and analyze faster — so your team can focus on what matters most.'
  },
  {
    icon: <Workflow className="w-6 h-6 text-white" />,
    title: 'Seamless Integrations.',
    description: 'Connect with your favorite tools to build powerful, automated processes in minutes.'
  },
  {
    icon: <Workflow className="w-6 h-6 text-white" />,
    title: 'Insights & Analytics.',
    description: 'Visualize, track, and optimize your workflows using built-in analytics.'
  }
]

const PublicLayout = () => {
  // Memoize token check to prevent re-renders from causing flickering
  const token = useMemo(() => getAccessToken(), [])
  const location = useLocation()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [currentSignupImage, setCurrentSignupImage] = useState(0)
  //@ts-ignore
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  //@ts-ignore
  const signupIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const isRegisterPage = location.pathname === '/register'

  // Signup images array
  const signupImages = [
    '/signup1.png',
    '/signup2.png',
    '/signup3.png',
    '/signup4.png',
    '/signup5.png'
  ]

  // Automatically rotate slide every 2s (2000ms) - only for non-register pages
  useEffect(() => {
    if (!isRegisterPage) {
      intervalRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev === 2 ? 0 : prev + 1))
      }, 2000)
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }
  }, [isRegisterPage])

  // Automatically rotate signup images every 2s (2000ms) - only for register page
  useEffect(() => {
    if (isRegisterPage) {
      signupIntervalRef.current = setInterval(() => {
        setCurrentSignupImage(prev => (prev === 4 ? 0 : prev + 1))
      }, 2000)
      return () => {
        if (signupIntervalRef.current) {
          clearInterval(signupIntervalRef.current)
        }
      }
    }
  }, [isRegisterPage])

  // Don't redirect if we're on the KYC callback page - it needs to process the callback even if authenticated
  const isKYCCallback = location.pathname.includes('/kyc-callback')

  // Redirect if authenticated - but skip redirect for KYC callback page
  if (token && !isKYCCallback) {
    return <Navigate to="/dashboard" replace />
  }

  // For KYC callback, use a simpler layout without right panel
  if (isKYCCallback) {
    return (
      <div className="min-h-screen w-screen bg-gray-50">
        <Outlet />
      </div>
    )
  }

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? 2 : prev - 1))
  }

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === 2 ? 0 : prev + 1))
  }

  return (
    <div className="min-h-screen w-screen bg-gray-50" style={{ fontFamily: '"TikTok Sans", sans-serif' }}>

      {/* Main Content with Two Panel Layout */}
      <main className="flex flex-col lg:flex-row h-screen">
        {/* Left Panel - Content */}
        <div className="flex-1 lg:max-w-2xl xl:max-w-none lg:min-h-screen flex flex-col overflow-y-auto bg-white">
          <Outlet />
        </div>

        {/* Right Panel - Gradient Design - Hidden on mobile, visible on lg+ */}
        <div
          className="flex-1 relative overflow-hidden h-screen items-center justify-center hidden md:flex"
          style={{
            background: isRegisterPage 
              ? 'transparent'
              : `linear-gradient(164deg, var(--Primary-1, #8A95FF) 49.29%, var(--Secondary-1, #3AC828) 82.41%), radial-gradient(50% 50% at 50% 50%, var(--Secondary-1, #3AC828) 0%, var(--Primary-1, #8A95FF) 100%), linear-gradient(212deg, var(--Primary-1, #8A95FF) -0.24%, var(--Secondary-3, #00A370) 94.14%)`
          }}
        >
          {isRegisterPage ? (
            // Signup images carousel for register page
            <div className="relative w-full h-full">
              {signupImages.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Signup step ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                    index === currentSignupImage ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
          ) : (
            // Original carousel content for other pages
            <>
              <div className='flex gap-4 items-center justify-between w-full px-[52px] relative top-[-200px]'>


                <div
                  className="absolute left-[calc(50%+71px)] z-0 translate-y-[30%] translate-x-[-50%]"
                  style={{
                    width: '344px',
                    height: '344px',
                    borderRadius: '344px',
                    background: 'var(--Secondary-2, #00E59E)',
                    filter: 'blur(78.5px)',
                  }}
                />
                <div
                  className="absolute left-[calc(50%-5.5px)] z-1 translate-x-[-50%]"
                  style={{
                    background: 'var(--Primary-3, #0012B5)',
                    borderRadius: '285px',
                    filter: 'blur(82px)',
                    width: '285px',
                    height: '285px',
                  }}
                />

                <button
                  onClick={handlePrev}
                  className=" bg-[rgba(0,25,255,0.25)] rounded-[60px] p-[16px] z-[10] hover:bg-[rgba(0,25,255,0.35)] transition-colors relative top-[-18px]"
                >
                  <ChevronLeft className="w-6 h-6 text-white" />
                </button>


                <div className="flex flex-col gap-[32px] items-center z-[10]">
                  <div className="flex gap-[16px] items-start justify-center w-[394px]">
                    {/* Icon Button */}
                    <div className="bg-white/25 border border-white/25 rounded-[60px] shrink-0 p-[16px]">
                      {centralVariants[currentSlide].icon}
                    </div>
                    {/* Text Block */}
                    <div className="bg-white/25 border border-white/25 rounded-[8px] flex flex-col gap-[10px] items-start p-[16px] flex-1 text-white">
                      <h2 className="font-medium leading-[1.24] text-[24px] tracking-[-0.24px] w-full">
                        {centralVariants[currentSlide].title}
                      </h2>
                      <p className="font-medium leading-5 text-[14px] tracking-[-0.14px] w-full">
                        {centralVariants[currentSlide].description}
                      </p>
                    </div>
                  </div>

                  {/* Pagination Dots */}
                  <div className="h-[10px] w-[38px] flex items-center justify-center">
                    <div className="flex gap-1.5 items-center">
                      {[0, 1, 2].map((index) => (
                        <button
                          key={index}
                          className={`h-2 rounded-full transition-all ${index === currentSlide
                            ? 'bg-white w-8'
                            : 'bg-white/50 w-2'
                            }`}
                          onClick={() => setCurrentSlide(index)}
                        />
                      ))}
                    </div>
                  </div>
                </div>


                <button
                  onClick={handleNext}
                  className="bg-[rgba(0,25,255,0.25)] rounded-[60px] p-[16px] z-[10] hover:bg-[rgba(0,25,255,0.35)] transition-colors relative top-[-18px]"
                >
                  <ChevronRight className="w-6 h-6 text-white" />
                </button>

              </div>

              <img
                src="/public_bg.png"
                alt="Dashboard"
                className="absolute left-0 bottom-0 w-full object-cover z-[10px]"
              />
              <img
                src="/public4.png"
                alt="Dashboard"
                className="absolute left-0 bottom-0 w-full object-cover z-[20px]"
              />
            </>
          )}
        </div>
      </main>

    </div>
  )
}

export default PublicLayout
