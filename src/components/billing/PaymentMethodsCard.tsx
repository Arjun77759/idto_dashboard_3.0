import { motion } from 'framer-motion'
import { useState } from 'react'
import { CreditCard, Edit, Plus } from 'lucide-react'
import { usePaymentMethods, updateAutoPay } from '@/hooks/usePaymentMethods'
import { Skeleton } from '@/components/ui/skeleton'

const PaymentMethodsCard = () => {
  const { data, loading, error, setData } = usePaymentMethods()
  const [autoPayEnabled, setAutoPayEnabled] = useState<boolean>(true)

  // Sync local toggle with fetched value
  if (data && autoPayEnabled !== data.auto_pay_enabled) {
    setAutoPayEnabled(data.auto_pay_enabled)
  }

  const handleAddPaymentMethod = () => {
    console.log('Add payment method')
  }

  const toggleAutoPay = async () => {
    const next = !autoPayEnabled
    setAutoPayEnabled(next)
    // optimistic update
    if (data) setData({ ...data, auto_pay_enabled: next })
    try {
      await updateAutoPay(next)
    } catch (e) {
      // revert on failure
      setAutoPayEnabled(!next)
      if (data) setData({ ...data, auto_pay_enabled: !next })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl h-full w-full lg:w-[281px]"
    >
      <div className="flex flex-col gap-4 h-full items-start overflow-hidden p-6 relative rounded-[inherit] w-full">
        <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
          Payment Methods
        </p>
        {error ? (
          <p className="text-xs text-red-600">{error}</p>
        ) : null}

        {/* Payment Method Details */}
        <div className="border-[1px_0px] border-[#e7e8ea] border-solid relative shrink-0 w-full">
          <div className="flex flex-col gap-2 items-start overflow-hidden px-0 py-3.5 relative rounded-[inherit] w-full">
            {loading ? (
              <div className="w-full">
                <Skeleton className="h-5 w-40 mb-2" />
                <Skeleton className="h-4 w-32" />
              </div>
            ) : data && data.methods.length > 0 ? (
              <div className="flex items-center justify-between relative shrink-0 w-full">
                <div className="flex gap-2 items-center relative shrink-0">
                  <CreditCard className="size-5 text-[#616675]" />
                  <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
                    {data.methods[0].brand.toUpperCase()} ending in {data.methods[0].last4}
                  </p>
                </div>
                <Edit className="size-4 text-[#9296a0]" />
              </div>
            ) : (
              <p className="text-xs text-[#9296a0]">No payment methods added.</p>
            )}
            {!loading && data && data.methods.length > 0 ? (
              <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
                Expires {String(data.methods[0].exp_month).padStart(2, '0')}/{data.methods[0].exp_year}
              </p>
            ) : null}
          </div>
        </div>

        <p className="font-normal leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] tracking-[-0.12px] w-full">
          Auto-pay keeps your service active. Your default card is charged automatically.
        </p>

        {/* Auto-pay Toggle */}
        <div className="flex h-10 items-center justify-between overflow-hidden px-0 py-3.5 relative rounded-lg shrink-0 w-full">
          <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Auto-pay
          </p>
          <button
            onClick={toggleAutoPay}
            className={`relative shrink-0 w-11 h-6 rounded-full transition-colors ${autoPayEnabled ? 'bg-[#0019ff]' : 'bg-gray-300'
              }`}
          >
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${autoPayEnabled ? 'translate-x-5' : 'translate-x-0.5'
              }`} />
          </button>
        </div>

        {/* Add Payment Method Button */}
        <div className="bg-[#e6e8ff] border border-[#e7e8ea] border-solid h-10 relative rounded-lg shrink-0 w-full">
          <button
            onClick={handleAddPaymentMethod}
            className="flex gap-2 h-10 items-center justify-center overflow-hidden px-2 py-3.5 relative rounded-[inherit] w-full"
          >
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#0019ff] text-nowrap tracking-[-0.12px] whitespace-pre">
              Add Payment Method
            </p>
            <Plus className="size-4 text-[#0019ff]" />
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default PaymentMethodsCard
