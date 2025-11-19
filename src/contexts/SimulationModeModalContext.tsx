import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
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
  const { data: onboardingStatus, loading } = useOnboardingStatus()
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

  // Close modal immediately if user is in production
  useEffect(() => {
    if (isProduction && isModalOpen) {
      setIsModalOpen(false)
    }
  }, [isProduction, isModalOpen])

  // Set up 15-minute interval to show modal when not in production
  useEffect(() => {
    // Don't show modal if already in production or still loading
    if (isProduction || loading) {
      return
    }

    // Show modal immediately on mount (after loading is complete)
    setIsModalOpen(true)

    // Interval for every 15 minutes
    const intervalMs = 15 * 60 * 1000 // 15 minutes in milliseconds

    // Set up interval to show modal every 15 minutes
    const intervalId = setInterval(() => {
      // Double check production status before showing
      if (!isProduction) {
        setIsModalOpen(true)
      }
    }, intervalMs)

    return () => {
      clearInterval(intervalId)
    }
  }, [isProduction, loading])

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

