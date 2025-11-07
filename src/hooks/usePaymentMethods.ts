import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type PaymentMethod = {
  id: string
  brand: string
  last4: string
  exp_month: number
  exp_year: number
  is_default?: boolean
}

export type PaymentMethodsResponse = {
  methods: PaymentMethod[]
  auto_pay_enabled: boolean
}

export function usePaymentMethods() {
  const [data, setData] = useState<PaymentMethodsResponse | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchPaymentMethods() {
      try {
        setLoading(true)
        const { data } = await http.get<PaymentMethodsResponse>('/billing/payment-methods')
        if (!cancelled) setData(data)
      } catch (e: any) {
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled && useMocks) {
          const mock: PaymentMethodsResponse = {
            methods: [
              { id: 'pm_123', brand: 'visa', last4: '1234', exp_month: 1, exp_year: 2025, is_default: true }
            ],
            auto_pay_enabled: true
          }
          setData(mock)
          setError(null)
        } else if (!cancelled) {
          setError(e?.response?.data?.detail || e?.message || 'Failed to load payment methods')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchPaymentMethods()
    return () => {
      cancelled = true
    }
  }, [])

  return { data, loading, error, setData }
}

export async function updateAutoPay(enabled: boolean) {
  try {
    await http.patch('/billing/auto-pay', { enabled })
  } catch (e) {
    // swallow; caller will optimistically update and we won't crash UI
    throw e
  }
}


