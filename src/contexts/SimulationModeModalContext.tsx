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
  const [hasResolvedModal, setHasResolvedModal] = useState(false)
  const { data: onboardingStatus, loading } = useOnboardingStatus()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  const openModal = useCallback(() => {
    if (!isProduction) {
      setHasResolvedModal(false)
      setIsModalOpen(true)
    }
  }, [isProduction])

  const closeModal = useCallback(() => {
    setHasResolvedModal(true)
    setIsModalOpen(false)
  }, [])

  const handleMoveToProduction = useCallback(() => {
    // Close the simulation mode modal
    // The actual switch to production modal will be opened from the component using this context
    setHasResolvedModal(true)
    setIsModalOpen(false)
  }, [])

  // Show modal only when /onboard/check API is in flight
  useEffect(() => {
    if (isProduction) {
      setIsModalOpen(false)
      return
    }

    // Open during onboarding-status loading, then keep it open until the user chooses an action.
    if (loading && !hasResolvedModal) {
      setIsModalOpen(true)
    }
  }, [loading, isProduction, hasResolvedModal])

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

