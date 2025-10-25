import JsonPreview from '@/components/transactions/JsonPreview'
import TransactionDetailsTable from '@/components/transactions/TransactionDetailsTable'
import TransactionHeader from '@/components/transactions/TransactionHeader'
import TransactionSummary from '@/components/transactions/TransactionSummary'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

// Sample transaction data
const transactionData = {
  id: '291002141554523650',
  date: '04/17/23  16:56:07',
  api: 'OKYC Verification',
  status: 'Success',
  statusColor: '#298e1c',
  details: [
    { field: 'Status', value: 'Success' },
    { field: 'Full Name', value: 'John Doe' },
    { field: 'PAN Number', value: 'ABCDE1234F' },
    { field: 'Gender', value: 'Male' },
    { field: 'Date of Birth', value: '01/01/1980' },
    { field: 'Category', value: 'Individual' }
  ],
  jsonData: {
    "transaction_id": "TXN-1234567890",
    "api": "Aadhaar Verification",
    "environment": "production",
    "timestamp": "2025-09-17T14:32:10Z",
    "request_source": "API_KEY_98765",
    "input": {
      "document_type": "Aadhaar",
      "aadhaar_number": "1234-****-5678",
      "name": "John Doe",
      "dob": "1992-05-14"
    }
  }
}

const TransactionDetailPage = () => {
  const navigate = useNavigate()

  const handleBack = () => {
    navigate('/transactions')
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(transactionData.jsonData, null, 2))
  }

  const handleCopyTransactionId = () => {
    navigator.clipboard.writeText(transactionData.id)
  }

  const handleExportCsv = () => {
    console.log('Export CSV')
  }

  const handleDownloadReport = () => {
    console.log('Download Report')
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
        onDownloadReport={handleDownloadReport}
      />

      <TransactionSummary
        id={transactionData.id}
        date={transactionData.date}
        api={transactionData.api}
        status={transactionData.status}
        statusColor={transactionData.statusColor}
        onCopyId={handleCopyTransactionId}
      />

      {/* Two Column Layout - Responsive */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-5 h-auto lg:h-[360px] items-start relative shrink-0 w-full">
        <TransactionDetailsTable details={transactionData.details} />
        <JsonPreview
          jsonData={transactionData.jsonData}
          onCopy={handleCopyJson}
        />
      </div>
    </motion.div>
  )
}

export default TransactionDetailPage
