import EnvironmentStatus from '@/components/dashboard/EnvironmentStatus'
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
  Key,
  LogOut,
  MessageSquare,
  Receipt,
  Settings
} from 'lucide-react'
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import SwitchToProductionModal from './modals/switchToProductionModal/SwitchToProductionModal'

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
        {
          name: 'Home',
          href: '/dashboard',
          icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="14" viewBox="0 0 15 14" fill="none">
              <path d="M6.74512 0.149414C6.99146 -0.0496 7.34159 -0.0496887 7.58789 0.149414L14.333 5.60254L13.4902 6.66699L12.9932 6.26465V13.667H1.32617V6.27539L0.842773 6.66699L0 5.60254L6.74512 0.149414ZM6.49316 9.50098V10.834H7.83203V9.50098H6.49316Z" fill="currentColor" />
            </svg>
          ),
          isActive: location.pathname === '/dashboard'
        },
        {
          name: 'Analytics',
          href: '/analytics',
          icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none" {...props}>
              <path d="M2.46785 1.7599C3.72783 0.663704 5.37404 0 7.17526 0C10.9698 0 14.0763 2.94543 14.3333 6.67466H9.79827C9.56395 5.43942 8.47868 4.5054 7.17526 4.5054C6.61891 4.5054 6.1023 4.67557 5.67465 4.9667L2.46785 1.7599Z" fill="currentColor"/>
              <path d="M1.7599 2.46785C0.663704 3.72783 0 5.37404 0 7.17526C0 10.9698 2.94543 14.0763 6.67466 14.3333V9.79827C5.43942 9.56395 4.5054 8.47868 4.5054 7.17526C4.5054 6.61891 4.67557 6.1023 4.9667 5.67465L1.7599 2.46785Z" fill="currentColor"/>
              <path d="M7.67586 9.79827V14.3333C11.2397 14.0877 14.0877 11.2397 14.3333 7.67586H9.79827C9.59471 8.74895 8.74895 9.59471 7.67586 9.79827Z" fill="currentColor"/>
            </svg>
          ),
          isActive: location.pathname === '/analytics'
        }
      ]
    },
    {
      name: 'Operations',
      items: [
        {
          name: 'Transactions',
          href: '/transactions',
          icon: (props) => (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="15"
              height="15"
              viewBox="0 0 15 15"
              fill="none"
              {...props}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.5 3.90578V3.16634L7.83333 3.16634V3.90578C8.21727 3.9915 8.57064 4.15081 8.86447 4.37243C9.32269 4.71804 9.66667 5.24532 9.66667 5.88243L8.33333 5.88243C8.33333 5.75587 8.2669 5.59179 8.06159 5.43693C7.85594 5.28182 7.54174 5.16634 7.16667 5.16634C6.79159 5.16634 6.47739 5.28182 6.27175 5.43693C6.06643 5.59179 6 5.75587 6 5.88243C6 6.09968 6.05796 6.16402 6.12809 6.21231C6.25212 6.29771 6.5447 6.40095 7.16667 6.40095C7.8725 6.40095 8.53606 6.50029 9.03647 6.8339C9.59449 7.20591 9.83333 7.78527 9.83333 8.45033C9.83333 9.18796 9.47863 9.74314 8.92969 10.0802C8.60421 10.28 8.22517 10.3959 7.83333 10.4534V11.1663H6.5V10.4365C6.08137 10.3556 5.69478 10.1986 5.37334 9.97642C4.8893 9.64178 4.5 9.11318 4.5 8.45033H5.83333C5.83333 8.55112 5.89175 8.71386 6.13156 8.87966C6.36871 9.04361 6.73262 9.16634 7.16667 9.16634C7.65648 9.16634 8.01693 9.07599 8.23207 8.94391C8.40699 8.83651 8.5 8.70035 8.5 8.45033C8.5 8.12774 8.40551 8.01573 8.29687 7.9433C8.13061 7.83246 7.79417 7.73428 7.16667 7.73428C6.4553 7.73428 5.83121 7.62674 5.37191 7.31047C4.85871 6.95708 4.66667 6.42882 4.66667 5.88243C4.66667 5.24533 5.01064 4.71804 5.46886 4.37243C5.76269 4.15081 6.11606 3.9915 6.5 3.90578Z"
                fill="currentColor"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0 7.16699C2.33e-07 3.20895 3.20863 0.00032497 7.16667 0.000325203C11.1247 0.000325436 14.3333 3.20895 14.3333 7.16699C14.3333 11.125 11.1247 14.3337 7.16667 14.3337V13.0306C10.4051 13.0306 13.0303 10.4054 13.0303 7.16699C13.0303 3.92859 10.4051 1.30336 7.16667 1.30336C4.30646 1.30336 1.92456 3.35123 1.40724 6.06071L2.31469 5.60699L2.89743 6.77245L0.942881 7.74972C0.740919 7.8507 0.501071 7.83991 0.308993 7.7212C0.116916 7.60249 0 7.39279 0 7.16699ZM1.57086 8.92636C1.66645 9.23071 1.78623 9.52443 1.92799 9.80528L0.764747 10.3924C0.59135 10.0489 0.444738 9.68944 0.3277 9.31681L1.57086 8.92636ZM2.70984 10.9782C2.9079 11.2095 3.12367 11.4253 3.35502 11.6234L2.50761 12.6132C2.22518 12.3714 1.96179 12.108 1.72 11.8256L2.70984 10.9782ZM4.60756 12.4446C4.86415 12.5693 5.13113 12.6757 5.40684 12.7623L5.01639 14.0055C4.67883 13.8995 4.35207 13.7692 4.03818 13.6167L4.60756 12.4446Z"
                fill="currentColor"
              />
            </svg>
          ),
          isActive: location.pathname === '/transactions',
        }
      ]
    },
    {
      name: 'Account & Billing',
      items: [
        {
          name: 'Billing',
          href: '/billing',
          icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="12" viewBox="0 0 15 12" fill="none" {...props}>
              <path d="M14.333 11.167C14.333 11.4431 14.1091 11.667 13.833 11.667H0.5C0.223858 11.667 0 11.4431 0 11.167V4.33398H14.333V11.167ZM6.5 8V9H7.83301V8H6.5ZM9.16602 8V9H11.833V8H9.16602ZM13.833 0C14.109 3.8776e-06 14.3328 0.22401 14.333 0.5V3.33398H0V0.5C0.000175921 0.224007 0.223966 0 0.5 0H13.833Z" fill="currentColor"/>
            </svg>
          ),
          isActive: location.pathname === '/billing'
        }
      ]
    },
    {
      name: 'Developer Tools',
      items: [
        {
          name: 'API Testing',
          href: '/api-testing',
          icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="15" viewBox="0 0 13 15" fill="none" {...props}>
              <path d="M9.83301 1H8.66602V4.70996L12.9492 13.6162C13.0237 13.7711 13.0134 13.9541 12.9219 14.0996C12.8303 14.2448 12.6707 14.333 12.499 14.333H0.5C0.328094 14.333 0.168624 14.2442 0.0771484 14.0986C-0.0142658 13.9531 -0.0247493 13.7711 0.0498047 13.6162L3.44238 6.56836L3.4375 6.56543L3.45312 6.5459L4.33203 4.71875V1H3.16699V0H9.83301V1ZM8.33203 10.5225L8.32617 10.5234C7.97075 10.6187 7.75953 10.9844 7.85449 11.3398C7.94979 11.6955 8.31623 11.9068 8.67188 11.8115L8.67676 11.8105C9.0324 11.7153 9.24373 11.3488 9.14844 10.9932C9.05295 10.6378 8.68752 10.4272 8.33203 10.5225ZM4.33203 9.18848L4.32617 9.19043C3.9707 9.28578 3.75933 9.65131 3.85449 10.0068C3.94979 10.3625 4.31623 10.5738 4.67188 10.4785L4.67676 10.4766C5.0324 10.3813 5.24373 10.0158 5.14844 9.66016C5.05308 9.3046 4.68762 9.0932 4.33203 9.18848ZM5.33203 4.94727L4.81543 6.01953C4.91509 6.03462 5.01292 6.05719 5.10742 6.08496C5.64087 6.24176 6.22106 6.60613 6.76953 6.95801C7.42158 7.3763 7.85649 7.37332 8.11816 7.28516C8.32543 7.21521 8.49207 7.06924 8.60742 6.89648L7.66504 4.9375V1H5.33203V4.94727Z" fill="currentColor"/>
            </svg>
          ),
          isActive: location.pathname === '/api-testing'
        },
        { 
          name: 'API Credentials', 
          href: '/api-credentials', 
          icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="8" viewBox="0 0 14 8" fill="none" {...props}>
              <path d="M4.93333 7.06667L1.86667 4L4.93333 0.933333L4 0L0 4L4 8L4.93333 7.06667ZM8.4 7.06667L11.4667 4L8.4 0.933333L9.33333 0L13.3333 4L9.33333 8L8.4 7.06667Z" fill="currentColor"/>
            </svg>
          ),
          isActive: location.pathname === '/api-credentials' 
        },
        {
          name: 'API Documentation',
          href: 'https://idtoai.readme.io/reference/idtoai-verification-apis',
          icon: (props) => (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="15" viewBox="0 0 14 15" fill="none" {...props}>
              <path d="M12.3333 0.651515C12.3333 0.291693 12.0427 0 11.6842 0H4.92411L0 4.94226V13.6818C0 14.0416 0.290623 14.3333 0.649123 14.3333H5.17537V13.0303H1.29818V5.86367H5.84204L5.84204 1.30306H11.035V7.83336H12.3333V0.651515Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M11.7805 11.862L10.252 10.3334L11.1948 9.39062L13.6662 11.862L11.1948 14.3334L10.252 13.3906L11.7805 11.862Z" fill="currentColor"/>
              <path fillRule="evenodd" clipRule="evenodd" d="M7.66672 11.862L9.19531 10.3334L8.2525 9.39062L5.7811 11.862L8.2525 14.3334L9.19531 13.3906L7.66672 11.862Z" fill="currentColor"/>
            </svg>
          ),
          isActive: false,
          isExternal: true
        }
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
                  <div className={`overflow-hidden relative shrink-0 size-4 ${item.isActive ? 'text-[#0019ff]' : 'text-[#616675]'}`}>
                    <IconComponent className={`w-4 h-4`} />
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
              <div className="relative shrink-0 size-[30px] bg-[#f0f0f0] rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
                  <path opacity="0.4" d="M13.4375 0C6.01617 0 0 6.01617 0 13.4375C0 20.8588 6.01617 26.875 13.4375 26.875C14.3675 26.875 15.2754 26.7805 16.1522 26.6007C16.6926 26.4898 16.9628 26.4344 17.0362 26.2422C17.1096 26.05 16.9202 25.795 16.5415 25.285C15.7693 24.2452 15.3125 22.9572 15.3125 21.5625C15.3125 18.1107 18.1107 15.3125 21.5625 15.3125C22.9572 15.3125 24.2452 15.7693 25.285 16.5415C25.795 16.9202 26.05 17.1096 26.2422 17.0362C26.4344 16.9628 26.4898 16.6926 26.6007 16.1522C26.7805 15.2754 26.875 14.3675 26.875 13.4375C26.875 6.01617 20.8588 0 13.4375 0Z" fill="#8A95FF" />
                  <path d="M9.35996 10.3125C9.35996 8.06758 11.1821 6.25 13.4269 6.25C15.6718 6.25 17.4939 8.06758 17.4939 10.3125C17.4939 12.5574 15.6718 14.375 13.4269 14.375C11.1821 14.375 9.35996 12.5574 9.35996 10.3125Z" fill="#8A95FF" />
                  <path d="M14.3644 17.3361C14.3688 17.8538 13.9526 18.2771 13.4349 18.2815C11.5793 18.2973 9.75433 19.0113 8.49057 20.3349C8.13302 20.7094 7.53959 20.7231 7.1651 20.3656C6.79061 20.008 6.77688 19.4146 7.13443 19.0401C8.78585 17.3104 11.1139 16.4262 13.4189 16.4066C13.9367 16.4022 14.36 16.8183 14.3644 17.3361Z" fill="#8A95FF" />
                  <circle cx="21.5625" cy="21.5625" r="4.375" fill="#3AC828" />
                </svg>
              </div>
              <div className="flex flex-col gap-0.5 items-start justify-center leading-[1.4] relative">
                {profileLoading ? (
                  <>
                    <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />
                    <div className="h-2 w-24 bg-gray-200 rounded animate-pulse" />
                  </>
                ) : (
                  <>
                    <p className="font-medium capitalize relative text-[12px] text-[#616675] tracking-[-0.12px]">
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
