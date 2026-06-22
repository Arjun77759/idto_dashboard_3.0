import SimulationModeModal from '@/components/modals/simulationModeModal/SimulationModeModal'
import SwitchToProductionModal from '@/components/modals/switchToProductionModal/SwitchToProductionModal'
import Sidebar from '@/components/Sidebar'
import { useSimulationModeModal } from '@/contexts/SimulationModeModalContext'
import { useIsMobile } from '@/hooks/use-mobile'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useUsageCredits } from '@/hooks/useUsageCredits'
import { getAccessToken } from '@/lib/auth'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import figmaLiveCreditsIcon from '@/assets/figma/transactions/page/live-credits.svg'
import figmaTopUpPlusIcon from '@/assets/figma/transactions/page/top-up-plus.svg'

const PrivateLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Mobile drawer state; desktop sidebar stays visible.
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)
  const token = getAccessToken()
  const location = useLocation()
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const { isModalOpen, closeModal } = useSimulationModeModal()
  const { data: onboardingStatus, loading: onboardingLoading } = useOnboardingStatus({ enabled: Boolean(token) })
  const { data: creditsData } = useUsageCredits()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const liveCredits = `\u20b9${(creditsData?.balance ?? 0).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

  const handleMoveToProduction = () => {
    closeModal()
    setIsSwitchModalOpen(true)
  }

  const handleConfirmSwitch = () => {
    setIsSwitchModalOpen(false)
  }

  useEffect(() => {
    const handleOpenSwitchModal = () => {
      closeModal()
      setIsSwitchModalOpen(true)
    }

    window.addEventListener('idto:open-switch-to-production', handleOpenSwitchModal)

    return () => {
      window.removeEventListener('idto:open-switch-to-production', handleOpenSwitchModal)
    }
  }, [closeModal])

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

        <div className="flex-1 min-w-0 flex flex-col bg-[#fafafb] overflow-hidden">
          <header className="h-[71px] shrink-0 border-b border-[#e5e5e5]/70 bg-white/80 backdrop-blur flex items-center justify-between px-6 lg:px-10">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-[#5b6472] hover:text-[#091123] hover:bg-[#fafafb] block lg:hidden"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
              <div>
                <div className="flex items-center gap-2 text-[12px] font-semibold uppercase leading-[17px] tracking-[1.76px] text-[#a1a1a1]">
                  <span className="size-1.5 rounded-full bg-[#00e59e]" />
                  Sample Data
                </div>
                <h1 className="text-[26px] font-semibold leading-[39px] tracking-[-0.65px] text-[#171717]">
                  idto<span className="text-[#0019ff]">.</span>ai
                </h1>
              </div>
            </div>
            <div className="hidden h-[42px] items-center gap-3 rounded-full border border-[#e5e5e5] bg-white px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] sm:flex">
              <div className="flex items-center gap-1.5 text-[12px] font-medium uppercase leading-[17px] tracking-[0.55px] text-[#737373]">
                <img src={figmaLiveCreditsIcon} alt="" className="size-3.5" />
                Live Credits
              </div>
              <span className="text-[16px] font-semibold leading-[22.5px] text-[#171717]">
                {liveCredits}
              </span>
              <button
                type="button"
                onClick={() => navigate('/billing')}
                className="grid size-6 place-items-center rounded-full bg-[#0019ff] text-white"
                aria-label="Top up credits"
              >
                <img src={figmaTopUpPlusIcon} alt="" className="size-3.5" />
              </button>
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
      className="h-screen bg-white flex overflow-hidden"
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
        w-[238px]
        h-full
        overflow-hidden bg-white border-r border-[#eef0f3]
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 min-w-0 flex flex-col bg-[#fafafb] overflow-hidden">
        <header className="h-[71px] shrink-0 border-b border-[#e5e5e5] bg-white/80 backdrop-blur flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-[#5b6472] hover:text-[#091123] hover:bg-[#fafafb] block lg:hidden"
              >
              {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            <div>
              <div className="flex items-center gap-2 text-[12px] font-semibold uppercase leading-[17px] tracking-[1.76px] text-[#a1a1a1]">
                <span className="size-1.5 rounded-full bg-[#00e59e]" />
                Live Data
              </div>
              <h1 className="text-[26px] font-semibold leading-[39px] tracking-[-0.65px] text-[#171717]">
                idto<span className="text-[#0019ff]">.</span>ai
              </h1>
            </div>
          </div>
          <div className="hidden h-[42px] items-center gap-3 rounded-full border border-[#e5e5e5] bg-white px-[17px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)] sm:flex">
            <div className="flex items-center gap-1.5 text-[12px] font-medium uppercase leading-[17px] tracking-[0.55px] text-[#737373]">
              <img src={figmaLiveCreditsIcon} alt="" className="size-3.5" />
              Live Credits
            </div>
            <span className="text-[16px] font-semibold leading-[22.5px] text-[#171717]">
              {liveCredits}
            </span>
            <button
              type="button"
              onClick={() => navigate('/billing')}
              className="grid size-6 place-items-center rounded-full bg-[#0019ff] text-white"
              aria-label="Top up credits"
            >
              <img src={figmaTopUpPlusIcon} alt="" className="size-3.5" />
            </button>
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
