import SimulationModeBanner from '@/components/dashboard/SimulationModeBanner'
import Sidebar from '@/components/Sidebar'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { Outlet } from 'react-router-dom'

const PrivateLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen bg-white flex overflow-y-auto"
    >
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} transition-all duration-300 overflow-hidden bg-white border-r border-gray-200`}>
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-5 items-start p-6 relative w-full"
        >
          {/* Simulation Mode Banner */}
          <SimulationModeBanner />
          <Outlet />
        </motion.div>
      </div>
    </motion.div>
  )
}

export default PrivateLayout
