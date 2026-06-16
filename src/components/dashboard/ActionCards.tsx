import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
    ArrowUpRight,
    BookOpen,
    Code,
    CreditCard,
    FlaskConical,
    Paintbrush,
    Palette,
    Plus,
    SlidersHorizontal,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Skeleton } from '@/components/ui/skeleton'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
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

const quickActivity = [
    ['PAN Verify', 'txn_8x21', 'Success', '\u20b90.85'],
    ['Aadhaar OTP', 'txn_8x20', 'Success', '\u20b91.20'],
    ['Bank Verify', 'txn_8x1f', 'Failed', '\u20b90.00'],
    ['GST Verify', 'txn_8x1e', 'Success', '\u20b92.40'],
]

const barHeights = [60, 82, 70, 108, 87, 114, 133, 95, 124, 143, 130, 150]

const ActionCards = () => {
    const navigate = useNavigate()
    const { data: onboardingStatus } = useOnboardingStatus()
    const isProduction = Boolean(onboardingStatus?.is_onboarded)
    const { data, loading, error } = useUsageCredits()
    const handleRecharge = () => {
        navigate('/billing')
    }
    const handleStartTesting = () => navigate('/api-testing')
    const handleOpenDocs = () =>
        window.open('https://idtoai.readme.io/reference/idtoai-verification-apis', '_blank', 'noopener,noreferrer')
    const handleStartCustomizing = () =>
        window.open('https://idto.ai/demo', '_blank', 'noopener,noreferrer')

    if (!isProduction) {
        return (
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="w-full rounded-[22px] border border-[#e4e7ec] bg-white p-5 shadow-[0_2px_5px_rgba(19,27,49,0.04)]"
            >
                <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase leading-[15px] tracking-[1.6px] text-[#5e6a7a]">
                        Quick Access
                    </p>
                    <h2 className="mt-1 text-[24px] font-bold leading-8 tracking-[-0.6px] text-[#091123]">
                        Jump back in
                    </h2>
                    <p className="mt-1 text-[14px] font-normal leading-5 text-[#5e6a7a]">
                        Live previews of what's happening across your workspace.
                    </p>
                </div>

                <div className="grid gap-4 xl:grid-cols-3">
                    <article className="min-h-[304.73px] rounded-[17.581px] border-[0.879px] border-[#dfe5ed] bg-white p-[18.46px]">
                        <div className="flex w-full items-center justify-between pb-[14.065px]">
                            <div className="inline-flex items-center gap-[7.032px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[1.2306px] text-[#5e6a7a]">
                                <span className="size-[5.274px] rounded-full bg-[#00e59e]" />
                                Recharge
                            </div>
                            <ArrowUpRight className="size-[14.065px] text-[#5e6a7a]" />
                        </div>
                        <h3 className="mb-[16.262px] text-[13.185px] font-bold leading-[19.778px] text-[#091123]">
                            Add credits to your wallet
                        </h3>
                        <div className="flex flex-col gap-[21px]">
                          <div className="rounded-[14.065px] bg-[#fff2d0] px-[14.065px] pb-[14.065px] pt-[13.185px]">
                            <p className="text-[9.669px] font-bold uppercase leading-[14.504px] tracking-[0.4835px] text-[#5e6a7a]">
                                Current Balance
                            </p>
                            <p className="pt-[1.758px] text-[26.371px] font-bold leading-[31.645px] tracking-[-0.6593px] text-[#f09c17]">
                                {'\u20b9'}739.22
                            </p>
                            <p className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">
                                {'\u2248'} 1,478 verifications remaining
                            </p>
                          </div>
                          <div className="grid h-[33.403px] grid-cols-3 gap-[7.032px]">
                            <button className="flex items-center justify-center rounded-[10.548px] border-[0.879px] border-[#dfe5ed] bg-white text-[12.306px] font-normal leading-[17.581px] text-[#091123]">{'\u20b9'}1,000</button>
                            <button className="flex items-center justify-center rounded-[10.548px] border-[0.879px] border-[#f09c17] bg-[#fff2d0] text-[12.306px] font-normal leading-[17.581px] text-[#f09c17]">{'\u20b9'}5,000</button>
                            <button className="flex items-center justify-center rounded-[10.548px] border-[0.879px] border-[#dfe5ed] bg-white text-[12.306px] font-normal leading-[17.581px] text-[#091123]">{'\u20b9'}10,000</button>
                          </div>
                          <button
                              onClick={handleRecharge}
                              className="inline-flex w-full items-center justify-center gap-[7.032px] rounded-[10.548px] bg-[#f09c17] py-[8.79px] text-[12.306px] font-normal leading-[17.581px] text-[#fcfcfc]"
                          >
                              Recharge now
                              <Plus className="size-[12.306px]" />
                          </button>
                        </div>
                    </article>

                    <article className="min-h-[304.73px] rounded-[17.581px] border-[0.879px] border-[#dfe5ed] bg-white p-[18.46px]">
                        <div className="flex w-full items-center justify-between pb-[14.065px]">
                            <div className="inline-flex items-center gap-[7.032px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[1.2306px] text-[#5e6a7a]">
                                <span className="size-[5.274px] rounded-full bg-[#0019ff]" />
                                Analytics
                            </div>
                            <ArrowUpRight className="size-[14.065px] text-[#5e6a7a]" />
                        </div>
                        <h3 className="mb-[16.262px] text-[13.185px] font-bold leading-[19.778px] text-[#091123]">
                            {'Verification volume \u2014 last 12 months'}
                        </h3>
                        <div className="flex h-[150px] items-end justify-center gap-[5.274px]">
                            {barHeights.map((height, index) => (
                                <div
                                    key={height + index}
                                    className={`min-w-px flex-1 rounded-t-[8.79px] ${index === barHeights.length - 1 ? 'bg-[#f09c17]' : 'bg-[#fff2d0]'}`}
                                    style={{ height }}
                                />
                            ))}
                        </div>
                        <div className="mt-4 flex items-center justify-between">
                            <div>
                                <p className="text-[14.065px] font-bold leading-[21.097px] text-[#091123]">
                                    +24.6%
                                </p>
                                <p className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">
                                    vs. previous period
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[14.065px] font-bold leading-[21.097px] text-[#091123]">
                                    12,408
                                </p>
                                <p className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">
                                    total verifications
                                </p>
                            </div>
                        </div>
                    </article>

                    <article className="min-h-[304.73px] rounded-[17.581px] border-[0.879px] border-[#dfe5ed] bg-white p-[18.46px]">
                        <div className="flex w-full items-center justify-between pb-[14.065px]">
                            <div className="inline-flex items-center gap-[7.032px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[1.2306px] text-[#5e6a7a]">
                                <span className="size-[5.274px] rounded-full bg-[#00e59e]" />
                                Transactions
                            </div>
                            <ArrowUpRight className="size-[14.065px] text-[#5e6a7a]" />
                        </div>
                        <h3 className="mb-[16.262px] text-[13.185px] font-bold leading-[19.778px] text-[#091123]">
                            Recent activity
                        </h3>
                        <div className="flex flex-col gap-[7.032px]">
                            {quickActivity.map(([name, txn, status, amount]) => (
                                <div key={txn} className="grid h-[47.065px] grid-cols-[1fr_auto_auto] items-center gap-[10.548px]">
                                    <div>
                                        <p className="text-[12.306px] font-normal leading-[17.581px] text-[#091123]">{name}</p>
                                        <p className="text-[9.669px] font-normal leading-[14.504px] text-[#5e6a7a]">{txn}</p>
                                    </div>
                                    <span className={`rounded-full px-[7.032px] py-[1.758px] text-[8.79px] font-bold uppercase leading-[13.185px] ${status === 'Success' ? 'bg-[#ddfcef] text-[#007a55]' : 'bg-[#fef2f2] text-[#e7000b]'}`}>
                                        {status}
                                    </span>
                                    <span className="text-[12.306px] font-normal leading-[17.581px] text-[#091123]">{amount}</span>
                                </div>
                            ))}
                        </div>
                    </article>

                    <article className="h-[230.831px] rounded-[17.581px] border-[0.879px] border-[#dfe5ed] bg-white p-[18.46px]">
                        <div className="flex w-full items-center justify-between pb-[14.065px]">
                            <div className="inline-flex items-center gap-[7.032px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[1.2306px] text-[#5e6a7a]">
                                <span className="size-[5.274px] rounded-full bg-[#0019ff]" />
                                Billing
                            </div>
                            <ArrowUpRight className="size-[14.065px] text-[#5e6a7a]" />
                        </div>
                        <h3 className="mb-[16.262px] text-[13.185px] font-bold leading-[19.778px] text-[#091123]">May 2026 invoice</h3>
                        <div className="flex flex-col gap-[10.548px] pb-[9.23px]">
                          <div className="rounded-[14.065px] border-[0.879px] border-[#dfe5ed] p-[14.944px]">
                            <div className="flex items-center justify-between">
                                <span className="text-[12.306px] font-normal leading-[17.581px] text-[#091123]">INV-00012</span>
                                <span className="rounded-full bg-[#fff0c5] px-[7.032px] py-[1.758px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[0.2198px] text-[#bb4d00]">Sandbox</span>
                            </div>
                            <p className="pt-[5.274px] text-[21.097px] font-bold leading-[28.129px] tracking-[-0.5274px] text-[#091123]">{'\u20b9'}0.00</p>
                            <p className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">Due Jun 12, 2026</p>
                          </div>
                          <div className="flex items-center justify-between">
                              <span className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">3 invoices this quarter</span>
                              <button className="inline-flex items-center gap-[3.516px] text-[10.548px] font-normal leading-[14.065px] text-[#f09c17]">
                                View all
                                <ArrowUpRight className="size-[10.548px]" />
                              </button>
                          </div>
                        </div>
                    </article>

                    <article className="h-[230.831px] rounded-[17.581px] border-[0.879px] border-[#dfe5ed] bg-white p-[18.46px]">
                        <div className="flex w-full items-center justify-between pb-[14.065px]">
                            <div className="inline-flex items-center gap-[7.032px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[1.2306px] text-[#5e6a7a]">
                                <span className="size-[5.274px] rounded-full bg-[#0019ff]" />
                                API Testing
                            </div>
                            <ArrowUpRight className="size-[14.065px] text-[#5e6a7a]" />
                        </div>
                        <h3 className="mb-[16.262px] text-[13.185px] font-bold leading-[19.778px] text-[#091123]">
                            Try an endpoint live
                        </h3>
                        <div className="flex h-[131px] flex-col gap-5">
                          <div className="h-[79px] overflow-hidden rounded-[14.065px] bg-[#fbfcfe] px-[10.548px] pb-[10.548px] pt-[9.669px] font-mono">
                              <p className="pb-[0.774px] text-[8.615px] font-normal leading-[15.717px] text-[#00d492]">POST</p>
                              <p className="h-[15.717px] text-[9.669px] font-normal leading-[15.717px] text-black/70">/v1/verify/pan</p>
                              <p className="pb-[0.774px] pt-[4.395px] text-[9.669px] font-normal leading-[15.717px] text-black/40">{'{ "pan": "ABCDE1234F" }'}</p>
                          </div>
                          <button
                              onClick={handleStartTesting}
                              className="inline-flex w-full items-center justify-center gap-[7.032px] rounded-[10.548px] border-[0.879px] border-[#f09c17] bg-[#fff2d0] px-[0.879px] py-[7.911px] text-[12.306px] font-normal leading-[17.581px] text-[#f09c17]"
                          >
                              <FlaskConical className="size-[12.306px]" />
                              Open API console
                          </button>
                        </div>
                    </article>

                    <article className="h-[230.831px] rounded-[17.581px] border-[0.879px] border-[#dfe5ed] bg-white p-[18.46px]">
                        <div className="flex w-full items-center justify-between pb-[14.065px]">
                            <div className="inline-flex items-center gap-[7.032px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[1.2306px] text-[#5e6a7a]">
                                <span className="size-[5.274px] rounded-full bg-[#00e59e]" />
                                Branding
                            </div>
                            <ArrowUpRight className="size-[14.065px] text-[#5e6a7a]" />
                        </div>
                        <h3 className="mb-[16.262px] text-[13.185px] font-bold leading-[19.778px] text-[#091123]">
                            Bring your brand to life
                        </h3>
                        <div className="flex flex-col gap-[10.548px]">
                          <div className="overflow-hidden rounded-[14.065px] bg-[#fff2d0] p-[14.065px]">
                            <div className="flex items-center gap-[7.032px] pb-[6.153px]">
                                <div className="grid size-[24.613px] place-items-center rounded-[8.79px] bg-[rgba(240,156,23,0.2)]">
                                    <span className="text-[10.548px] font-bold leading-[14.065px] text-[#f09c17]">A</span>
                                </div>
                                <span className="text-[12.306px] font-bold leading-[17.581px] text-black">Brand Logo</span>
                            </div>
                            <div className="h-[5.274px] overflow-hidden rounded-full bg-[rgba(240,156,23,0.2)]">
                                <div className="h-full w-[60%] rounded-full bg-[#f09c17]" />
                            </div>
                            <p className="mt-[4.395px] text-[9.669px] font-normal leading-[14.504px] text-black/80">60% customized</p>
                          </div>
                          <button
                              onClick={handleStartCustomizing}
                              className="inline-flex w-full items-center justify-center gap-[7.032px] rounded-[10.548px] border-[0.879px] border-[#dfe5ed] px-[0.879px] py-[7.911px] text-[12.306px] font-normal leading-[17.581px] text-[#091123]"
                          >
                              <Palette className="size-[12.306px]" />
                              Customize SDK
                          </button>
                        </div>
                    </article>
                </div>
            </motion.section>
        )
    }

    const renderBalanceValue = () => {
        if (loading) return <Skeleton className="h-8 w-24" />
        if (error) {
            return <p className="text-xs sm:text-sm text-red-600">{typeof error === 'string' ? error : 'Balance unavailable'}</p>
        }

        const balance = data?.balance ?? 0
        return (
            <p className="font-medium text-[28px] lg:text-[32px] text-[#0019ff] tracking-[-0.32px]">
                {'\u20b9'}{balance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>
        )
    }

    const cards: ActionCardConfig[] = [
        {
            id: 'balance',
            title: 'Current Balance',
            description: 'Add funds to your account to continue using verification services without interruptions.',
            variant: 'balance',
            icon: <CreditCard className="size-8 text-[#0019ff]" />,
            button: { label: 'Recharge Now', icon: Plus, action: handleRecharge },
            renderValue: renderBalanceValue
        },
        {
            id: 'testing',
            title: 'API Testing',
            description: 'Run and validate your integrations in the sandbox environment - risk-free.',
            variant: 'default',
            icon: <Code className="size-8 text-[#0019ff]" />,
            button: { label: 'Start Testing', icon: Code, action: handleStartTesting }
        },
        {
            id: 'docs',
            title: 'API Documentation',
            description: 'Explore every endpoint, payload, and response with ready-to-try recipes.',
            variant: 'default',
            icon: <BookOpen className="size-8 text-[#0019ff]" />,
            button: { label: 'Open Doc', icon: BookOpen, action: handleOpenDocs }
        },
        {
            id: 'branding',
            title: 'Bring Your Brand to Life',
            description:
                'Personalize the SDK with your logo, colors, and messaging. Preview every flow and make it feel 100% yours.',
            variant: 'promo',
            icon: <Paintbrush className="size-8 text-[#b47d1f]" />,
            button: { label: 'Start Customizing', icon: SlidersHorizontal, action: handleStartCustomizing }
        }
    ]

    const renderButton = (card: ActionCardConfig) => (
        <button
            type="button"
            onClick={card.button.action}
            className={`flex h-10 w-full items-center justify-center gap-2 rounded-lg px-3 text-[12px] font-medium tracking-[-0.12px] ${
                card.variant === 'promo' ? 'bg-[#fff7ea] text-[#b47d1f]' : 'border border-[#e7e8ea] bg-[#e6e8ff] text-[#0019ff]'
            }`}
        >
            <span>{card.button.label}</span>
            {card.button.icon && <card.button.icon className="size-4" />}
        </button>
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
                    className={`flex h-full flex-col justify-between gap-6 rounded-2xl border border-[#e7e8ea] p-4 ${
                        card.variant === 'promo' ? 'bg-[#fffaf0]' : card.variant === 'balance' ? 'bg-[#f7f8ff]' : 'bg-white'
                    }`}
                >
                    <div className="flex flex-col gap-4">
                        {card.icon}
                        <div className="flex flex-col gap-2">
                            <p className={`text-[12px] font-[500] tracking-[-0.12px] ${card.variant === 'promo' ? 'text-[#b47d1f]' : 'text-[#0019FF]'}`}>{card.title}</p>
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
                </motion.div>
            ))}
        </motion.div>
    )
}

export default ActionCards
