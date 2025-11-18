import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

interface SimulationModeModalContextType {
  isModalOpen: boolean
  openModal: () => void
  closeModal: () => void
  handleMoveToProduction: () => void
}

const SimulationModeModalContext = createContext<SimulationModeModalContextType | undefined>(undefined)

export const SimulationModeModalProvider = ({ children }: { children: ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data: onboardingStatus } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const openModal = useCallback(() => {
    if (!isProduction) {
      setIsModalOpen(true)
    }
  }, [isProduction])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [])

  const handleMoveToProduction = useCallback(() => {
    // Close the simulation mode modal
    // The actual switch to production modal will be opened from the component using this context
    setIsModalOpen(false)
  }, [])

  // Set up 15-minute interval to show modal when not in production
  useEffect(() => {
    if (isProduction) {
      // Don't show modal if already in production
      return
    }

    // Show modal immediately on mount
    setIsModalOpen(true)

    // Interval for every 15 minutes
    const intervalMs = 15 * 60 * 1000 // 15 minutes in milliseconds

    // Set up interval to show modal every 15 minutes
    const intervalId = setInterval(() => {
      setIsModalOpen(true)
    }, intervalMs)

    return () => {
      clearInterval(intervalId)
    }
  }, [isProduction])

  const value = {
    isModalOpen,
    openModal,
    closeModal,
    handleMoveToProduction,
  }

  return <SimulationModeModalContext.Provider value={value}>{children}</SimulationModeModalContext.Provider>
}

export const useSimulationModeModal = () => {
  const context = useContext(SimulationModeModalContext)
  if (context === undefined) {
    throw new Error('useSimulationModeModal must be used within a SimulationModeModalProvider')
  }
  return context
}

