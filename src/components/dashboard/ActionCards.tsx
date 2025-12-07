import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { BookOpen, Code, FileText, Plus, SlidersHorizontal } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Skeleton } from '@/components/ui/skeleton'
import { useUsageCredits } from '@/hooks/useUsageCredits'

type CardButton = {
    label: string
    icon?: LucideIcon
    action: () => void
}

type ActionCardConfig = {
    id: string
    title: string
    description: string
    icon?: React.ReactNode
    variant: 'balance' | 'default' | 'promo'
    button: CardButton
    renderValue?: () => React.ReactNode
}

const promoIllustration = '/mock_mobile.png'


const ActionCards = () => {
    const navigate = useNavigate()
    const { data, loading, error } = useUsageCredits()
    const handleRecharge = () => {
        navigate('/billing')
    }
    const handleStartTesting = () => navigate('/api-testing')
    const handleOpenDocs = () =>
        window.open('https://idtoai.readme.io/reference/idtoai-verification-apis', '_blank', 'noopener,noreferrer')
    const handleStartCustomizing = () =>
        window.open('https://idto.ai/demo', '_blank', 'noopener,noreferrer')

    const renderBalanceValue = () => {
        if (loading) return <Skeleton className="h-8 w-24" />
        if (error) {
            return <p className="text-xs sm:text-sm text-red-600">{typeof error === 'string' ? error : 'Balance unavailable'}</p>
        }

        const balance = data?.balance ?? 0
        return (
            <p className="font-medium text-[28px] lg:text-[32px] text-[#0019ff] tracking-[-0.32px]">
                ₹{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        )
    }

    const cards: ActionCardConfig[] = [
        {
            id: 'balance',
            title: 'Current Balance',
            description: 'Add funds to your account to continue using verification services without interruptions.',
            variant: 'balance',
            button: { label: 'Recharge Now', icon: Plus, action: handleRecharge },
            renderValue: renderBalanceValue
        },
        {
            id: 'testing',
            title: 'API Testing',
            description: 'Run and validate your integrations in the sandbox environment—risk-free.',
            variant: 'default',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="29" viewBox="0 0 32 29" fill="none">
                    <path d="M30.1667 27.25V1H1V27.25L30.1667 27.25Z" stroke="#0019FF" stroke-width="2" stroke-linejoin="round" />
                    <path d="M9.75033 9.74967L10.699 9.43345L10.4711 8.74967H9.75033V9.74967ZM8.29199 9.74967V8.74967H7.51122L7.32185 9.50714L8.29199 9.74967ZM16.3128 9.74967V8.74967H15.3128V9.74967H16.3128ZM9.75033 9.74967V8.74967H8.29199V9.74967V10.7497H9.75033V9.74967ZM8.29199 9.74967L7.32185 9.50714L5.86352 15.3405L6.83366 15.583L7.8038 15.8255L9.26213 9.99221L8.29199 9.74967ZM6.83366 15.583L5.86352 15.3405L5.13435 18.2571L6.10449 18.4997L7.07463 18.7422L7.8038 15.8255L6.83366 15.583ZM9.75033 9.74967L8.80164 10.0659L10.7461 15.8992L11.6948 15.583L12.6435 15.2668L10.699 9.43345L9.75033 9.74967ZM11.6948 15.583L10.7461 15.8992L11.7183 18.8159L12.667 18.4997L13.6157 18.1834L12.6435 15.2668L11.6948 15.583ZM6.83366 15.583V16.583H11.6948V15.583V14.583H6.83366V15.583ZM16.3128 9.74967V10.7497H19.2295V9.74967V8.74967H16.3128V9.74967ZM16.3128 9.74967H15.3128V14.1247H16.3128H17.3128V9.74967H16.3128ZM16.3128 14.1247H15.3128V18.4997H16.3128H17.3128V14.1247H16.3128ZM19.2295 14.1247V13.1247H16.3128V14.1247V15.1247H19.2295V14.1247ZM21.417 11.9372H20.417C20.417 12.593 19.8853 13.1247 19.2295 13.1247V14.1247V15.1247C20.9899 15.1247 22.417 13.6976 22.417 11.9372H21.417ZM19.2295 9.74967V10.7497C19.8853 10.7497 20.417 11.2813 20.417 11.9372H21.417H22.417C22.417 10.1768 20.9899 8.74967 19.2295 8.74967V9.74967ZM25.0628 9.02051H24.0628V19.2288H25.0628H26.0628V9.02051H25.0628Z" fill="#0019FF" />
                </svg>
            ),
            button: { label: 'Start Testing', icon: Code, action: handleStartTesting }
        },
        {
            id: 'docs',
            title: 'API Documentation',
            description: 'Explore every endpoint, payload, and response with ready-to-try recipes.',
            variant: 'default',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="30" height="32" viewBox="0 0 30 32" fill="none">
                    <path d="M26.9792 1.42519C26.9792 0.638079 26.3434 0 25.5592 0H10.7715L0 10.8112V29.929C0 30.7161 0.635737 31.3542 1.41996 31.3542H11.3211V28.5039H2.83976V12.8268H12.7795L12.7795 2.85044H24.1391V17.1355H26.9792V1.42519Z" fill="#0019FF" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M25.7715 25.9482L22.4277 22.6044L24.4901 20.542L29.8963 25.9482L24.4901 31.3544L22.4277 29.292L25.7715 25.9482Z" fill="#0019FF" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16.7705 25.9482L20.1143 22.6044L18.0519 20.542L12.6457 25.9482L18.0519 31.3544L20.1143 29.292L16.7705 25.9482Z" fill="#0019FF" />
                </svg>
            ),
            button: { label: 'Open Doc', icon: BookOpen, action: handleOpenDocs }
        },
        {
            id: 'branding',
            title: 'Bring Your Brand to Life',
            description:
                'Personalize the SDK with your logo, colors, and messaging. Preview every flow and make it feel 100% yours.',
            variant: 'promo',
            button: { label: 'Start Customizing', icon: SlidersHorizontal, action: handleStartCustomizing }
        }
    ]

    const renderButton = (card: ActionCardConfig) => {
        // const isBalance = card.variant === 'balance1'
        const isBalance = false
        const isPromo = card.variant === 'promo'

        if (isPromo) {
            return (
                <button
                    type="button"
                    onClick={card.button.action}
                    className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#fff7ea] text-[12px] font-medium tracking-[-0.12px] text-[#b47d1f]"
                >
                    <span>{card.button.label}</span>
                    {card.button.icon && <card.button.icon className="size-4 text-[#b47d1f]" />}
                </button>
            )
        }

        const wrapperClasses = [
            'h-10 w-full rounded-lg border border-[#e7e8ea]',
            !isBalance ? 'bg-[#e6e8ff]' : ''
        ]
            .filter(Boolean)
            .join(' ')

        const buttonClasses = [
            'flex h-10 w-full items-center justify-center gap-2 rounded-lg px-3 text-[12px] font-medium tracking-[-0.12px]',
            isBalance ? 'text-white' : 'text-[#0019ff]'
        ]
            .filter(Boolean)
            .join(' ')

        const backgroundStyle = isBalance
            ? {
                backgroundImage:
                    "url('data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' viewBox=\\'0 0 229.5 40\\' preserveAspectRatio=\\'none\\'><g transform=\\'matrix(4.883 -6.5519e-16 2.4069e-15 4.7 114.75 20)\\'><foreignObject x=\\'-446.5\\' y=\\'-446.5\\' width=\\'893\\' height=\\'893\\'><div xmlns=\\'http://www.w3.org/1999/xhtml\\' style=\\'background-image: conic-gradient(from 90deg, rgba(138, 149, 255, 1) 0%, rgba(104, 118, 255, 1) 25%, rgba(69, 87, 255, 1) 50%, rgba(35, 56, 255, 1) 75%, rgba(17, 41, 255, 1) 87.5%, rgba(0, 25, 255, 1) 100%); opacity:1; height: 100%; width: 100%;\\'></div></foreignObject></g></svg>')"
            }
            : {}

        return (
            <div className={wrapperClasses} style={backgroundStyle}>
                <button
                    type="button"
                    onClick={card.button.action}
                    className={buttonClasses}
                >
                    <>
                        <span>{card.button.label}</span>
                        {card.button.icon && <card.button.icon className={`size-4 ${isBalance ? 'text-white' : 'text-[#0019ff]'}`} />}
                    </>
                </button>
            </div>
        )
    }

    const renderPromoCard = (card: ActionCardConfig) => (
        <div className="flex h-full flex-col rounded-2xl border border-[#e7e8ea] bg-white">
            <div className="relative h-[48px] w-full overflow-hidden rounded-t-2xl bg-[#fff7ea]" style={{ minHeight: '48px' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-[#fff0d9] via-[#fff7ea] to-[#f8fffb]" />
                {/* {promoEllipses.map((ellipse) => (
                    <img
                        key={ellipse.src}
                        src={ellipse.src}
                        alt=""
                        aria-hidden
                        className="absolute h-[26px] w-[26px]"
                        style={ellipse.style}
                    />
                ))} */}
                <img
                    src={promoIllustration}
                    alt="SDK preview"
                    className="absolute right-4 -top-2 w-[110px] drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)]"
                    loading="lazy"
                />
            </div>
            <div className="flex flex-1 flex-col gap-4 rounded-b-2xl p-4">
                <div className="flex flex-col gap-3">
                    <p className="text-[12px] font-medium tracking-[-0.12px] text-[#b47d1f]">{card.title}</p>
                    <p className="text-[12px] leading-[1.4] text-[#9296a0]">{card.description}</p>
                </div>
                <div className="mt-auto">{renderButton(card)}</div>
            </div>
        </div>
    )

    const renderDefaultCard = (card: ActionCardConfig) => (
        <div
            className={`flex h-full flex-col justify-between gap-6 rounded-2xl border border-[#e7e8ea] p-4 ${card.variant === 'balance' ? 'bg-[#f7f8ff]' : 'bg-white'
                }`}
        >
            <div className="flex flex-col gap-4">
                {card.icon}
                <div className="flex flex-col gap-2">
                    <p className="text-[12px] font-[500] tracking-[-0.12px] text-[#0019FF]">{card.title}</p>
                    {card.renderValue ? (
                        <>
                            {card.renderValue()}
                            <p className="text-[12px] leading-[1.4] text-[#9296a0]">{card.description}</p>
                        </>
                    ) : (
                        <p className="text-[12px] leading-[1.4] text-[#9296a0]">{card.description}</p>
                    )}
                </div>
            </div>
            {renderButton(card)}
        </div>
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="grid w-full gap-4 lg:grid-cols-4"
        >
            {cards.map((card, index) => (
                <motion.div
                    key={card.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                    className="h-full"
                >
                    {card.variant === 'promo' ? renderPromoCard(card) : renderDefaultCard(card)}
                </motion.div>
            ))}
        </motion.div>
    )
}

export default ActionCards

