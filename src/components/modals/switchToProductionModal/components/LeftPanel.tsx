import React from 'react'
import VerificationSteps from './VerificationSteps'
import ActionButton from './ActionButton'

interface VerificationStep {
  icon: string
  title: string
}

interface LeftPanelProps {
  steps: VerificationStep[]
  isLoading: boolean
  onConfirm: () => void
}

const LeftPanel: React.FC<LeftPanelProps> = ({ steps, isLoading, onConfirm }) => {
  return (
    <div className="bg-white flex-1 flex flex-col gap-4 items-start p-6 relative rounded shrink-0">
      <VerificationSteps steps={steps} />
      <ActionButton isLoading={isLoading} onConfirm={onConfirm} />
    </div>
  )
}

export default LeftPanel
