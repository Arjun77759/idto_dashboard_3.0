import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CreditCard,
  DollarSign,
  FlaskConical,
  Home,
  MessageSquare,
  Settings,
  User
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SwitchToProductionModal from './modals/switchToProductionModal/SwitchToProductionModal'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
}

interface Category {
  name: string
  items: MenuItem[]
}

const Sidebar = () => {
  const location = useLocation()
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)

  const categories: Category[] = [
    {
      name: 'Overview',
      items: [
        { name: 'Home', href: '/dashboard', icon: Home, isActive: location.pathname === '/dashboard' },
        { name: 'Analytics', href: '/analytics', icon: BarChart3, isActive: location.pathname === '/analytics' }
      ]
    },
    {
      name: 'Operations',
      items: [
        { name: 'Transactions', href: '/transactions', icon: CreditCard, isActive: location.pathname === '/transactions' }
      ]
    },
    {
      name: 'Account & Billing',
      items: [
        { name: 'Billing', href: '/billing', icon: DollarSign, isActive: location.pathname === '/billing' }
      ]
    },
    {
      name: 'Developer Tools',
      items: [
        { name: 'API Testing', href: '/api-testing', icon: FlaskConical, isActive: location.pathname === '/api-testing' },
        { name: 'API Documentation', href: '/api-docs', icon: BookOpen, isActive: location.pathname === '/api-docs' }
      ]
    },
    {
      name: 'Administration',
      items: [
        { name: 'Settings', href: '/settings', icon: Settings, isActive: location.pathname === '/settings' },
        { name: 'Feedback', href: '/feedback', icon: MessageSquare, isActive: location.pathname === '/feedback' }
      ]
    }
  ]

  const handleSwitchToProduction = () => {
    setIsSwitchModalOpen(true)
  }

  const handleConfirmSwitch = () => {
    console.log('Confirmed switch to production')
    // Add your production switch logic here
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
                <div className="absolute bottom-0 left-0 right-0 top-[-1px] border-t border-[#e7e8ea]"></div>
              </div>
            </div>

            {/* Menu Items */}
            {category.items.map((item, itemIndex) => {
              const IconComponent = item.icon

              return (
                <Link
                  key={itemIndex}
                  to={item.href}
                  className={`flex gap-2 items-center px-3 py-1.5 mt-2 relative rounded w-full ${item.isActive
                    ? 'bg-[#e6fcf5]'
                    : 'hover:bg-gray-50'
                    }`}
                >
                  <div className="overflow-hidden relative shrink-0 size-4">
                    <IconComponent className={`w-4 h-4 ${item.isActive ? 'text-[#0019ff]' : 'text-[#616675]'
                      }`} />
                  </div>
                  <p className={`font-medium leading-[1.4] relative text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre ${item.isActive ? 'text-[#0019ff]' : 'text-[#616675]'
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
            <ArrowRight className="w-4 h-4 text-[#b47d1f]" />
          </div>
        </button>
      </div>

      {/* User Profile */}
      <div className="flex flex-col gap-4 items-start relative w-full">
        <div className="flex gap-2.5 items-center px-2 py-1 relative w-full">
          <div className="overflow-hidden relative shrink-0 size-[30px] bg-[#f0f0f0] rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-[#616675]" />
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

      {/* Switch to Production Modal */}
      <SwitchToProductionModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        onConfirm={handleConfirmSwitch}
      />
    </motion.div>
  )
}

export default Sidebar
