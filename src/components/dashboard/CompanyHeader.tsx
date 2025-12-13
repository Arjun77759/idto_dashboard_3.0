import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useUserProfile } from '@/hooks/useUserProfile'
import { motion } from 'framer-motion'

const CompanyHeader = () => {
  const { data: onboardingStatus } = useOnboardingStatus()
  const { data: userProfile, loading: profileLoading } = useUserProfile()
  const isProduction = Boolean(onboardingStatus?.is_onboarded)

  // Only show after KYC completion
  if (!isProduction) {
    return null
  }

  const companyName = userProfile?.brand_name || userProfile?.registered_name || ''

  if (!companyName && !profileLoading) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-0.5 items-start"
    >
      {profileLoading ? (
        <>
          <div className="h-7 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
        </>
      ) : (
        <>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#131b31] tracking-tight leading-tight">
            {companyName}
          </h1>
          <p className="text-xs sm:text-sm font-semibold text-[#616675] tracking-[0.1em] uppercase letter-spacing-wide">
            Live Data
          </p>
        </>
      )}
    </motion.div>
  )
}

export default CompanyHeader
