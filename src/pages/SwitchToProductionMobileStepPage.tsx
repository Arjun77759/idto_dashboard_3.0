import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useIsMobile } from '@/hooks/use-mobile'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useOnboardingSteps } from '@/hooks/useOnboardingSteps'
import { useUserProfile } from '@/hooks/useUserProfile'
import { getAccessToken } from '@/lib/auth'
import StepForm from '@/components/modals/switchToProductionModal/components/StepForm'
import SignatoryChoiceForm from '@/components/modals/switchToProductionModal/components/SignatoryChoiceForm'

const SwitchToProductionMobileStepPage = () => {
    const { step } = useParams<{ step: string }>()
    const navigate = useNavigate()
    const isMobile = useIsMobile()
    const token = getAccessToken()
    const { data: onboardingStatus } = useOnboardingStatus({ enabled: Boolean(token) })
    const stepsStatus = useOnboardingSteps()
    const { data: userProfile } = useUserProfile()
    const [isLoading, setIsLoading] = useState(false)

    const isProduction = Boolean(onboardingStatus?.is_onboarded)
    const stepOrder = ['basic-details', 'business-info', 'pan-gst', 'director-kyc']

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



    // Validate step parameter
    useEffect(() => {
        if (step && !stepOrder.includes(step)) {
            navigate('/switch-to-production-mobile', { replace: true })
        }
    }, [step, navigate])

    if (!isMobile || isProduction || !step || !stepOrder.includes(step)) {
        return null
    }

    const currentStepIndex = stepOrder.indexOf(step)

    const handleNext = async () => {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 500))
        setIsLoading(false)

        // Move to next incomplete step
        const nextIndex = currentStepIndex + 1

        if (nextIndex < stepOrder.length) {
            navigate(`/switch-to-production-mobile/${stepOrder[nextIndex]}`)
        } else {
            // All steps completed - check if director KYC is done
            if (onboardingStatus?.is_onboarded) {
                navigate('/dashboard', { replace: true })
            } else {
                // Director KYC is the last step
                navigate('/switch-to-production-mobile/director-kyc')
            }
        }
    }

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            navigate(`/switch-to-production-mobile/${stepOrder[currentStepIndex - 1]}`)
        } else {
            // If on first step, go back to welcome screen
            navigate('/switch-to-production-mobile', { replace: true })
        }
    }

    // Logo SVG component
    const Logo = () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="57" height="32" viewBox="0 0 57 32" fill="none">
            <path d="M17.5745 20.5918H11.0039V27.4367H17.5745V20.5918Z" fill="#00E59E" />
            <path d="M17.5748 16.0283V9.1834H11.0042V4.62012H4.43359V20.5916H11.0042V16.0283H17.5748Z" fill="#0019FF" />
            <path d="M23.3594 9.37695C22.97 9.37695 22.6384 9.51956 22.3647 9.80159C22.0909 10.0868 21.957 10.429 21.957 10.8378C21.957 11.2466 22.0939 11.5889 22.3647 11.8741C22.6354 12.1561 22.967 12.2987 23.3594 12.2987C23.7518 12.2987 24.0803 12.1561 24.3541 11.8741C24.6248 11.592 24.7617 11.2466 24.7617 10.8378C24.7617 10.429 24.6248 10.0868 24.3541 9.80159C24.0803 9.51956 23.7518 9.37695 23.3594 9.37695Z" fill="#131B31" />
            <path d="M24.6403 13.2432H22.082V22.8736H24.6403V13.2432Z" fill="#131B31" />
            <path d="M35.1131 9.19922H32.5548V14.3678H32.494C32.2263 13.8861 31.8491 13.5153 31.3624 13.2523C30.8757 12.9893 30.2916 12.8593 29.6133 12.8593C28.7311 12.8593 27.9737 13.0653 27.3409 13.4773C26.7082 13.8893 26.2306 14.4723 25.899 15.2265C25.5705 15.9808 25.4062 16.8617 25.4062 17.8663C25.4062 18.8708 25.5766 19.736 25.9143 20.4902C26.2519 21.2444 26.7538 21.8306 27.417 22.2489C28.0801 22.6672 28.8832 22.8764 29.8292 22.8764C30.608 22.8764 31.2742 22.7211 31.8248 22.4105C32.3753 22.1 32.8134 21.6658 33.1419 21.1113H33.7899V22.6831H36.3785V20.0497H35.1161V9.19922H35.1131ZM32.5579 18.3004C32.5579 19.0071 32.3541 19.5617 31.9495 19.961C31.5449 20.3634 30.9973 20.5631 30.3099 20.5631C29.5281 20.5631 28.944 20.3222 28.5547 19.8405C28.1653 19.3589 27.9706 18.6997 27.9706 17.8663C27.9706 17.0328 28.1653 16.3737 28.5547 15.892C28.944 15.4103 29.5311 15.1695 30.3099 15.1695C30.9973 15.1695 31.5449 15.3692 31.9495 15.7716C32.3541 16.1741 32.5579 16.7255 32.5579 17.4321V18.3004Z" fill="#131B31" />
            <path d="M40.1978 15.3307H42.3089V13.2455H40.1674V10.3555H37.673V13.2455H36.0547V15.3307H37.6426V20.7559C37.6426 21.4721 37.8251 22.0045 38.1901 22.3531C38.5552 22.7017 39.0662 22.876 39.7233 22.876H42.5279V20.7908H40.2009V15.3339L40.1978 15.3307Z" fill="#131B31" />
            <path d="M51.8479 15.2012C51.4463 14.4534 50.8775 13.8734 50.1383 13.4678C49.3991 13.0622 48.5261 12.8594 47.5192 12.8594C46.5123 12.8594 45.618 13.0622 44.8696 13.4678C44.1183 13.8734 43.5434 14.4534 43.1357 15.2012C42.7312 15.9491 42.5273 16.8332 42.5273 17.8505C42.5273 18.8677 42.7342 19.7645 43.1449 20.5155C43.5555 21.2666 44.1335 21.8465 44.8788 22.2553C45.624 22.6673 46.5001 22.8732 47.504 22.8732C48.5078 22.8732 49.3869 22.6704 50.1292 22.2648C50.8744 21.8592 51.4463 21.2793 51.8479 20.525C52.2494 19.7708 52.4502 18.8867 52.4502 17.8695C52.4502 16.8522 52.2494 15.9554 51.8479 15.2044V15.2012ZM49.2744 19.8311C48.8637 20.3191 48.2736 20.5599 47.504 20.5599C46.7344 20.5599 46.126 20.3159 45.7092 19.8311C45.2925 19.343 45.0856 18.6839 45.0856 17.8505C45.0856 17.017 45.2925 16.3611 45.7092 15.8857C46.126 15.4104 46.7222 15.1727 47.504 15.1727C48.2857 15.1727 48.8637 15.4104 49.2744 15.8857C49.685 16.3611 49.8919 17.017 49.8919 17.8505C49.8919 18.6839 49.685 19.3462 49.2744 19.8311Z" fill="#131B31" />
        </svg>
    )

    // Calculate progress: 5 steps total
    // Map our 4 route steps to 5 progress indicators
    // Steps: 1. basic-details, 2. business-info, 3-4. pan-gst (PAN + GST combined), 5. director-kyc
    const getProgressStep = () => {
        if (step === 'basic-details') return 0 // Step 1 of 5 (fills first indicator)
        if (step === 'business-info') return 1 // Step 2 of 5 (fills first 2 indicators)
        if (step === 'pan-gst') return 3 // Steps 3-4 of 5 (fills first 4 indicators, since PAN+GST are combined)
        if (step === 'director-kyc') return 4 // Step 5 of 5 (fills all 5 indicators)
        return 0
    }

    const progressStep = getProgressStep()
    const totalSteps = 5

    return (
        <div className="h-screen w-full bg-white flex flex-col gap-8 p-5 overflow-y-auto">
            {/* Header with Logo and Avatar */}
            <div className="flex items-center justify-between px-0 py-1.5">
                <Logo />
                <div className="flex items-center rounded-[132px]">
                    <div className="bg-[#E6E8FF] flex flex-col items-center justify-center size-8 rounded-full">
                        <p className="font-medium leading-[20px] text-[14px] text-[#0019FF] text-center tracking-[-0.14px]">
                            {getUserInitials()}
                        </p>
                    </div>
                </div>
            </div>

            {/* Progress Indicator */}
            <div className="flex gap-1 h-1.5 items-center w-full">
                {Array.from({ length: totalSteps }).map((_, index) => (
                    <div
                        key={index}
                        className={`flex-1 h-1.5 rounded-[55px] ${index <= progressStep ? 'bg-[#0019FF]' : 'bg-[#d9d9d9]'
                            }`}
                    />
                ))}
            </div>

            {/* Step Form Content */}
            <div className="flex-1 flex flex-col min-h-0">
                {step === 'director-kyc' ? (
                    <SignatoryChoiceForm
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        isLoading={isLoading}
                    />
                ) : (
                    <StepForm
                        currentStep={step}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        showPrevious={true}
                        isLoading={isLoading}
                        initialData={onboardingStatus}
                        stepsStatus={stepsStatus}
                    />
                )}
            </div>
        </div>
    )
}

export default SwitchToProductionMobileStepPage

