import React from 'react'
import { BadgeCheck, Building2, Check, Clock3, Landmark, Lock, RotateCcw, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react'

interface VerificationStep {
  icon: React.ComponentType<{ className?: string }>
  title: string
}

interface VerificationStepsProps {
  steps: VerificationStep[]
}

const productionHighlights = [
  {
    icon: ShieldCheck,
    title: 'End-to-end encrypted',
    description: 'Documents never leave our compliance vault.'
  },
  {
    icon: Clock3,
    title: '24h TAT',
    description: 'Approved within one business day, typically faster.'
  },
  {
    icon: RotateCcw,
    title: 'Resume anytime',
    description: 'Drop off, come back, pick up where you left.'
  }
]

const productionRequirements = [
  {
    icon: Building2,
    title: 'Company basics',
    description: 'Brand name, legal name, registered address'
  },
  {
    icon: BadgeCheck,
    title: 'Business PAN & GSTIN',
    description: 'Auto-verified via NSDL & GST portal'
  },
  {
    icon: UserRoundCheck,
    title: 'Authorized signatory',
    description: 'DigiLocker pull + board resolution'
  },
  {
    icon: Landmark,
    title: 'Bank account',
    description: 'Verified via penny-drop'
  }
]

const VerificationSteps: React.FC<VerificationStepsProps> = ({ steps: _steps }) => {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[#e0e5eb] bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.12)]">
      <div className="bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)] p-6 text-white">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#e5f2ff] px-3 py-1 text-[11px] leading-4 text-[#1034b1]">
          <Sparkles className="size-3" />
          AI-native identity
        </div>
        <h2 className="mt-3 text-[30px] font-bold leading-9 tracking-[-0.3px]">
          Verify smarter. Decide faster.
        </h2>
        <p className="mt-3 text-[13px] leading-5 text-white/90">
          DigiLocker-first KYC. No paper. No follow-ups. Your team is approved in 24 business hours.
        </p>
        <div className="mt-6 flex flex-col gap-3">
          {productionHighlights.map((item) => (
            <div key={item.title} className="flex items-start gap-3">
              <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-white/15">
                <item.icon className="size-3" />
              </span>
              <span>
                <span className="block text-[13px] leading-5">{item.title}</span>
                <span className="block text-[11.5px] leading-[17px] text-white/80">{item.description}</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-[20px] font-bold leading-[30px] tracking-[-0.5px] text-[#0c121a]">
          Here's what we'll need
        </h3>
        <p className="mt-1 text-[13px] leading-5 text-[#6a727d]">
          Keep these ready. Most are auto-pulled from government sources.
        </p>
        <div className="mt-5 flex flex-col gap-2.5">
          {productionRequirements.map((item) => (
            <div key={item.title} className="flex items-start gap-3 rounded-2xl border border-[#e0e5eb] p-3">
              <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-[#f0f4f9] text-[#131b31]">
                <item.icon className="size-4" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] leading-5 text-[#0c121a]">{item.title}</span>
                <span className="block text-[11.5px] leading-[17px] text-[#6a727d]">{item.description}</span>
              </span>
              <Check className="mt-1 size-4 text-[#00a575]" />
            </div>
          ))}
        </div>
        <div className="mt-5 flex items-center gap-2 text-[12px] leading-[18px] text-[#6a727d]">
          <Lock className="size-3.5" />
          ~20 minutes · auto-saves as you go
        </div>
      </div>
    </div>
  )
}

export default VerificationSteps
