import { getAccessToken } from '@/lib/auth'
import { ChevronLeft, ChevronRight, Workflow } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'

// Dashboard card images - using placeholder URLs, replace with actual dashboard screenshots
const dashboardImages = [
  "/public1.png",
  "/public2.png",
  "/public3.png",
]

// Card positions and transforms from Figma design
// Positions are relative to their containers
// Blurred layer container: left-[-177px] top-[371px]
// Main layer container: left-[-177px] top-[345px]
const blurredCardConfigs = [
  { left: -177, top: 681.15, rotate: 335, skew: 18.882 },
  { left: 654.26, top: 766.11, rotate: 335, skew: 18.882 },
  { left: 488.11, top: 371.01, rotate: 335, skew: 18.882 },
  { left: 155.56, top: 526.08, rotate: 335, skew: 18.882 },
  { left: -15.85, top: 842.3, rotate: 335, skew: 18.882 },
  { left: 316.71, top: 687.23, rotate: 335, skew: 18.882 },
  { left: 649.28, top: 532.15, rotate: 335, skew: 18.882 },
  { left: 321.21, top: 921.42, rotate: 335, skew: 18.882 },
]

const mainCardConfigs = [
  { left: -177, top: 655.15, rotate: 335, skew: 18.882 },
  { left: 654.26, top: 740.12, rotate: 335, skew: 18.882 },
  { left: 488.11, top: 345.01, rotate: 335, skew: 18.882 },
  { left: 155.56, top: 500.08, rotate: 335, skew: 18.882 },
  { left: -15.85, top: 816.3, rotate: 335, skew: 18.882 },
  { left: 316.71, top: 661.23, rotate: 335, skew: 18.882 },
  { left: 649.28, top: 506.15, rotate: 335, skew: 18.882 },
  { left: 321.21, top: 895.42, rotate: 335, skew: 18.882 },
]

const PublicLayout = () => {
  // Memoize token check to prevent re-renders from causing flickering
  const token = useMemo(() => getAccessToken(), [])
  const location = useLocation()
  const [currentSlide, setCurrentSlide] = useState(0)

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
      <main className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Content */}
        <div className="flex-1 lg:max-w-2xl xl:max-w-none lg:min-h-screen flex flex-col">
          <Outlet />
        </div>

        {/* Right Panel - Gradient Design - Hidden on mobile, visible on lg+ */}
        <div
          className="hidden lg:flex flex-1 relative overflow-hidden h-screen"
          style={{
            background: `linear-gradient(161.64deg, rgba(138, 149, 255, 1) 49.29%, rgba(84, 238, 190, 1) 82.41%), linear-gradient(216deg, rgba(138, 149, 255, 1) 0.24%, rgba(0, 163, 112, 1) 94.14%)`
          }}
        >
          {/* Decorative Circles - Lowest z-index */}
          <div
            className="absolute left-[calc(50%+71px)] top-[241px] w-[344px] h-[344px] -translate-x-1/2 z-0"
            style={{
              background: 'radial-gradient(circle, rgba(0, 229, 158, 1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              opacity: 0.6
            }}
          />
          <div
            className="absolute left-[calc(50%-5.5px)] top-[187px] w-[285px] h-[285px] -translate-x-1/2 z-0"
            style={{
              background: 'radial-gradient(circle, rgba(0, 18, 181, 1) 0%, transparent 70%)',
              borderRadius: '50%',
              filter: 'blur(60px)',
              opacity: 0.6
            }}
          />

          {/* Blurred Dashboard Cards Layer (behind) - z-1 */}
          <div className="absolute left-[-177px] top-[371px] w-[1445.94px] h-[924.038px] overflow-hidden z-[1]">
            {blurredCardConfigs.map((config, index) => (
              <div
                key={`blur-${index}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${config.left}px`,
                  top: `${config.top}px`,
                  width: '458.512px',
                  height: '291.588px',
                }}
              >
                <div
                  className="flex-none"
                  style={{
                    transform: `rotate(${config.rotate}deg) skewX(${config.skew}deg)`,
                  }}
                >
                  <div
                    className="w-[345.107px] h-[206.106px] rounded-[6px] blur-[28px]"
                    style={{
                      backgroundImage: `url(${dashboardImages[index % dashboardImages.length]})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Cards Layer - z-2 */}
          <div className="absolute left-[-177px] top-[345px] w-[1445.94px] h-[924.038px] overflow-hidden z-[2]">
            {mainCardConfigs.map((config, index) => (
              <div
                key={`card-${index}`}
                className="absolute flex items-center justify-center"
                style={{
                  left: `${config.left}px`,
                  top: `${config.top}px`,
                  width: '458.512px',
                  height: '291.588px',
                }}
              >
                <div
                  className="flex-none"
                  style={{
                    transform: `rotate(${config.rotate}deg) skewX(${config.skew}deg)`,
                  }}
                >
                  <img
                    src={dashboardImages[index % dashboardImages.length]}
                    alt={`Dashboard ${index + 1}`}
                    className="w-[345.107px] h-[206.106px] object-cover rounded-[6px] pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Featured Large Card - z-2 */}
          <div
            className="absolute flex items-center justify-center left-[888px] top-[96px] w-[541.821px] h-[344.567px] z-[2]"
          >
            <div
              className="flex-none"
              style={{
                transform: `rotate(335deg) skewX(18.882deg)`,
              }}
            >
              <img
                src={dashboardImages[0]}
                alt="Featured Dashboard"
                className="w-[407.811px] h-[243.554px] object-cover pointer-events-none"
              />
            </div>
          </div>

          {/* Central Content Block - Highest z-index */}
          <div className="absolute left-1/2 top-[233px] -translate-x-1/2 flex flex-col gap-[32px] items-center z-[10]">
            <div className="flex gap-[16px] items-start justify-center w-[394px]">
              {/* Icon Button */}
              <div className="bg-white/25 border border-white/25 rounded-[60px] shrink-0 p-[16px]">
                <Workflow className="w-6 h-6 text-white" />
              </div>

              {/* Text Block */}
              <div className="bg-white/25 border border-white/25 rounded-[8px] flex flex-col gap-[10px] items-start p-[16px] flex-1 text-white">
                <h2 className="font-medium leading-[1.24] text-[24px] tracking-[-0.24px] w-full">
                  Ready-made workflows.
                </h2>
                <p className="font-medium leading-5 text-[14px] tracking-[-0.14px] w-full">
                  Build, automate, and analyze faster — so your team can focus on what matters most.
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

          {/* Navigation Arrows - Highest z-index */}
          <button
            onClick={handlePrev}
            className="absolute left-[52px] top-[261px] bg-[rgba(0,25,255,0.25)] rounded-[60px] p-[16px] z-[10] hover:bg-[rgba(0,25,255,0.35)] transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={handleNext}
            className="absolute left-[649px] top-[261px] bg-[rgba(0,25,255,0.25)] rounded-[60px] p-[16px] z-[10] hover:bg-[rgba(0,25,255,0.35)] transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      </main>

    </div>
  )
}

export default PublicLayout
