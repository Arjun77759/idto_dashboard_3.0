import JsonPreview from '@/components/transactions/JsonPreview'
import TransactionDetailsTable from '@/components/transactions/TransactionDetailsTable'
import TransactionHeader from '@/components/transactions/TransactionHeader'
import TransactionSummary from '@/components/transactions/TransactionSummary'
import { motion } from 'framer-motion'
import { useNavigate, useParams } from 'react-router-dom'
import { useTransactionDetail } from '@/hooks/useTransactionDetail'
import { useMemo } from 'react'
import { formatTransactionTimestampIST } from '@/lib/utils'
import { downloadCsv } from '@/lib/downloadCsv'

const TransactionDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const { data: transaction, loading, error } = useTransactionDetail(id)

  // Format transaction data for components
  const formattedData = useMemo(() => {
    if (!transaction) return null

    const statusColor = transaction.status?.toLowerCase() === 'success' ? '#3AC828' : '#ff4d4f'
    
    // Format date
    const formattedDate = formatTransactionTimestampIST(transaction.timestamp)

    // Extract details from response_details
    const details: { field: string; value: string }[] = []
    
    // Helper function to convert snake_case to Title Case
    const toTitleCase = (str: string) => {
      return str.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ')
    }

    // Helper function to safely stringify values
    const stringifyValue = (value: any): string => {
      if (value === null || value === undefined) return 'N/A'
      if (typeof value === 'object') return JSON.stringify(value)
      return String(value)
    }

    if (transaction.response_details && typeof transaction.response_details === 'object' && !Array.isArray(transaction.response_details)) {
      Object.entries(transaction.response_details).forEach(([key, value]) => {
        details.push({
          field: toTitleCase(key),
          value: stringifyValue(value)
        })
      })
    }

    // Add fallback details if response_details is empty or not available
    if (details.length === 0) {
      details.push(
        { field: 'Transaction ID', value: transaction.trax_id },
        { field: 'API Name', value: toTitleCase(transaction.api_name) },
        { field: 'Status', value: transaction.status?.toLowerCase() === 'success' ? 'Success' : 'Failed' },
        { field: 'Timestamp', value: formatTransactionTimestampIST(transaction.timestamp) }
      )
      
      if (transaction.turn_around_time) {
        details.push({ field: 'Turn Around Time', value: transaction.turn_around_time })
      }
    }

    return {
      id: transaction.trax_id,
      date: formattedDate,
      api: toTitleCase(transaction.api_name),
      status: transaction.status?.toLowerCase() === 'success' ? 'Success' : 'Failed',
      statusColor,
      details,
      requestData: transaction.request_details,
      responseData: transaction.response_details
    }
  }, [transaction])

  const handleBack = () => {
    navigate('/transactions')
  }

  const handleCopyJson = () => {
    if (formattedData && transaction) {
      const jsonData = {
        transaction_id: formattedData.id,
        api: formattedData.api,
        timestamp: transaction.timestamp,
        turn_around_time: transaction.turn_around_time,
        status: formattedData.status,
        request: formattedData.requestData,
        response: formattedData.responseData
      }
      navigator.clipboard.writeText(JSON.stringify(jsonData, null, 2))
    }
  }

  const handleCopyTransactionId = () => {
    if (formattedData) {
      navigator.clipboard.writeText(formattedData.id)
    }
  }

  const handleExportCsv = () => {
    if (!formattedData || !transaction) return

    const headers = ['Field', 'Value']
    const detailRows = formattedData.details.map(({ field, value }) => [field, value])
    const additionalRows = [
      ['Transaction ID', formattedData.id],
      ['API', formattedData.api],
      ['Timestamp', formatTransactionTimestampIST(transaction.timestamp)],
      ['Status', formattedData.status],
      ['Turn Around Time', transaction.turn_around_time || 'N/A'],
      ['Request', JSON.stringify(transaction.request_details ?? {}, null, 2)],
      ['Response', JSON.stringify(transaction.response_details ?? {}, null, 2)]
    ]

    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]

    downloadCsv({
      headers,
      rows: [...detailRows, ...additionalRows],
      filename: `Transaction_${formattedData.id}_${formattedDate}`
    })
  }

  if (error) {
    console.error('Failed to load transaction details:', error)
  }

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start overflow-hidden p-4 sm:p-6 relative rounded-2xl w-full"
      >
        <div className="w-full space-y-4">
          <div className="h-12 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
          <div className="h-24 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 h-[360px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
            <div className="flex-1 h-[360px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
          </div>
        </div>
      </motion.div>
    )
  }

  if (!formattedData) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-center justify-center overflow-hidden p-4 sm:p-6 relative rounded-2xl w-full min-h-[400px]"
      >
        <p className="text-[#9296a0] text-lg">Transaction not found</p>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start overflow-hidden p-4 sm:p-6 relative rounded-2xl w-full"
    >
      <TransactionHeader
        onBack={handleBack}
        onExportCsv={handleExportCsv}
      />

      <TransactionSummary
        id={formattedData.id}
        date={formattedData.date}
        api={formattedData.api}
        status={formattedData.status}
        statusColor={formattedData.statusColor}
        onCopyId={handleCopyTransactionId}
      />

      {/* Two Column Layout - Responsive */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 h-auto lg:h-[360px] items-start relative shrink-0 w-full">
        <TransactionDetailsTable details={formattedData.details} />
        <JsonPreview
          jsonData={{
            transaction_id: formattedData.id,
            api: formattedData.api,
            timestamp: transaction?.timestamp,
            turn_around_time: transaction?.turn_around_time,
            status: formattedData.status,
            request: formattedData.requestData,
            response: formattedData.responseData
          }}
          onCopy={handleCopyJson}
        />
      </div>
    </motion.div>
  )
}

export default TransactionDetailPage
