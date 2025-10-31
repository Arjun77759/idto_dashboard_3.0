import { useEffect, useState } from 'react'
import http from '@/api/axiosInstance'

export type InvoiceItem = {
  id: string
  date: string
  status: 'Paid' | 'Unpaid' | 'Pending' | string
  amount: string
}

export function useRecentInvoices(limit: number = 4) {
  const [data, setData] = useState<InvoiceItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    async function fetchRecent() {
      try {
        setLoading(true)
        const { data } = await http.get<InvoiceItem[]>('/invoices/recent', { params: { limit } })
        if (!cancelled) setData(data)
      } catch (e: any) {
        // Fallback to mock when API is missing or failing
        const useMocks = import.meta.env.VITE_USE_MOCKS === 'true'
        if (!cancelled && useMocks) {
          const mock: InvoiceItem[] = [
            { id: 'Inv-2025-001', date: '01/10/25 10:12:03', status: 'Paid', amount: 'Rs 1500' },
            { id: 'Inv-2025-002', date: '02/05/25 12:36:41', status: 'Paid', amount: 'Rs 2800' },
            { id: 'Inv-2025-003', date: '03/02/25 09:22:11', status: 'Paid', amount: 'Rs 3450' },
            { id: 'Inv-2025-004', date: '04/14/25 16:56:07', status: 'Pending', amount: 'Rs 2500' },
            { id: 'Inv-2025-005', date: '05/06/25 13:18:24', status: 'Paid', amount: 'Rs 3675' },
            { id: 'Inv-2025-006', date: '06/22/25 10:47:55', status: 'Unpaid', amount: 'Rs 2990' },
            { id: 'Inv-2025-007', date: '07/11/25 15:27:13', status: 'Paid', amount: 'Rs 4120' },
            { id: 'Inv-2025-008', date: '08/03/25 14:09:32', status: 'Pending', amount: 'Rs 2250' },
            { id: 'Inv-2025-009', date: '09/17/25 17:03:20', status: 'Paid', amount: 'Rs 4800' },
            { id: 'Inv-2025-010', date: '10/10/25 11:36:41', status: 'Paid', amount: 'Rs 5300' },
            { id: 'Inv-2025-011', date: '11/07/25 10:17:53', status: 'Unpaid', amount: 'Rs 3700' },
            { id: 'Inv-2025-012', date: '12/01/25 18:22:10', status: 'Paid', amount: 'Rs 4550' },
            { id: 'Inv-2025-013', date: '12/28/25 09:03:43', status: 'Pending', amount: 'Rs 3950' },
            { id: 'Inv-2026-001', date: '01/09/26 13:30:50', status: 'Paid', amount: 'Rs 3380' },
            { id: 'Inv-2026-002', date: '02/13/26 16:05:17', status: 'Paid', amount: 'Rs 2770' },
            { id: 'Inv-2026-003', date: '03/23/26 11:44:29', status: 'Unpaid', amount: 'Rs 3120' },
            { id: 'Inv-2026-004', date: '04/12/26 15:56:01', status: 'Pending', amount: 'Rs 1820' },
            { id: 'Inv-2026-005', date: '05/02/26 10:10:10', status: 'Paid', amount: 'Rs 4520' },
            { id: 'Inv-2026-006', date: '06/16/26 17:39:26', status: 'Paid', amount: 'Rs 2970' },
            { id: 'Inv-2026-007', date: '07/25/26 12:32:55', status: 'Pending', amount: 'Rs 2875' }
          ]
          setData(mock.slice(0, limit))
          setError(null)
        } else if (!cancelled) {
          setError(e?.response?.data?.detail || e?.message || 'Failed to load invoices')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchRecent()
    return () => {
      cancelled = true
    }
  }, [limit])

  return { data, loading, error }
}


