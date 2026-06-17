import { motion } from 'framer-motion'
import {
    ArrowUpRight,
    FlaskConical,
    Palette,
    Plus,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { Skeleton } from '@/components/ui/skeleton'
import { useOpenApiEndpoints } from '@/hooks/useOpenApiEndpoints'
import { useOnboardingStatus } from '@/hooks/useOnboardingStatus'
import { useRecentInvoices } from '@/hooks/useRecentInvoices'
import { useTransactions } from '@/hooks/useTransactions'
import { useUsageCredits } from '@/hooks/useUsageCredits'
import { useUsageOverview } from '@/hooks/useUsageOverview'
import { useUsageVolumeTimeseries } from '@/hooks/useUsageVolumeTimeseries'

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
    const { data: overviewData } = useUsageOverview()
    const { data: volumeData } = useUsageVolumeTimeseries(11)
    const { data: transactions } = useTransactions()
    const { data: invoices } = useRecentInvoices(3)
    const { data: apiEndpoints } = useOpenApiEndpoints()
    const handleRecharge = () => {
        navigate('/billing')
    }
    const handleStartTesting = () => navigate('/api-testing')
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

    const latestInvoice = invoices[0]
    const latestApi = apiEndpoints?.[0]
    const chartValues = volumeData.length > 0 ? volumeData.map((point) => point.count) : barHeights
    const maxChartValue = Math.max(...chartValues, 1)
    const liveActivity = transactions.slice(0, 4)
    const currentBalance = data?.balance ?? 0
    const totalVerifications = overviewData?.total_verifications?.count ?? 0
    const verificationChange = overviewData?.total_verifications?.change_percent ?? 0
    const verificationChangeLabel = `${verificationChange >= 0 ? '+' : ''}${verificationChange.toFixed(1)}%`
    const formatCurrency = (value: number | string | undefined) => {
        const numeric = typeof value === 'string' ? Number.parseFloat(value) : value
        return `\u20b9${Number.isFinite(numeric) ? Number(numeric).toLocaleString('en-IN', { maximumFractionDigits: 2 }) : '0'}`
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="w-full"
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
                        <div className="rounded-[14.065px] bg-[#e8f3ff] px-[14.065px] pb-[14.065px] pt-[13.185px]">
                            <p className="text-[9.669px] font-bold uppercase leading-[14.504px] tracking-[0.4835px] text-[#5e6a7a]">
                                Current Balance
                            </p>
                            {loading ? (
                                <Skeleton className="mt-2 h-8 w-28" />
                            ) : error ? (
                                <p className="pt-2 text-[11px] text-red-600">Balance unavailable</p>
                            ) : (
                                <p className="pt-[1.758px] text-[26.371px] font-bold leading-[31.645px] tracking-[-0.6593px] text-[#0019ff]">
                                    {formatCurrency(currentBalance)}
                                </p>
                            )}
                            <p className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">
                                Live wallet balance
                            </p>
                        </div>
                        <div className="grid h-[33.403px] grid-cols-3 gap-[7.032px]">
                            <button className="flex items-center justify-center rounded-[10.548px] border-[0.879px] border-[#dfe5ed] bg-white text-[12.306px] font-normal leading-[17.581px] text-[#091123]">{'\u20b9'}1,000</button>
                            <button className="flex items-center justify-center rounded-[10.548px] border-[0.879px] border-[#0019ff] bg-[#e8f3ff] text-[12.306px] font-normal leading-[17.581px] text-[#0019ff]">{'\u20b9'}5,000</button>
                            <button className="flex items-center justify-center rounded-[10.548px] border-[0.879px] border-[#dfe5ed] bg-white text-[12.306px] font-normal leading-[17.581px] text-[#091123]">{'\u20b9'}10,000</button>
                        </div>
                        <button
                            onClick={handleRecharge}
                            className="inline-flex w-full items-center justify-center gap-[7.032px] rounded-[10.548px] bg-[#0019ff] py-[8.79px] text-[12.306px] font-normal leading-[17.581px] text-[#fcfcfc]"
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
                        {'Verification volume - last 12 months'}
                    </h3>
                    <div className="flex h-[150px] items-end justify-center gap-[5.274px]">
                        {chartValues.slice(-12).map((value, index) => (
                            <div
                                key={`${value}-${index}`}
                                className={`min-w-px flex-1 rounded-t-[8.79px] ${index === chartValues.slice(-12).length - 1 ? 'bg-[#0019ff]' : 'bg-[#dce8ff]'}`}
                                style={{ height: Math.max(10, (value / maxChartValue) * 150) }}
                            />
                        ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                        <div>
                            <p className="text-[14.065px] font-bold leading-[21.097px] text-[#091123]">
                                {verificationChangeLabel}
                            </p>
                            <p className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">
                                vs. previous period
                            </p>
                        </div>
                        <div className="text-right">
                            <p className="text-[14.065px] font-bold leading-[21.097px] text-[#091123]">
                                {totalVerifications.toLocaleString('en-IN')}
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
                        {(liveActivity.length ? liveActivity : []).map((transaction) => (
                            <div key={transaction.trax_id} className="grid h-[47.065px] grid-cols-[1fr_auto] items-center gap-[10.548px]">
                                <div className="min-w-0">
                                    <p className="truncate text-[12.306px] font-normal leading-[17.581px] text-[#091123]">{transaction.api_name || 'API call'}</p>
                                    <p className="truncate text-[9.669px] font-normal leading-[14.504px] text-[#5e6a7a]">{transaction.trax_id}</p>
                                </div>
                                <span className={`rounded-full px-[7.032px] py-[1.758px] text-[8.79px] font-bold uppercase leading-[13.185px] ${transaction.status?.toLowerCase() === 'success' ? 'bg-[#ddfcef] text-[#007a55]' : 'bg-[#fef2f2] text-[#e7000b]'}`}>
                                    {transaction.status || 'Unknown'}
                                </span>
                            </div>
                        ))}
                        {!liveActivity.length && (
                            <p className="rounded-[12px] bg-[#f7f9fc] px-3 py-8 text-center text-[12px] text-[#5e6a7a]">
                                No recent activity yet
                            </p>
                        )}
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
                    <h3 className="mb-[16.262px] text-[13.185px] font-bold leading-[19.778px] text-[#091123]">
                        Latest invoice
                    </h3>
                    <div className="flex flex-col gap-[10.548px] pb-[9.23px]">
                        <div className="rounded-[14.065px] border-[0.879px] border-[#dfe5ed] p-[14.944px]">
                            <div className="flex items-center justify-between">
                                <span className="text-[12.306px] font-normal leading-[17.581px] text-[#091123]">{latestInvoice?.id || '-'}</span>
                                <span className="rounded-full bg-[#e1faec] px-[7.032px] py-[1.758px] text-[8.79px] font-bold uppercase leading-[13.185px] tracking-[0.2198px] text-[#008f5a]">{latestInvoice?.status || 'Live'}</span>
                            </div>
                            <p className="pt-[5.274px] text-[21.097px] font-bold leading-[28.129px] tracking-[-0.5274px] text-[#091123]">{formatCurrency(latestInvoice?.amount)}</p>
                            <p className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">{latestInvoice?.date_time || 'No invoice date'}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10.548px] font-normal leading-[14.065px] text-[#5e6a7a]">{invoices.length} recent invoices</span>
                            <button onClick={handleRecharge} className="inline-flex items-center gap-[3.516px] text-[10.548px] font-normal leading-[14.065px] text-[#0019ff]">
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
                            <p className="pb-[0.774px] text-[8.615px] font-normal leading-[15.717px] text-[#00d492]">{latestApi?.method || 'POST'}</p>
                            <p className="h-[15.717px] truncate text-[9.669px] font-normal leading-[15.717px] text-black/70">{latestApi?.endpoint || '/verify'}</p>
                            <p className="pb-[0.774px] pt-[4.395px] text-[9.669px] font-normal leading-[15.717px] text-black/40">Backend schema ready</p>
                        </div>
                        <button
                            onClick={handleStartTesting}
                            className="inline-flex w-full items-center justify-center gap-[7.032px] rounded-[10.548px] border-[0.879px] border-[#0019ff] bg-[#e8f3ff] px-[0.879px] py-[7.911px] text-[12.306px] font-normal leading-[17.581px] text-[#0019ff]"
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
                        <div className="overflow-hidden rounded-[14.065px] bg-[#e8f3ff] p-[14.065px]">
                            <div className="flex items-center gap-[7.032px] pb-[6.153px]">
                                <div className="grid size-[24.613px] place-items-center rounded-[8.79px] bg-[rgba(0,25,255,0.12)]">
                                    <span className="text-[10.548px] font-bold leading-[14.065px] text-[#0019ff]">A</span>
                                </div>
                                <span className="text-[12.306px] font-bold leading-[17.581px] text-black">Brand Logo</span>
                            </div>
                            <div className="h-[5.274px] overflow-hidden rounded-full bg-[rgba(0,25,255,0.12)]">
                                <div className="h-full w-[60%] rounded-full bg-[#0019ff]" />
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
        </motion.div>
    )
}

export default ActionCards
