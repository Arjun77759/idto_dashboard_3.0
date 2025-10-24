import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'

// Image assets from Figma
const imgImage1 = "http://localhost:3845/assets/4a79dd95d4568ea7a4fe39738f2bb9a3aa7d4500.png"
const imgImage2 = "http://localhost:3845/assets/5dd469830004b8c32aaadfcf5a8d880d8ee39512.png"
const imgImage3 = "http://localhost:3845/assets/9c30684ab42445139d48cf1f86013742d36fea9d.png"

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
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-screen bg-gray-50"
    >

      {/* Main Content with Two Panel Layout */}
      <main className="flex-1 flex flex-col lg:flex-row">
        {/* Left Panel - Content */}
        <div className="flex-1 max-w-2xl lg:max-w-none">
          <Outlet />
        </div>

        {/* Right Panel - Carousel */}
        <div className="flex-1 bg-[#101010] relative overflow-hidden min-h-[400px] lg:min-h-full max-h-screen">
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
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
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

    </motion.div>
  )
}

export default PublicLayout
