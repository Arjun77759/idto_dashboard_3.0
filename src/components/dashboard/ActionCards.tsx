import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { Plus, Code, FileText, BookOpen, SlidersHorizontal } from 'lucide-react'
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

const promoIllustration = 'http://localhost:3845/assets/30d61803687988d01c11fa90a65f5b6251081b07.png'
const promoEllipses = [
    {
        src: 'http://localhost:3845/assets/539b93a63edc520adec0433136d2c6cb165dce7c.svg',
        style: { left: '55%', top: '30px' }
    },
    {
        src: 'http://localhost:3845/assets/39a7d450570aea0e13ff334931d8527e4cbf9f2d.svg',
        style: { left: '65%', top: '12px' }
    },
    {
        src: 'http://localhost:3845/assets/cbe46a91bfef6aa3a6a123b716b9413b9d0abd51.svg',
        style: { left: '78%', top: '30px' }
    },
    {
        src: 'http://localhost:3845/assets/a0f8a4db0fd038289d969688ccc4ba42787b6c92.svg',
        style: { left: '88%', top: '14px' }
    },
    {
        src: 'http://localhost:3845/assets/af0c91faee4c1d50338bf729b67bfb0309775dd8.svg',
        style: { left: '78%', top: '4px' }
    }
] as const

const ActionCards = () => {
    const navigate = useNavigate()
    const { data, loading, error } = useUsageCredits()

    const handleRecharge = () => navigate('/billing')
    const handleStartTesting = () => navigate('/api-testing')
    const handleOpenDocs = () =>
        window.open('https://idtoai.readme.io/reference/idtoai-verification-apis', '_blank', 'noopener,noreferrer')
    const handleStartCustomizing = () =>
        window.open('https://idtoai.readme.io/docs/sdk-customization', '_blank', 'noopener,noreferrer')

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
                <div className="flex size-[35px] items-center justify-center rounded-xl border border-[#d4d7f9] bg-[#f4f5ff]">
                    <span className="text-[11px] font-semibold tracking-[0.4px] text-[#0019ff]">API</span>
                </div>
            ),
            button: { label: 'Start Testing', icon: Code, action: handleStartTesting }
        },
        {
            id: 'docs',
            title: 'API Documentation',
            description: 'Explore every endpoint, payload, and response with ready-to-try recipes.',
            variant: 'default',
            icon: (
                <div className="flex size-[35px] items-center justify-center rounded-xl border border-[#d4d7f9] bg-[#f4f5ff]">
                    <FileText className="size-4 text-[#0019ff]" />
                </div>
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
        const isBalance = card.variant === 'balance'
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
                <button type="button" onClick={card.button.action} className={buttonClasses}>
                    <span>{card.button.label}</span>
                    {card.button.icon && <card.button.icon className={`size-4 ${isBalance ? 'text-white' : 'text-[#0019ff]'}`} />}
                </button>
            </div>
        )
    }

    const renderPromoCard = (card: ActionCardConfig) => (
        <div className="flex h-full flex-col rounded-2xl border border-[#e7e8ea] bg-white">
            <div className="relative h-[48px] w-full overflow-hidden rounded-t-2xl bg-[#fff7ea]" style={{minHeight:'48px'}}>
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
                    <p className="text-[12px] font-medium tracking-[-0.12px] text-[#616675]">{card.title}</p>
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

