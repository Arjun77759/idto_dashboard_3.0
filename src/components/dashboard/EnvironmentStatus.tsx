import { Play, ChevronUp, ChevronDown } from 'lucide-react'
import SimulationModeBanner from '@/components/dashboard/SimulationModeBanner'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

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
  <div className="box-border flex items-start justify-between px-0 py-[6px]">
    <div className="content-stretch flex gap-[16px] items-center relative shrink-0">
      <div className="bg-[#e6e8ff] overflow-clip relative rounded-[4px] shrink-0 size-[34px]">
        <div className="absolute left-[9px] overflow-clip size-[16px] top-[9px]">
          {/* Online Prediction Icon - Live/Broadcast indicator */}
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10.334 7.66662C10.334 8.99995 8.66732 9.99995 8.66732 11H7.33398C7.33398 9.99995 5.66732 8.99995 5.66732 7.66662C5.66732 6.37995 6.71398 5.33329 8.00065 5.33329C9.28732 5.33329 10.334 6.37995 10.334 7.66662ZM8.66732 11.6666H7.33398V12.6666H8.66732V11.6666ZM14.6673 7.99995C14.6673 6.15995 13.9207 4.49329 12.714 3.28662L12.0073 3.99329C13.034 5.01995 13.6673 6.43995 13.6673 7.99995C13.6673 9.55995 13.034 10.98 12.0073 12.0066L12.714 12.7133C13.9207 11.5066 14.6673 9.83995 14.6673 7.99995ZM2.33398 7.99995C2.33398 6.43995 2.96732 5.01995 3.99398 3.99329L3.28732 3.28662C2.08065 4.49329 1.33398 6.15995 1.33398 7.99995C1.33398 9.83995 2.08065 11.5066 3.28732 12.7133L3.99398 12.0066C2.96732 10.98 2.33398 9.55995 2.33398 7.99995ZM11.6673 7.99995C11.6673 9.01329 11.254 9.92662 10.594 10.5933L11.3007 11.3C12.1473 10.4533 12.6673 9.28662 12.6673 7.99995C12.6673 6.71329 12.1473 5.54662 11.3007 4.69995L10.594 5.40662C11.254 6.07329 11.6673 6.98662 11.6673 7.99995ZM4.70065 11.3L5.40732 10.5933C4.74065 9.92662 4.33398 9.01329 4.33398 7.99995C4.33398 6.98662 4.74732 6.07329 5.40732 5.40662L4.70065 4.69995C3.85398 5.54662 3.33398 6.71329 3.33398 7.99995C3.33398 9.28662 3.85398 10.4533 4.70065 11.3Z" fill="#0019FF" />
          </svg>
        </div>
      </div>
      <div className="content-stretch flex flex-col font-medium items-start leading-[1.4] not-italic relative shrink-0 text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre">
        <p className="relative shrink-0 text-[#131b31]">
          Live Mode
        </p>
        <p className="relative shrink-0 text-[#9296a0] text-center">
          Real Data
        </p>
      </div>
    </div>
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

