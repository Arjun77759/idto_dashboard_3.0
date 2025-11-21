import { Play } from 'lucide-react'
import SimulationModeBanner from '@/components/dashboard/SimulationModeBanner'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { LOGO_SRC } from './WelcomeSection'

type EnvironmentStatusProps = {
  variant?: 'banner' | 'header'
}

const SandboxHeader = () => (
  <div className="flex items-start justify-between px-0 py-1.5 relative w-full">
    <div className="flex gap-4 items-center relative">
      <div
        className="rounded w-[34px] h-[34px] shrink-0"
        style={{
          backgroundImage:
            "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 34 34\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(-1.0409e-16 -1.7 1.7 -1.0409e-16 17 17)\\'><foreignObject x=\\'-190\\' y=\\'-190\\' width=\\'380\\' height=\\'380\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgba(84, 238, 190, 1) 0%, rgba(63, 185, 206, 1) 25%, rgba(42, 132, 223, 1) 50%, rgba(32, 105, 231, 1) 62.5%, rgba(21, 78, 239, 1) 75%, rgba(11, 52, 247, 1) 87.5%, rgba(0, 25, 255, 1) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')",
        }}
      />
      <div className="flex flex-col items-start relative">
        <p className="font-medium leading-[1.4] relative text-[12px] text-[#131b31] tracking-[-0.12px]">
          Sandbox
        </p>
        <p className="font-normal leading-[1.4] relative text-[12px] text-[#9296a0] tracking-[-0.12px]">
          Simulated Data
        </p>
      </div>
    </div>
  </div>
)

const ProductionHeader = () => (
  <div className="h-6 sm:h-7 overflow-hidden relative w-[45px] sm:w-[52px]">
    <img alt="idto logo" className="block max-w-none size-full" src={LOGO_SRC} />
  </div>
)

const ProductionBanner = () => (
  <div className="bg-[#f7f7f8] border border-[#e7e8ea] flex items-center justify-between gap-6 rounded-[50px] px-4 py-2 min-h-[56px]">
    <p className="text-[12px] leading-[1.4] text-[#616675] tracking-[-0.12px]">
      <span>You are in </span>
      <span className="font-semibold text-[#0019ff]">Live Mode</span>
      <span> — Follow the setup guide below to start populating your dashboard with real data.</span>
    </p>
    <button
      type="button"
      className="bg-[#e6e8ff] border border-[#e7e8ea] flex items-center gap-2 h-10 px-4 rounded-[35px] text-[#0019ff] text-[12px] font-bold tracking-[-0.12px] whitespace-nowrap"
    >
      View Tutorial
      <Play className="size-4 text-[#0019ff]" fill="currentColor" />
    </button>
  </div>
)

const EnvironmentStatus = ({ variant = 'banner' }: EnvironmentStatusProps) => {
  const { data } = useOnboardingStatus()
  const isProduction = Boolean(data?.is_onboarded)

  if (variant === 'header') {
    return isProduction ? <ProductionHeader /> : <SandboxHeader />
  }

  return isProduction ? <ProductionBanner /> : <SimulationModeBanner />
}

export default EnvironmentStatus

