import { Carousel, CarouselContent, CarouselItem, type CarouselApi } from '@/components/ui/carousel'
import { useEffect, useState, useMemo } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { getAccessToken } from '@/lib/auth'

// Image assets from Figma
const imgImage1 = "https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/public1.png"
const imgImage2 = "https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/public2.png"
const imgImage3 = "https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/public3.png"

const carouselImages = [
  {
    src: imgImage1,
    alt: "Dashboard Image 1"
  },
  {
    src: imgImage2,
    alt: "Dashboard Image 2"
  },
  {
    src: imgImage3,
    alt: "Dashboard Image 3"
  }
]

const PublicLayout = () => {
  // Memoize token check to prevent re-renders from causing flickering
  const token = useMemo(() => getAccessToken(), [])
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  // Redirect if authenticated - do this before rendering anything
  if (token) {
    return <Navigate to="/dashboard" replace />
  }

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // Auto-rotate carousel - fully automatic
  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      api.scrollNext()
    }, 4000) // Change slide every 4 seconds

    return () => clearInterval(interval)
  }, [api])

  return (
    <div className="min-h-screen w-screen bg-gray-50">

      {/* Main Content with Two Panel Layout */}
      <main className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Content */}
        <div className="flex-1 lg:max-w-2xl xl:max-w-none lg:min-h-screen flex flex-col">
          <Outlet />
        </div>

        {/* Right Panel - Carousel - Hidden on mobile, visible on lg+ */}
        <div className="hidden lg:flex flex-1 bg-[#101010] relative overflow-hidden h-screen">
          <Carousel
            setApi={setApi}
            className="w-full h-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="h-full">
              {carouselImages.map((image, index) => (
                <CarouselItem key={index} className="h-full">
                  <div className="relative w-full h-full">
                    <img
                      src={image.src}
                      alt={image.alt}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Carousel Indicators */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${index === current - 1 ? 'bg-white' : 'bg-white/50'
                  }`}
                onClick={() => api?.scrollTo(index)}
              />
            ))}
          </div>
        </div>
      </main>

    </div>
  )
}

export default PublicLayout
