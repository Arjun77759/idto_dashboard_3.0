import { motion } from 'framer-motion'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

// Image assets from Figma
const img = "http://localhost:3845/assets/85b3c3cf4c6a64694515d9f41bf6347dbb15a319.svg"
const img1 = "http://localhost:3845/assets/483e76221522f125fd6d5336d11e882a62efefe7.svg"
const imgLine2 = "http://localhost:3845/assets/422f368f7ca8e34db96f1dd0c236db12755ca5df.svg"
const imgHome = "http://localhost:3845/assets/0955134dc8ac0f7ad6335548e552460ec873275a.svg"
const imgAnalytics = "http://localhost:3845/assets/1d33b48f91e296cf30e9da8f7f09ff2efd47032b.svg"
const imgLine3 = "http://localhost:3845/assets/3571b47208129ee63fd6055ab8f8ada6c35994ff.svg"
const imgTransactions = "http://localhost:3845/assets/ba9ad5f1364a8089c30b822009136d6f5a41d94e.svg"
const imgLine4 = "http://localhost:3845/assets/d4357c96f7592189b32efaff1c87001053356066.svg"
const imgBilling = "http://localhost:3845/assets/e2680512fd114ddd6f66b3cd4cf41b16f58f5f01.svg"
const imgLine5 = "http://localhost:3845/assets/61296827141e452fc43999cde775c7610859c52c.svg"
const imgApiTesting = "http://localhost:3845/assets/5659910234fe5a0c475553625c31e165283aa670.svg"
const imgApiDocs = "http://localhost:3845/assets/6ec6f7475b3f22bd2b941c667df637b16311004c.svg"
const imgLine6 = "http://localhost:3845/assets/fb618001e5aff7faa6e0e7568f502b78180c65eb.svg"
const imgSettings = "http://localhost:3845/assets/bc4a3cd479320176fbf7113623670bdd4c707e4b.svg"
const imgFeedback = "http://localhost:3845/assets/cb936ff9f396f40246e365652575dfc40a031876.svg"
const img10 = "http://localhost:3845/assets/08c46cdf09a5068af0a7dfa8d865473e85e9602f.svg"
const img11 = "http://localhost:3845/assets/2f84ebcc379a88295a76f6d17601c5aec0d11d6f.svg"

interface MenuItem {
  name: string
  href: string
  icon: string
  isActive?: boolean
}

interface Category {
  name: string
  items: MenuItem[]
}

const Sidebar = () => {
  const location = useLocation()
  const [isEnvironmentOpen, setIsEnvironmentOpen] = useState(false)

  const categories: Category[] = [
    {
      name: 'Overview',
      items: [
        { name: 'Home', href: '/dashboard', icon: imgHome, isActive: location.pathname === '/dashboard' },
        { name: 'Analytics', href: '/analytics', icon: imgAnalytics, isActive: location.pathname === '/analytics' }
      ]
    },
    {
      name: 'Operations',
      items: [
        { name: 'Transactions', href: '/transactions', icon: imgTransactions, isActive: location.pathname === '/transactions' }
      ]
    },
    {
      name: 'Account & Billing',
      items: [
        { name: 'Billing', href: '/billing', icon: imgBilling, isActive: location.pathname === '/billing' }
      ]
    },
    {
      name: 'Developer Tools',
      items: [
        { name: 'API Testing', href: '/api-testing', icon: imgApiTesting, isActive: location.pathname === '/api-testing' },
        { name: 'API Documentation', href: '/api-docs', icon: imgApiDocs, isActive: location.pathname === '/api-docs' }
      ]
    },
    {
      name: 'Administration',
      items: [
        { name: 'Settings', href: '/settings', icon: imgSettings, isActive: location.pathname === '/settings' },
        { name: 'Feedback', href: '/feedback', icon: imgFeedback, isActive: location.pathname === '/feedback' }
      ]
    }
  ]

  const handleSwitchToProduction = () => {
    console.log('Switch to production')
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white flex flex-col gap-5 items-start px-4 py-6 relative w-full h-screen"
    >
      {/* Environment Header */}
      <div className="flex items-start justify-between px-0 py-1.5 relative w-full">
        <div className="flex gap-4 items-center relative">
          <div className="rounded w-[34px] h-[34px] shrink-0" 
               style={{ 
                 backgroundImage: "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 34 34\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(-1.0409e-16 -1.7 1.7 -1.0409e-16 17 17)\\'><foreignObject x=\\'-190\\' y=\\'-190\\' width=\\'380\\' height=\\'380\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgba(84, 238, 190, 1) 0%, rgba(63, 185, 206, 1) 25%, rgba(42, 132, 223, 1) 50%, rgba(32, 105, 231, 1) 62.5%, rgba(21, 78, 239, 1) 75%, rgba(11, 52, 247, 1) 87.5%, rgba(0, 25, 255, 1) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')" 
               }} />
          <div className="flex flex-col items-start relative">
            <p className="font-medium leading-[1.4] relative text-[12px] text-[#131b31] tracking-[-0.12px]">
              Sandbox
            </p>
            <p className="font-normal leading-[1.4] relative text-[12px] text-[#9296a0] tracking-[-0.12px]">
              Simulated Data
            </p>
          </div>
        </div>
        <div className="relative w-[11px] h-[11px]">
          <button
            onClick={() => setIsEnvironmentOpen(!isEnvironmentOpen)}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[11px] h-[11px]"
          >
            <div className="absolute inset-[26.71%_11.33%]">
              <img alt="" className="block max-w-none size-full" src={isEnvironmentOpen ? img1 : img} />
            </div>
          </button>
        </div>
      </div>

      {/* Navigation List */}
      <div className="flex flex-col gap-2 grow items-start min-h-0 min-w-0 relative w-full ">
        {categories.map((category, categoryIndex) => (
          <div key={categoryIndex} className="w-full ">
            {/* Category Header */}
            <div className="flex gap-1 items-center overflow-hidden pb-2 pt-4 px-0 relative w-[206px] ">
              <p className="font-normal leading-[1.4] relative text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                {category.name}
              </p>
              <div className="grow h-0 min-h-px min-w-0 relative ">
                <div className="absolute bottom-0 left-0 right-0 top-[-1px]">
                  <img alt="" className="block max-w-none size-full" src={
                    category.name === 'Overview' ? imgLine2 :
                    category.name === 'Operations' ? imgLine3 :
                    category.name === 'Account & Billing' ? imgLine4 :
                    category.name === 'Developer Tools' ? imgLine5 :
                    category.name === 'Administration' ? imgLine6 :
                    imgLine2
                  } />
                </div>
              </div>
            </div>

            {/* Menu Items */}
            {category.items.map((item, itemIndex) => {
              // Get specific icon insets based on the icon
              const getIconInsets = (iconName: string) => {
                switch (iconName) {
                  case imgHome:
                    return 'inset-[7.29%_5.21%]'
                  case imgAnalytics:
                    return 'inset-[5.208%]'
                  case imgTransactions:
                    return 'inset-[5.208%]'
                  case imgBilling:
                    return 'inset-[13.54%_5.21%]'
                  case imgApiTesting:
                    return 'inset-[5.21%_9.37%_5.21%_9.39%]'
                  case imgApiDocs:
                    return 'inset-[5.21%_7.29%]'
                  case imgSettings:
                    return 'inset-[9.38%_5.21%]'
                  case imgFeedback:
                    return 'inset-[8.33%_5.21%]'
                  default:
                    return 'inset-[5.208%]'
                }
              }

              return (
                <Link
                  key={itemIndex}
                  to={item.href}
                  className={`flex gap-2 items-center px-3 py-1.5 mt-2 relative rounded w-full ${
                    item.isActive 
                      ? 'bg-[#e6fcf5]' 
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="overflow-hidden relative shrink-0 size-4">
                    <div className={`absolute ${getIconInsets(item.icon)}`}>
                      <img alt="" className="block max-w-none size-full" src={item.icon} />
                    </div>
                  </div>
                  <p className={`font-medium leading-[1.4] relative text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre ${
                    item.isActive ? 'text-[#0019ff]' : 'text-[#616675]'
                  }`}>
                    {item.name}
                  </p>
                </Link>
              )
            })}
          </div>
        ))}
      </div>

      {/* Switch to Production Button */}
      <div className="bg-[#fff7ea] border border-[#b47d1f] border-solid relative rounded-lg shrink-0 w-full">
        <button
          onClick={handleSwitchToProduction}
          className="flex gap-2 items-center justify-center p-2 relative rounded-[inherit] w-full"
        >
          <p className="font-medium leading-[1.4] relative text-[12px] text-[#b47d1f] text-nowrap tracking-[-0.12px] whitespace-pre">
            Switch to Production
          </p>
          <div className="overflow-hidden relative shrink-0 size-4">
            <div className="absolute inset-[22.917%]">
              <img alt="" className="block max-w-none size-full" src={img10} />
            </div>
          </div>
        </button>
      </div>

      {/* User Profile */}
      <div className="flex flex-col gap-4 items-start relative w-full">
        <div className="flex gap-2.5 items-center px-2 py-1 relative w-full">
          <div className="overflow-hidden relative shrink-0 size-[30px]">
            <div className="absolute inset-[5.208%]">
              <img alt="" className="block max-w-none size-full" src={img11} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 items-start justify-center leading-[1.4] relative">
            <p className="font-medium relative text-[12px] text-[#616675] tracking-[-0.12px]">
              John Doe
            </p>
            <p className="font-normal relative text-[8px] text-[#9296a0] tracking-[-0.08px]">
              Brightwave Solutions
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar
