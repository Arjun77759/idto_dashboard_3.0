import { motion } from 'framer-motion'
import WelcomeSection from '@/components/dashboard/WelcomeSection'
import StatsGrid from '@/components/dashboard/StatsGrid'
import ActionCards from '@/components/dashboard/ActionCards'
import ChartSection from '@/components/dashboard/ChartSection'
import InvoicesTable from '@/components/dashboard/InvoicesTable'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'

const DashboardPage = () => {
  const { data: onboardingStatus } = useOnboardingStatus()
  const showWelcomeSection = onboardingStatus ? !onboardingStatus.is_onboarded : true

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
