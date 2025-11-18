import { useState } from 'react'
import Sidebar from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Outlet, Navigate } from 'react-router-dom'
import { getAccessToken } from '@/lib/auth'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import EnvironmentStatus from '@/components/dashboard/EnvironmentStatus'
import SimulationModeModal from '@/components/modals/simulationModeModal/SimulationModeModal'
import { useSimulationModeModal } from '@/contexts/SimulationModeModalContext'
import SwitchToProductionModal from '@/components/modals/switchToProductionModal/SwitchToProductionModal'

const PrivateLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false) // Start closed on mobile
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)
  const token = getAccessToken()
  const { isModalOpen, closeModal } = useSimulationModeModal()

  useOnboardingStatus({ enabled: Boolean(token) })

  const handleMoveToProduction = () => {
    closeModal()
    setIsSwitchModalOpen(true)
  }

  const handleConfirmSwitch = () => {
    setIsSwitchModalOpen(false)
  }

  if (!token) {
    return <Navigate to="/login" replace />
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
        lg:${sidebarOpen ? 'w-64' : 'w-0'}
      `}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 sm:gap-5 items-start p-4 sm:p-6 relative w-full h-full overflow-y-auto"
        >
          <div className='flex items-center gap-4'>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 block md:hidden"
            >
              {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
            <EnvironmentStatus />
          </div>
          <Outlet />
        </motion.div>
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

export default PrivateLayout
