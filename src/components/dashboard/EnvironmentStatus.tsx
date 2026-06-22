import SimulationModeBanner from '@/components/dashboard/SimulationModeBanner'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import idtoMark from '@/assets/Logo.svg'
import liveModeIcon from '@/assets/figma/billing/live-mode.svg'
import tutorialPlayIcon from '@/assets/figma/billing/tutorial-play.svg'

type EnvironmentStatusProps = {
  variant?: 'banner' | 'header'
}

const SandboxHeader = () => (
  <div className="flex h-20 w-full items-center gap-3 px-5">
    <div className="relative grid size-9 shrink-0 place-items-center rounded-lg bg-white shadow-[0_10px_30px_rgba(19,27,49,0.08)]">
      <img src={idtoMark} alt="" className="h-5 w-3 object-contain" />
      <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#00e59e]" />
    </div>
    <div className="flex items-center gap-2">
      <p className="text-[18px] font-semibold leading-none text-[#171717]">
        idto.ai
      </p>
      <span className="inline-flex h-[19px] items-center gap-1 rounded-full bg-[#fff2d0] px-2 text-[10px] font-bold uppercase tracking-normal text-[#f09c17]">
        <span className="size-1.5 rounded-full bg-[#00e59e]" />
        Sandbox
      </span>
    </div>
  </div>
)

const ProductionHeader = () => (
  <div className="flex h-20 w-full items-center gap-3 px-5">
    <div className="relative grid size-9 shrink-0 place-items-center rounded-lg bg-white shadow-[0_10px_30px_rgba(19,27,49,0.08)]">
      <img src={idtoMark} alt="" className="h-5 w-3 object-contain" />
      <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-[#00e59e]" />
    </div>
    <div className="flex min-w-0 flex-col gap-1">
      <p className="text-[18px] font-semibold leading-none text-[#171717]">
        idto.ai
      </p>
      <div className="flex items-center gap-2">
        <span className="inline-flex h-[19px] items-center gap-1 rounded-full bg-[#ddfcef] px-2 text-[10px] font-bold uppercase tracking-normal text-[#007a55]">
          <span className="size-1.5 rounded-full bg-[#00e59e]" />
          Live Mode
        </span>
        <span className="text-[11px] font-medium leading-none text-[#9296a0]">
          Real Data
        </span>
      </div>
    </div>
  </div>
)

const ProductionBanner = () => (
  <div className="flex min-h-[56px] items-center justify-between gap-6 rounded-[50px] border border-[#e0e5eb] bg-[#fafafb] px-4 py-2">
    <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#0019ff]">
      <img src={liveModeIcon} alt="" className="size-4" />
    </span>
    <p className="min-w-0 flex-1 text-[12px] leading-[1.4] tracking-[-0.12px] text-[#5b6472]">
      <span>You are in </span>
      <span className="font-semibold text-[#0019ff]">Live Mode</span>
      <span> - Follow the setup guide below to start populating your dashboard with real data.</span>
    </p>
    <button
      onClick={() => {
        window.open('https://drive.google.com/file/d/1vV3UIcOSrKOvh0_L_qFAPzMoKwroDMsI/view?usp=sharing', '_blank')
      }}
      type="button"
      className="flex h-10 items-center gap-2 whitespace-nowrap rounded-[35px] border border-[#0019ff] bg-[#0019ff] px-4 text-[12px] font-bold tracking-[-0.12px] text-white"
    >
      <img src={tutorialPlayIcon} alt="" className="size-4" />
      View Tutorial
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
