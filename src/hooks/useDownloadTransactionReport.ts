import { useState } from 'react'
import http from '@/api/axiosInstance'

interface DownloadReportPayload {
  transaction_id: string
  default_type: boolean
}

export function useDownloadTransactionReport() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const downloadReport = async (payload: DownloadReportPayload) => {
    try {
      setLoading(true)
      setError(null)

      const response = await http.post(
        '/usage/report',
        payload,
        {
          responseType: 'blob', // 🔥 IMPORTANT for PDF
          headers: {
            Accept: 'application/pdf'
          }
        }
      )

      // Create blob URL
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      // Trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = `Transaction_Report_${payload.transaction_id}.pdf`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      link.remove()
      window.URL.revokeObjectURL(url)

    } catch (err: any) {
      setError(err?.message || 'Failed to download report')
    } finally {
      setLoading(false)
    }
  }

  return { downloadReport, loading, error }
}
