import { useState } from 'react'
import { useIsMobile } from '@/hooks/use-mobile'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useOnboardingSteps } from '@/hooks/useOnboardingSteps'
import { useUserProfile } from '@/hooks/useUserProfile'
import { getAccessToken } from '@/lib/auth'
import { BadgeCheck, Building2, Check, Clock3, Landmark, Lock, MoveRight, RotateCcw, ShieldCheck, Sparkles, UserRoundCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TermsOfServiceModal from '@/components/modals/TermsOfServiceModal'
import idtoProductionLogo from '@/assets/idto-production-logo.svg'

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

const SwitchToProductionMobilePage = () => {
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const token = getAccessToken()
    const { data: onboardingStatus } = useOnboardingStatus({ enabled: Boolean(token) })
    const stepsStatus = useOnboardingSteps()
    const { data: userProfile } = useUserProfile()
    const isProprietorship = userProfile?.entity_type === 'proprietorship'
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false)
    const [agreedToTerms, setAgreedToTerms] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const isProduction = Boolean(onboardingStatus?.is_onboarded)

    // Redirect if not mobile or if in production
    if (!isMobile || isProduction) {
        return null
    }

    // Get user initials for avatar
    const getUserInitials = () => {
        if (userProfile?.name) {
            const names = userProfile.name.split(' ')
            if (names.length >= 2) {
                return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
            }
            return userProfile.name.substring(0, 2).toUpperCase()
        }
        return 'U'
    }

    const handleStartVerification = async () => {
        if (!agreedToTerms) {
            return
        }

        setIsLoading(true)
        // Determine the first incomplete step
        let firstIncompleteStep = 'basic-details'

        if (!stepsStatus.basicDetails) {
            firstIncompleteStep = 'basic-details'
        } else if (!stepsStatus.businessInfo) {
            firstIncompleteStep = 'business-info'
        } else if (!stepsStatus.businessPAN || (!isProprietorship && !stepsStatus.gstin)) {
            firstIncompleteStep = 'pan-gst'
        } else {
            firstIncompleteStep = 'director-kyc'
        }

        // Navigate to the first incomplete step
        navigate(`/switch-to-production-mobile/${firstIncompleteStep}`)
        setIsLoading(false)
    }

    return (
        <div className="min-h-screen w-full bg-white flex flex-col gap-8 p-5">
            {/* Header with Logo and Avatar */}
            <div className="flex items-center justify-between px-0 py-1.5">
                <img src={idtoProductionLogo} alt="idto.ai" className="h-8 w-[57px]" />
                <div className="flex items-center rounded-[132px]">
                    <div className="bg-[#E6E8FF] flex flex-col items-center justify-center size-8 rounded-full">
                        <p className="font-medium leading-[20px] text-[14px] text-[#0019FF] text-center tracking-[-0.14px]">
                            {getUserInitials()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-col gap-6 items-center w-full">
                <section className="w-full overflow-hidden rounded-[20px] border border-[#e0e5eb] bg-white shadow-[0_8px_24px_-12px_rgba(0,0,0,0.14)]">
                    <div className="bg-[linear-gradient(120deg,#1740cc_0%,#0766ee_45%,#0088e0_62%,#00d9a7_100%)] px-5 py-6 text-white">
                        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#e5f2ff] px-3 py-1 text-[11px] leading-4 text-[#1034b1]">
                            <Sparkles className="size-3" />
                            AI-native identity
                        </div>
                        <h1 className="text-[32px] font-bold leading-[38px] tracking-[-0.32px]">
                            Verify smarter. Decide faster.
                        </h1>
                        <p className="mt-3 text-[14px] leading-5 text-white/90">
                            DigiLocker-first KYC. No paper. No follow-ups. Your team is approved in 24 business hours.
                        </p>
                        <div className="mt-6 flex flex-col gap-4">
                            {productionHighlights.map((item) => (
                                <div key={item.title} className="flex gap-3 text-left">
                                    <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15">
                                        <item.icon className="size-3.5" />
                                    </span>
                                    <span>
                                        <span className="block text-[14px] leading-5">{item.title}</span>
                                        <span className="block text-[12px] leading-[18px] text-white/80">{item.description}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="px-5 py-6 text-left">
                        <h2 className="text-[20px] font-bold leading-[30px] tracking-[-0.2px] text-[#0c121a]">
                            Here's what we'll need
                        </h2>
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
                                        <span className="block text-[12px] leading-[18px] text-[#6a727d]">{item.description}</span>
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
                </section>

                {/* Terms and Button Section */}
                <div className="flex flex-col gap-4 items-center justify-end w-full">
                    {/* Terms of Service */}
                    <div className="flex gap-1 items-start w-full">
                        <div className="flex items-start pt-0.5 px-0 pb-0 self-stretch shrink-0">
                            <input
                                type="checkbox"
                                checked={agreedToTerms}
                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                className="size-4 rounded border-[#616675] text-[#0019ff] focus:ring-[#0019ff]"
                            />
                        </div>
                        <p className="font-medium text-left leading-[20px] text-[14px] text-[#616675] tracking-[-0.14px]">
                            <span>By Continuing, you agree to our </span>
                            <button
                                type="button"
                                onClick={() => setIsTermsModalOpen(true)}
                                className="text-[#8a95ff] underline hover:opacity-80"
                            >
                                Terms of Service
                            </button>
                            <span> and </span>
                            <button
                                type="button"
                                onClick={() => setIsTermsModalOpen(true)}
                                className="text-[#8a95ff] underline hover:opacity-80"
                            >
                                Privacy Policy.
                            </button>
                            <span className="text-[#616675]"> Your data is always encrypted and secure.</span>
                        </p>
                    </div>

                    {/* Start Verification Button */}
                    <button
                        onClick={handleStartVerification}
                        disabled={!agreedToTerms || isLoading}
                        className="flex h-12 w-full max-w-[353px] items-center justify-center gap-2 rounded-[8px] border border-[#e7e8ea] bg-[#E6E8FF] text-[12px] font-bold leading-[16px] text-[#0019FF] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 tracking-[-0.12px]"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-[#0019ff] border-t-transparent rounded-full animate-spin" />
                                <span>Starting...</span>
                            </>
                        ) : (
                            <>
                                Start Verification
                                <MoveRight className="size-4" strokeWidth={2} />
                            </>
                        )}
                    </button>
                </div>
            </div>

            <TermsOfServiceModal
                isOpen={isTermsModalOpen}
                onClose={() => setIsTermsModalOpen(false)}
            />
        </div>
    )
}

export default SwitchToProductionMobilePage
