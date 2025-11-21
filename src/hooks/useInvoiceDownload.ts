import { downloadInvoice } from '@/api/billingApi'

export function useInvoiceDownload() {
  const downloadInvoiceData = async (year: number, month: number) => {
    try {
      const blob = await downloadInvoice(year, month)
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `invoice-${year}-${month.toString().padStart(2, '0')}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      
      return { success: true }
    } catch (error) {
      console.error('Error downloading invoice:', error)
      return { success: false, error }
    }
  }

  return { downloadInvoice: downloadInvoiceData }
}

