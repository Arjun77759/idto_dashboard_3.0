import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useUserProfile } from '@/hooks/useUserProfile'
import { clearAuth } from '@/lib/auth'
import { resetOnboardingStore } from '@/store/onboardingStore'
import { motion } from 'framer-motion'
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  CreditCard,
  FlaskConical,
  Home,
  Key,
  LogOut,
  MessageSquare,
  Receipt,
  Settings,
  User
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SwitchToProductionModal from './modals/switchToProductionModal/SwitchToProductionModal'
import EnvironmentStatus from '@/components/dashboard/EnvironmentStatus'

interface MenuItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  isActive?: boolean
  isExternal?: boolean
  isDisabled?: boolean
}

interface Category {
  name: string
  items: MenuItem[]
}

const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)
  const { data: userProfile, loading: profileLoading } = useUserProfile()
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const handleLogout = () => {
    clearAuth()
    resetOnboardingStore()
    navigate('/login')
  }

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
        { name: 'Transactions', href: '/transactions', icon: Receipt, isActive: location.pathname === '/transactions' }
      ]
    },
    {
      name: 'Account & Billing',
      items: [
        { name: 'Billing', href: '/billing', icon: CreditCard, isActive: location.pathname === '/billing' }
      ]
    },
    {
      name: 'Developer Tools',
      items: [
        { name: 'API Testing', href: '/api-testing', icon: FlaskConical, isActive: location.pathname === '/api-testing' },
        { name: 'API Credentials', href: '/api-credentials', icon: Key, isActive: location.pathname === '/api-credentials' },
        { name: 'API Documentation', href: 'https://idtoai.readme.io/reference/idtoai-verification-apis', icon: BookOpen, isActive: false, isExternal: true }
      ]
    },
    {
      name: 'Administration',
      items: [
        { name: 'Settings', href: '/settings', icon: Settings, isActive: location.pathname === '/settings', isDisabled: true },
        { name: 'Feedback', href: '/feedback', icon: MessageSquare, isActive: location.pathname === '/feedback', isDisabled: true }
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
      <EnvironmentStatus variant="header" />

      {/* Navigation List */}
      <div className="flex flex-col gap-2 grow items-start min-h-0 min-w-0 relative w-full overflow-y-auto">
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

              if (item.isDisabled) {
                return (
                  <div
                    key={itemIndex}
                    className="flex gap-2 items-center px-3 py-1.5 mt-2 relative rounded w-full opacity-50 cursor-not-allowed"
                  >
                    <div className="overflow-hidden relative shrink-0 size-4">
                      <IconComponent className="w-4 h-4 text-[#9296a0]" />
                    </div>
                    <p className="font-medium leading-[1.4] relative text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre text-[#9296a0]">
                      {item.name}
                    </p>
                  </div>
                )
              }

              if (item.isExternal) {
                return (
                  <a
                    key={itemIndex}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
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
                  </a>
                )
              }

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
      {!isProduction && (
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
      )}

      {/* User Profile */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex gap-2.5 items-center justify-between px-2 py-1 relative w-full hover:bg-gray-50 rounded transition-colors cursor-pointer">
            <div className="flex gap-2.5 items-center">
              <div className="overflow-hidden relative shrink-0 size-[30px] bg-[#f0f0f0] rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-[#616675]" />
              </div>
              <div className="flex flex-col gap-0.5 items-start justify-center leading-[1.4] relative">
                {profileLoading ? (
                  <>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-2 w-24 bg-gray-200 rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <p className="font-medium relative text-[12px] text-[#616675] tracking-[-0.12px]">
                      {userProfile?.name || 'User'}
                    </p>
                    <p className="font-normal relative text-[8px] text-[#9296a0] tracking-[-0.08px]">
                      {userProfile?.brand_name || userProfile?.registered_name || 'Company'}
                    </p>
                  </>
                )}
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-[#9296a0]" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-[240px]">
          <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

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
