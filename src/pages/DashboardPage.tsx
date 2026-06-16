import { motion } from 'framer-motion'
import { ArrowUpRight, Camera,Building2, CreditCard, FileText, IdCard, ShieldCheck } from 'lucide-react'
import { useEffect} from 'react'
import { useNavigate } from 'react-router-dom'

import ActionCards from '@/components/dashboard/ActionCards'
import ChartSection from '@/components/dashboard/ChartSection'
import EnvironmentStatus from '@/components/dashboard/EnvironmentStatus'
import InvoicesTable from '@/components/dashboard/InvoicesTable'
import StatsGrid from '@/components/dashboard/StatsGrid'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import { useIsMobile } from '@/hooks/use-mobile'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useUserProfile } from '@/hooks/useUserProfile'



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

const YourApisSection = () => (
  <section className="w-full rounded-[22px] border border-[#e0e5eb] bg-white p-[21px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        <h2 className="text-[20px] font-medium leading-7 tracking-[-0.5px] text-[#0a121f]">
          Your APIs
        </h2>
        <p className="mt-1 text-[14px] font-normal leading-5 text-[#5b6472]">
          Products you've enabled - all returning dummy responses in sandbox.
        </p>
      </div>
      <button className="inline-flex items-center gap-1 text-[14px] font-normal leading-5 text-[#231eec]">
        View all
        <ArrowUpRight className="size-3.5" />
      </button>
    </div>

    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {sandboxApis.map((api) => {
        const Icon = api.icon
        const [callCount, ...callLabel] = api.calls.split(' ')
        return (
          <article
            key={api.title}
            className="flex min-h-[191px] flex-col gap-1 overflow-hidden rounded-[22px] border border-[#fff2d0] bg-white p-[21px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
          >
            <div className="flex items-start justify-between">
              <div className="grid size-10 place-items-center rounded-[18px] bg-[#fff2d0] text-[#f09c17]">
                <Icon className="size-5" strokeWidth={2} />
              </div>
              <span className="rounded-full bg-[#fff0c5] px-[7.032px] py-[1.758px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[0.2198px] text-[#bb4d00]">
                Sandbox
              </span>
            </div>
            <h3 className="pt-3 text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#0a121f]">
              {api.title}
            </h3>
            <p className="min-h-8 pb-3 text-[14px] font-normal leading-5 text-[#5b6472]">
              {api.description}
            </p>
            <div className="border-t border-[#fff2d0] pt-[13px]">
              <span className="text-[12px] font-normal leading-4">
                <span className="text-[#0a121f]">{callCount}</span>
                <span className="text-[#5b6472]"> {callLabel.join(' ')}</span>
              </span>
            </div>
          </article>
        )
      })}
    </div>
  </section>
)

const RecommendedSection = () => (
  <section className="w-full rounded-[22px] border border-[#e0e5eb] bg-[#fff2d0] p-[33px] shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]">
    <div className="mb-5">
      <span className="inline-flex h-[23px] items-center rounded-full bg-white/80 px-[10px] py-1 text-[10px] font-normal uppercase leading-[15px] tracking-[0.5px] text-[#bb4d00] backdrop-blur">
        Recommended for Acme Fintech
      </span>
      <h2 className="pt-[12.5px] text-[20px] font-medium leading-7 tracking-[-0.5px] text-[#0a121f]">
        Teams like yours also use
      </h2>
      <p className="text-[14px] font-normal leading-5 text-[#5b6472]">
        Based on your industry, current stack, and what similar teams enabled next.
      </p>
    </div>

    <div className="grid gap-4 md:grid-cols-3">
      {recommendations.map((item, index) => {
        const Icon = item.icon
        return (
          <article
            key={item.title}
            className="h-[222.5px] rounded-[18px] border border-[#e0e5eb] bg-white p-5 shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_-1px_rgba(0,0,0,0.1)]"
          >
            <div className="grid size-10 place-items-center rounded-[18px] bg-[#fff2d0] text-[#f09c17]">
              <Icon className="size-5" />
            </div>
            <p className="mt-4 text-[10px] font-normal uppercase leading-[16.5px] tracking-[0.55px] text-[#5b6472]">
              {item.helper}
            </p>
            <h3 className="mt-2 text-[16px] font-medium leading-6 tracking-[-0.32px] text-[#0a121f]">
              {item.title}
            </h3>
            <p className="mt-1 text-[14px] font-normal leading-5 text-[#5b6472]">
              {item.description}
            </p>
            <button className={`mt-4 inline-flex items-center gap-1 text-center font-normal leading-5 text-[#f09c17] ${index === 2 ? 'text-[12px]' : 'text-[14px]'}`}>
              Try in sandbox
              <ArrowUpRight className="size-3.5" />
            </button>
          </article>
        )
      })}
    </div>
  </section>
)

const DashboardPage = () => {
  const { data: onboardingStatus } = useOnboardingStatus()
  const { data: userProfile } = useUserProfile()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)
  const showWelcomeSection = onboardingStatus ? !onboardingStatus.is_onboarded : true
  const isMobile = useIsMobile()
  const navigate = useNavigate()

  useEffect(() => {
    if (isMobile) {
      navigate('/mobile-production-redirect')
    }
  }, [isMobile, navigate])

  if (!isProduction) {
    const firstName = userProfile?.name?.split(' ')?.[0] || 'Riya'

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex w-full max-w-[1090px] flex-col gap-8"
      >
        <section className="pt-3">
          <div className="flex items-center gap-1.5 text-[12px] font-normal uppercase leading-[16.5px] tracking-[1.98px] text-[#5b6472]">
            <span className="size-1.5 rounded-full bg-[#00d395]" />
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
        <WelcomeSection />
        <StatsGrid />
        <ActionCards />
        <YourApisSection />
        <RecommendedSection />
        <InvoicesTable />
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-4 sm:gap-5 items-start relative w-full"
    >
      {/* Welcome Section */}
      {showWelcomeSection && <WelcomeSection />}

      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 grow items-start min-h-0 min-w-0 overflow-hidden p-4 sm:p-6 relative rounded-2xl w-full"
      >
        <div className="flex gap-2 items-center px-2 sm:px-3 py-1.5 relative rounded w-full">
          <div className="overflow-hidden relative shrink-0 size-5 sm:size-6">
            <div className="absolute inset-[9.38%_7.29%]">
              <span className="text-xl sm:text-2xl"><svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
                <path d="M12.9983 0.073906C12.3422 -0.157336 11.6271 0.173787 11.3946 0.792176L8.95629 7.27885L8.21196 7.00291L9.90005 2.51213C10.1306 1.89877 9.8078 1.20982 9.15606 0.980134C8.4999 0.748892 7.78483 1.08001 7.55238 1.6984L4.23729 10.5174L2.77329 7.46503C2.41133 6.71037 1.44305 6.4197 0.695923 6.86176C0.128396 7.19755 -0.127246 7.85705 0.0614123 8.46271L1.65028 13.5635C2.01618 14.7382 2.1833 15.2671 2.44622 15.7231C2.85526 16.4324 3.44025 17.0325 4.14942 17.4689C4.60586 17.7497 5.14316 17.9413 6.33086 18.3599C7.45204 18.755 8.27579 19.0451 8.94599 19.2354C9.61306 19.4248 10.1028 19.5075 10.5538 19.4995C11.9941 19.4737 13.3547 18.8558 14.298 17.8029C14.5928 17.4738 14.8415 17.0576 15.1207 16.44C15.4012 15.8192 15.7019 15.0199 16.1113 13.9307L18.4258 7.77705C18.6563 7.16369 18.3335 6.47473 17.6818 6.24505C17.0256 6.01381 16.3106 6.34493 16.0781 6.96332L15.1403 9.4582L14.396 9.18225L16.084 4.69148C16.3146 4.07812 15.9918 3.38916 15.3401 3.15948C14.6839 2.92824 13.9688 3.25936 13.7364 3.87775L12.0483 8.36852L11.304 8.09258L13.7423 1.60591C13.9729 0.992544 13.6501 0.303589 12.9983 0.073906Z" fill="#131B31" />
              </svg></span>
            </div>
          </div>
          <p className="font-medium leading-[1.4] relative text-[16px] sm:text-[18px] lg:text-[20px] text-[#131b31] text-nowrap tracking-[-0.16px] sm:tracking-[-0.18px] lg:tracking-[-0.2px] whitespace-pre">
            Welcome - Here's What's New
          </p>
        </div>

        {/* Stats Grid */}
        <StatsGrid />

        {/* Action Cards */}
        <ActionCards />

        {/* Bottom Section - Chart and Table */}
        <div className="flex flex-col xl:flex-row gap-4 sm:gap-5 items-start relative w-full">
          <ChartSection />
          <InvoicesTable />
        </div>
      </motion.div>
    </motion.div>
  )
}

export default DashboardPage
