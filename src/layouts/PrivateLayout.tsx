import CompanyHeader from '@/components/dashboard/CompanyHeader'
import EnvironmentStatus from '@/components/dashboard/EnvironmentStatus'
import SimulationModeModal from '@/components/modals/simulationModeModal/SimulationModeModal'
import SwitchToProductionModal from '@/components/modals/switchToProductionModal/SwitchToProductionModal'
import Sidebar from '@/components/Sidebar'
import { useSimulationModeModal } from '@/contexts/SimulationModeModalContext'
import { useIsMobile } from '@/hooks/use-mobile'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { getAccessToken } from '@/lib/auth'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'

const PrivateLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile drawer state; desktop sidebar stays visible.
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)
  const token = getAccessToken()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { isModalOpen, closeModal } = useSimulationModeModal()
  const { data: onboardingStatus, loading: onboardingLoading } = useOnboardingStatus({ enabled: Boolean(token) })
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const handleMoveToProduction = () => {
    closeModal()
    setIsSwitchModalOpen(true)
  }

  const handleConfirmSwitch = () => {
    setIsSwitchModalOpen(false)
  }

  // Redirect mobile non-production users from dashboard to post-signup-info
  useEffect(() => {
    if (isMobile && !onboardingLoading) {
      if (!isProduction) {
        navigate('/post-signup-info', { replace: true })
      }
      else {
        navigate('/mobile-production-redirect', { replace: true })
      }
    }
  }, [token, onboardingLoading, isMobile, isProduction, location.pathname, navigate])

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (!isProduction) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="h-screen bg-white flex overflow-hidden"
      >
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <div className={`
          fixed lg:relative z-50 lg:z-auto
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          transition-all duration-300 ease-in-out
          w-[238px]
          h-full
          overflow-hidden bg-white border-r border-[#eef0f3]
        `}>
          <Sidebar />
        </div>

        <div className="flex-1 min-w-0 flex flex-col bg-[#f7f7f8] overflow-hidden">
          <header className="h-[71px] shrink-0 border-b border-[#e7e8ea] bg-white/95 backdrop-blur flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-[#616675] hover:text-[#131b31] hover:bg-[#f7f7f8] block lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <h1 className="text-[28px] font-semibold leading-none tracking-normal text-[#131b31]">
                idto.ai
              </h1>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.22em] text-[#9aa0ab]">
              <span className="size-1.5 rounded-full bg-[#00d395]" />
              Sample Data
            </div>
          </header>

          <main className="flex-1 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="p-6 lg:p-8"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>

        <SimulationModeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onMoveToProduction={handleMoveToProduction}
        />
        <SwitchToProductionModal
          isOpen={isSwitchModalOpen}
          onClose={() => setIsSwitchModalOpen(false)}
          onConfirm={handleConfirmSwitch}
        />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-white flex overflow-y-auto"
    >
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:relative z-50 lg:z-auto
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        transition-all duration-300 ease-in-out
        w-64 lg:w-64
        h-full
        overflow-hidden bg-white border-r border-gray-200
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:gap-5 items-start p-4 sm:p-6 relative w-full h-full overflow-y-auto"
        >
          <div className='flex items-start justify-between w-full gap-4'>
            <div className='flex items-start gap-4 flex-1'>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 block md:hidden mt-1"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div className="flex flex-col gap-3 w-full">
                <CompanyHeader />
                <EnvironmentStatus />
              </div>
            </div>
          </div>
          <Outlet />
        </motion.div>
      </div>
      {/* Only show simulation mode modal if not in production */}
      {!isProduction && (
        <SimulationModeModal
          isOpen={isModalOpen}
          onClose={closeModal}
          onMoveToProduction={handleMoveToProduction}
        />
      )}
      <SwitchToProductionModal
        isOpen={isSwitchModalOpen}
        onClose={() => setIsSwitchModalOpen(false)}
        onConfirm={handleConfirmSwitch}
      />
    </motion.div>
  )
}

export default PrivateLayout
