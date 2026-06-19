import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Camera, ChevronLeft, ChevronRight, CirclePlay, Sparkles, Building2, CreditCard, FileText, IdCard, Rocket, ShieldCheck, Zap } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import ActionCards from '@/components/dashboard/ActionCards'
import EnvironmentStatus from '@/components/dashboard/EnvironmentStatus'
import InvoicesTable from '@/components/dashboard/InvoicesTable'
import StatsGrid from '@/components/dashboard/StatsGrid'
import SwitchToProductionModal from '@/components/modals/switchToProductionModal/SwitchToProductionModal'
import type { ApiEndpoint } from '@/config/apiEndpoints'
import { useIsMobile } from '@/hooks/use-mobile'
import { useConfiguredApis } from '@/hooks/useConfiguredApis'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useOpenApiEndpoints } from '@/hooks/useOpenApiEndpoints'
import { useUserProfile, type UserProfile } from '@/hooks/useUserProfile'



const sandboxApis = [
  {
    title: 'PAN Verify',
    description: 'Validate Indian PAN against govt records.',
    calls: '412 sandbox calls',
    icon: IdCard,
  },
  {
    title: 'Aadhaar OTP',
    description: 'OKYC with Aadhaar OTP flow.',
    calls: '218 sandbox calls',
    icon: ShieldCheck,
  },
  {
    title: 'Bank Account Verify',
    description: 'Penny-drop with name match.',
    calls: '96 sandbox calls',
    icon: CreditCard,
  },
  {
    title: 'GST Verify',
    description: 'Validate GSTIN and fetch entity details.',
    calls: '41 sandbox calls',
    icon: Building2,
  },
  {
    title: 'Document OCR',
    description: 'Any govt ID -> structured JSON.',
    calls: '14 sandbox calls',
    icon: FileText,
  },
  {
    title: 'Face Match + Liveness',
    description: 'Selfie to ID, with passive liveness.',
    calls: '8 sandbox calls',
    icon: Camera,
  },
]

const recommendations = [
  {
    helper: 'Most fintech teams add this after PAN Verify',
    title: 'Document OCR',
    description: 'Any government ID -> structured JSON in 2 seconds.',
    icon: FileText,
  },
  {
    helper: 'Complete your KYC stack',
    title: 'Face Match + Liveness',
    description: 'Selfie to ID with passive liveness - no user friction.',
    icon: Camera,
  },
  {
    helper: "You haven't tried this yet",
    title: 'Watchlist Screening',
    description: 'Screen users against PEP, sanctions and adverse media.',
    icon: ShieldCheck,
  },
]

const getGreetingName = (profile: UserProfile | null) => {
  const personName = profile?.name?.trim()
  if (personName) return personName.split(/\s+/)[0]

  const businessName = profile?.brand_name?.trim() || profile?.registered_name?.trim()
  if (businessName) return businessName

  const emailName = profile?.email?.split('@')[0]?.trim()
  return emailName || 'there'
}

const FeatureHero = ({ isProduction }: { isProduction: boolean }) => {
  const navigate = useNavigate()
  const [isSwitchModalOpen, setIsSwitchModalOpen] = useState(false)
  const [activeHeroIndex, setActiveHeroIndex] = useState(0)
  const [heroDirection, setHeroDirection] = useState(1)

  if (!isProduction) {
    return (
      <section className="relative min-h-[251px] w-full overflow-hidden rounded-[24px] bg-[linear-gradient(113deg,#3162ce_0%,#0491ca_55%,#01b2b7_100%)] px-[50px] py-[29px] text-white">
        <div className="flex max-w-[843px] items-start gap-[18px]">
          <div className="relative grid size-14 shrink-0 place-items-center rounded-[18px] bg-[linear-gradient(135deg,rgba(255,255,255,0.25)_0%,rgba(255,255,255,0.05)_100%)] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.3)] backdrop-blur-[4px]">
            <Rocket className="size-6 text-white" strokeWidth={2} />
            <span className="absolute -right-1 -top-1 size-3 rounded-full bg-[#ffd230] shadow-[0_0_0_3px_rgba(255,210,48,0.18)]" />
          </div>

          <div className="flex max-w-[769px] flex-col items-start gap-[18px]">
            <div className="inline-flex h-[23px] items-center gap-2 rounded-full border border-[#998332] bg-[rgba(255,210,48,0.2)] px-3 py-1 text-[10px] font-bold uppercase leading-[15px] tracking-[1.6px] text-[#fee685] backdrop-blur-[4px]">
              <Zap className="size-3 shrink-0" strokeWidth={2.25} />
              You're in sandbox
            </div>

            <div>
              <h2 className="text-[40px] font-bold leading-none tracking-[-0.7px] text-white">
                Stop testing.{' '}
                <span className="bg-gradient-to-r from-[#fee685] via-[#fef3c6] to-white bg-clip-text text-transparent">
                  Start verifying real users.
                </span>
              </h2>
              <p className="mt-[18px] max-w-[769px] text-[18px] font-normal leading-7 text-white/85">
                Flip one switch to go live same endpoints, real UIDAI / NPCI data, production-grade rate limits. Onboarding finishes in under 2 minutes.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsSwitchModalOpen(true)}
              className="inline-flex h-[42px] items-center justify-center gap-1.5 rounded-full bg-white px-5 py-[11px] text-[14px] font-bold leading-5 text-[#3061ef] shadow-[0_10px_30px_-10px_rgba(255,255,255,0.6)]"
            >
              Move to Production
              <ArrowRight className="size-4" />
            </button>
          </div>
        </div>

        <SwitchToProductionModal
          isOpen={isSwitchModalOpen}
          onClose={() => setIsSwitchModalOpen(false)}
          onConfirm={() => setIsSwitchModalOpen(false)}
        />
      </section>
    )
  }

  const heroSlides = isProduction
    ? [
    {
      sectionClass: 'bg-[linear-gradient(112.29deg,#3162ce_0%,#0491ca_55%,#01b2b7_100%)] text-white',
      badgeClass: 'bg-white/15 text-white',
      badge: 'New - Document OCR',
      title: 'Read any govt ID in 2 seconds',
      description: 'Drop a PAN, Aadhaar or DL get structured JSON, instantly.',
      descriptionClass: 'text-white/85',
      primaryLabel: 'Try in sandbox',
      primaryPath: '/api-testing',
      primaryClass: 'bg-white text-[#0019ff]',
      secondaryClass: 'border-white/25 bg-white/10 text-white',
      previousClass: 'bg-white/15 text-white',
      nextClass: 'bg-white text-[#01afb9]',
      dotClass: 'bg-white',
      mutedDotClass: 'bg-white/40',
    },
    {
      sectionClass: 'bg-[linear-gradient(112.29deg,#3162ce_0%,#0491ca_55%,#01b2b7_100%)] text-white',
      badgeClass: 'bg-white/15 text-white',
      badge: 'Live - Face Match',
      title: 'Match selfies to IDs instantly',
      description: 'Run face match and passive liveness checks with live audit trails.',
      descriptionClass: 'text-white/85',
      primaryLabel: 'Start face match',
      primaryPath: '/api-testing',
      primaryClass: 'bg-white text-[#0019ff]',
      secondaryClass: 'border-white/25 bg-white/10 text-white',
      previousClass: 'bg-white/15 text-white',
      nextClass: 'bg-white text-[#01afb9]',
      dotClass: 'bg-white',
      mutedDotClass: 'bg-white/40',
    },
    {
      sectionClass: 'bg-[linear-gradient(112.29deg,#3162ce_0%,#0491ca_55%,#01b2b7_100%)] text-white',
      badgeClass: 'bg-white/15 text-white',
      badge: 'Live - Bank Verify',
      title: 'Verify bank details in seconds',
      description: 'Confirm account ownership and name match before payouts.',
      descriptionClass: 'text-white/85',
      primaryLabel: 'Try in sandbox',
      primaryPath: '/api-testing',
      primaryClass: 'bg-white text-[#0019ff]',
      secondaryClass: 'border-white/25 bg-white/10 text-white',
      previousClass: 'bg-white/15 text-white',
      nextClass: 'bg-white text-[#01afb9]',
      dotClass: 'bg-white',
      mutedDotClass: 'bg-white/40',
    },
  ]
    : [
    {
      sectionClass: 'border border-[#e0e5eb] bg-[linear-gradient(112.29deg,#3162ce_0%,#0491ca_55%,#01b2b7_100%)] text-white',
      badgeClass: 'bg-white/15 text-white',
      badge: 'Sandbox - Test Document OCR',
      title: 'Test govt ID OCR with dummy data',
      description: 'Try PAN, Aadhaar or DL parsing safely before moving to live data.',
      descriptionClass: 'text-white/85',
      primaryLabel: 'Try in sandbox',
      primaryPath: '/api-testing',
      primaryClass: 'bg-white text-[#0019ff]',
      secondaryClass: 'border-white/25 bg-white/10 text-white',
      previousClass: 'bg-white/15 text-white',
      nextClass: 'bg-white text-[#01afb9]',
      dotClass: 'bg-white',
      mutedDotClass: 'bg-white/40',
    },
    {
      sectionClass: 'border border-[#e0e5eb] bg-[linear-gradient(112.29deg,#3162ce_0%,#0491ca_55%,#01b2b7_100%)] text-white',
      badgeClass: 'bg-white/15 text-white',
      badge: 'Sandbox - Face Match',
      title: 'Preview face match checks',
      description: 'Use sample selfies and IDs to test match scores before going live.',
      descriptionClass: 'text-white/85',
      primaryLabel: 'Try face match',
      primaryPath: '/api-testing',
      primaryClass: 'bg-white text-[#0019ff]',
      secondaryClass: 'border-white/25 bg-white/10 text-white',
      previousClass: 'bg-white/15 text-white',
      nextClass: 'bg-white text-[#01afb9]',
      dotClass: 'bg-white',
      mutedDotClass: 'bg-white/40',
    },
    {
      sectionClass: 'border border-[#e0e5eb] bg-[linear-gradient(112.29deg,#3162ce_0%,#0491ca_55%,#01b2b7_100%)] text-white',
      badgeClass: 'bg-white/15 text-white',
      badge: 'Sandbox - Bank Verify',
      title: 'Verify bank details in seconds',
      description: 'Run penny-drop style checks safely with dummy responses.',
      descriptionClass: 'text-white/85',
      primaryLabel: 'Try in sandbox',
      primaryPath: '/api-testing',
      primaryClass: 'bg-white text-[#0019ff]',
      secondaryClass: 'border-white/25 bg-white/10 text-white',
      previousClass: 'bg-white/15 text-white',
      nextClass: 'bg-white text-[#01afb9]',
      dotClass: 'bg-white',
      mutedDotClass: 'bg-white/40',
    },
  ]

  const hero = heroSlides[activeHeroIndex]
  const goToHero = (index: number, direction: number) => {
    setHeroDirection(direction)
    setActiveHeroIndex(index)
  }
  const goToPreviousHero = () => goToHero(activeHeroIndex === 0 ? heroSlides.length - 1 : activeHeroIndex - 1, -1)
  const goToNextHero = () => goToHero((activeHeroIndex + 1) % heroSlides.length, 1)

  return (
    <section className={`relative flex h-[278px] w-full flex-col overflow-hidden rounded-[24px] px-[40px] pb-[40px] pt-[48px] transition-colors duration-500 ${hero.sectionClass}`}>
      <div className="grid h-[190px] grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_80px]">
        <AnimatePresence mode="wait" custom={heroDirection}>
          <motion.div
            key={activeHeroIndex}
            custom={heroDirection}
            initial={{ x: heroDirection > 0 ? 36 : -36, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: heroDirection > 0 ? -36 : 36, opacity: 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-[190px] max-w-[576px] flex-col items-start gap-3"
          >
          <div className={`inline-flex h-[24px] items-center gap-2 rounded-full px-3 text-[10px] font-bold uppercase leading-[15px] tracking-[1.6px] backdrop-blur ${hero.badgeClass}`}>
            <Sparkles className="size-3.5" />
            {hero.badge}
          </div>
          <h2 className="whitespace-nowrap pt-1 text-[40px] font-bold leading-[44px] tracking-[-1px]">
            {hero.title}
          </h2>
          <p className={`text-[18px] font-normal leading-7 ${hero.descriptionClass}`}>
            {hero.description}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <button
              type="button"
              onClick={() => navigate(hero.primaryPath)}
              className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-[14px] font-bold leading-5 ${hero.primaryClass}`}
            >
              {hero.primaryLabel}
              <ArrowRight className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => window.open('https://drive.google.com/file/d/1vV3UIcOSrKOvh0_L_qFAPzMoKwroDMsI/view?usp=sharing', '_blank')}
              className={`inline-flex h-[42px] items-center gap-2 rounded-full border px-[17px] text-[14px] font-normal leading-5 ${hero.secondaryClass}`}
            >
              <CirclePlay className="size-4" />
              Watch demo
            </button>
          </div>
          </motion.div>
        </AnimatePresence>

        <div className="hidden items-end gap-2 self-end pb-5 lg:flex">
          <button type="button" onClick={goToPreviousHero} className={`grid size-9 place-items-center rounded-full ${hero.previousClass}`}>
            <ChevronLeft className="size-4" />
          </button>
          <button type="button" onClick={goToNextHero} className={`grid size-9 place-items-center rounded-full ${hero.nextClass}`}>
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-4 left-[40px] flex items-center gap-1.5">
        {heroSlides.map((slide, index) => (
          <button
            key={slide.badge}
            type="button"
            onClick={() => goToHero(index, index > activeHeroIndex ? 1 : -1)}
            className={`h-1 rounded-full transition-all ${index === activeHeroIndex ? `w-8 ${hero.dotClass}` : `w-3 ${hero.mutedDotClass}`}`}
            aria-label={`Show ${slide.badge}`}
          />
        ))}
      </div>
    </section>
  )
}

const normalizeApiName = (value: string) =>
  value.toLowerCase().trim().replace(/[/-]+/g, '_').replace(/\s+/g, '_')

const findEndpointForApi = (apiName: string, endpoints: ApiEndpoint[] | null) => {
  if (!endpoints) return undefined
  const normalizedName = normalizeApiName(apiName)
  return endpoints.find((endpoint) => {
    const id = normalizeApiName(endpoint.id)
    const name = normalizeApiName(endpoint.name)
    return id === normalizedName || name === normalizedName || id.includes(normalizedName) || normalizedName.includes(id)
  })
}

const apiIconFor = (apiName: string) => {
  const name = apiName.toLowerCase()
  if (name.includes('pan')) return IdCard
  if (name.includes('aadhaar') || name.includes('kyc')) return ShieldCheck
  if (name.includes('bank')) return CreditCard
  if (name.includes('gst') || name.includes('business')) return Building2
  if (name.includes('face') || name.includes('liveness')) return Camera
  return FileText
}

const YourApisSection = ({ isProduction }: { isProduction: boolean }) => {
  const navigate = useNavigate()
  const { data: configuredApis, loading, error } = useConfiguredApis()
  const { data: apiEndpoints } = useOpenApiEndpoints()

  const productionApis = useMemo(() => {
    return (configuredApis?.apis || []).map((api) => {
      const endpoint = findEndpointForApi(api.api_name || api.display_name, apiEndpoints)
      return {
        title: api.display_name || api.api_name,
        description: endpoint?.shortDescription || api.pricing_note || 'Configured for your live workspace.',
        calls: `${api.total_calls?.toLocaleString('en-IN') ?? 0} live calls`,
        status: 'Active',
        icon: apiIconFor(api.display_name || api.api_name),
      }
    })
  }, [apiEndpoints, configuredApis])

  const apis = isProduction ? productionApis : sandboxApis

  return (
    <section className="w-full rounded-[22px] border border-[#e0e5eb] bg-white p-[21px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[20px] font-medium leading-7 tracking-[-0.5px] text-[#0a121f]">
            Your APIs
          </h2>
          <p className="mt-1 text-[14px] font-normal leading-5 text-[#5b6472]">
            {isProduction
              ? "Products enabled for your live workspace, powered by backend usage data."
              : "Products you've enabled - all returning dummy responses in sandbox."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate('/api-testing')}
          className={`inline-flex items-center gap-1 text-[14px] font-normal leading-5 ${isProduction ? 'text-[#0019ff]' : 'text-[#231eec]'}`}
        >
          View all
          <ArrowUpRight className="size-3.5" />
        </button>
      </div>

      {isProduction && loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[191px] animate-pulse rounded-[22px] border border-[#e0e5eb] bg-[#f7f9fc]" />
          ))}
        </div>
      ) : isProduction && error ? (
        <p className="rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</p>
      ) : apis.length === 0 ? (
        <p className="rounded-[14px] border border-[#e0e5eb] bg-[#f7f9fc] px-4 py-6 text-center text-[14px] text-[#5b6472]">
          No configured APIs found for this workspace.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {apis.slice(0, 6).map((api) => {
            const Icon = api.icon
            const [callCount, ...callLabel] = api.calls.split(' ')
            return (
              <article
                key={api.title}
                className="flex min-h-[191px] flex-col gap-1 overflow-hidden rounded-[22px] border border-[#e0e5eb] bg-white p-[21px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
              >
                <div className="flex items-start justify-between">
                  <div className={`grid size-10 place-items-center rounded-[18px] ${isProduction ? 'bg-[#e8f3ff] text-[#0019ff]' : 'bg-[#e0eeff] text-[#231eec]'}`}>
                    <Icon className="size-5" strokeWidth={2} />
                  </div>
                  <span className={`rounded-full px-[7.032px] py-[1.758px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[0.2198px] ${isProduction ? 'bg-[#ddfcef] text-[#007a55]' : 'bg-[#fff2d0] text-[#f09c17]'}`}>
                    {isProduction ? api.status : 'Sandbox'}
                  </span>
                </div>
                <h3 className="pt-3 text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#0a121f]">
                  {api.title}
                </h3>
                <p className="line-clamp-2 min-h-8 pb-3 text-[14px] font-normal leading-5 text-[#5b6472]">
                  {api.description}
                </p>
                <div className="border-t border-[#e0e5eb] pt-[13px]">
                  <span className="text-[12px] font-normal leading-4">
                    <span className="text-[#0a121f]">{callCount}</span>
                    <span className="text-[#5b6472]"> {callLabel.join(' ')}</span>
                  </span>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

const RecommendedSection = ({ isProduction }: { isProduction: boolean }) => {
  const navigate = useNavigate()
  const { data: apiEndpoints, loading, error } = useOpenApiEndpoints()
  const { data: configuredApis } = useConfiguredApis()
  const configuredNames = useMemo(
    () => new Set((configuredApis?.apis || []).map((api) => normalizeApiName(api.api_name || api.display_name))),
    [configuredApis]
  )

  const productionRecommendations = useMemo(() => {
    return (apiEndpoints || [])
      .filter((endpoint) => !configuredNames.has(normalizeApiName(endpoint.id)) && !configuredNames.has(normalizeApiName(endpoint.name)))
      .slice(0, 3)
      .map((endpoint) => ({
        helper: endpoint.category,
        title: endpoint.name,
        description: endpoint.shortDescription,
        icon: apiIconFor(endpoint.name),
      }))
  }, [apiEndpoints, configuredNames])

  const items = isProduction ? productionRecommendations : recommendations

  return (
    <section className="relative w-full overflow-hidden rounded-[22px] border border-[#e0e5eb] bg-[linear-gradient(90deg,rgba(224,238,255,0.6)_0%,#ffffff_50%,rgba(203,255,236,0.4)_100%)] p-[33px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
      <div className="pointer-events-none absolute -right-[79px] -top-[79px] size-64 rounded-full bg-[linear-gradient(135deg,#0019ff_0%,#00e59e_100%)] opacity-10 blur-[64px]" />
      <div className="mb-5">
        <span className="relative inline-flex h-[23px] items-center rounded-full bg-[#f9fcff]/80 px-[10px] py-1 text-[10px] font-normal uppercase leading-[15px] tracking-[0.5px] text-[#231eec] backdrop-blur">
          {isProduction ? 'Available from API catalog' : 'Recommended for Acme Fintech'}
        </span>
        <h2 className="relative pt-[12.5px] text-[20px] font-medium leading-7 tracking-[-0.5px] text-[#0a121f]">
          Teams like yours also use
        </h2>
        <p className="relative text-[14px] font-normal leading-5 text-[#5b6472]">
          {isProduction
            ? 'Explore more APIs from the backend catalog and enable them from API Testing.'
            : 'Based on your industry, current stack, and what similar teams enabled next.'}
        </p>
      </div>

      {isProduction && loading ? (
        <div className="relative grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-[222.5px] animate-pulse rounded-[18px] border border-[#e0e5eb] bg-white/70" />
          ))}
        </div>
      ) : isProduction && error ? (
        <p className="relative rounded-[14px] border border-red-100 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</p>
      ) : (
        <div className="relative grid gap-4 md:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon
            const iconClass = index === 1 ? 'bg-[#cbffec] text-[#0a8f6b]' : 'bg-[#e0eeff] text-[#231eec]'
            return (
              <article
                key={`${item.title}-${index}`}
                className="h-[222.5px] rounded-[18px] border border-[#e0e5eb] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
              >
                <div className={`grid size-10 place-items-center rounded-[18px] ${iconClass}`}>
                  <Icon className="size-5" />
                </div>
                <p className="mt-4 line-clamp-1 text-[10px] font-normal uppercase leading-[16.5px] tracking-[0.55px] text-[#5b6472]">
                  {item.helper}
                </p>
                <h3 className="mt-2 line-clamp-1 text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#0a121f]">
                  {item.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-[14px] font-normal leading-5 text-[#5b6472]">
                  {item.description}
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/api-testing')}
                  className={`mt-4 inline-flex items-center gap-1 text-center font-normal leading-5 ${index === 2 && !isProduction ? 'text-[12px]' : 'text-[14px]'} text-[#231eec]`}
                >
                  {isProduction ? 'View API' : 'Try in sandbox'}
                  <ArrowUpRight className="size-3.5" />
                </button>
              </article>
            )
          })}
        </div>
      )}
    </section>
  )
}

const DashboardPage = () => {
  const { data: onboardingStatus, loading: onboardingLoading } = useOnboardingStatus()
  const { data: userProfile, loading: profileLoading } = useUserProfile()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const firstName = profileLoading ? '...' : getGreetingName(userProfile)
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  useEffect(() => {
    if (isMobile) {
      navigate('/mobile-production-redirect')
    }
  }, [isMobile, navigate])

  if (onboardingLoading && !onboardingStatus) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25 }}
        className="mx-auto flex w-full max-w-[1090px] flex-col gap-8"
      >
        <section className="pt-3">
          <div className="h-4 w-36 animate-pulse rounded-full bg-[#e0e5eb]" />
          <div className="mt-3 h-8 w-80 max-w-full animate-pulse rounded-full bg-[#e0e5eb]" />
          <div className="mt-3 h-5 w-[520px] max-w-full animate-pulse rounded-full bg-[#eef1f5]" />
        </section>
        <div className="h-[260px] animate-pulse rounded-[24px] bg-[#eef1f5]" />
      </motion.div>
    )
  }

  if (!isProduction) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full max-w-[1090px] flex-col gap-8"
      >
        <section className="pt-3">
          <div className="flex items-center gap-1.5 text-[12px] font-normal uppercase leading-[16.5px] tracking-[1.98px] text-[#5b6472]">
            <span className="size-1.5 rounded-full bg-[#00e59e]" />
            {'Sandbox \u00b7 Test Data'}
          </div>
          <h1 className="mt-1 text-[30px] font-semibold leading-[30px] tracking-[-0.8px] text-[#0a121f]">
            Welcome back, <span className="text-[#0019ff]">{firstName}</span>
          </h1>
          <p className="mt-1 text-[14px] font-normal leading-[21px] text-[#5b6472]">
            Your sandbox is provisioned. Every product is live in test mode with dummy responses.
          </p>
        </section>

        <EnvironmentStatus />
        <FeatureHero isProduction={false} />
        <StatsGrid />
        <ActionCards />
        <YourApisSection isProduction={false} />
        <RecommendedSection isProduction={false} />
        <InvoicesTable />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto flex w-full max-w-[1090px] flex-col gap-8"
    >
      <section className="pt-3">
        <div className="flex items-center gap-1.5 text-[12px] font-normal uppercase leading-[16.5px] tracking-[1.98px] text-[#5b6472]">
          <span className="size-1.5 rounded-full bg-[#00e59e]" />
          {'Live \u00b7 Backend Data'}
        </div>
        <h1 className="mt-1 text-[30px] font-semibold leading-[30px] tracking-[-0.8px] text-[#0a121f]">
          Welcome back, <span className="text-[#0019ff]">{firstName}</span>
        </h1>
        <p className="mt-1 text-[14px] font-normal leading-[21px] text-[#5b6472]">
          Your production workspace is live. Usage, APIs, billing and activity are populated from backend data.
        </p>
      </section>

      <EnvironmentStatus />
      <FeatureHero isProduction />
      <StatsGrid />
      <ActionCards />
      <YourApisSection isProduction />
      <RecommendedSection isProduction />
      <InvoicesTable />
    </motion.div>
  )
}

export default DashboardPage
