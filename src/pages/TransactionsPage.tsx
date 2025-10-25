import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import TransactionsPageHeader from '@/components/transactions/TransactionsPageHeader'
import TransactionsStatsGrid from '@/components/transactions/TransactionsStatsGrid'
import TransactionsFilters from '@/components/transactions/TransactionsFilters'
import TransactionsTable from '@/components/transactions/TransactionsTable'

// Sample transaction data
const transactions = [
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07',
    status: 'Success',
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification', 
    date: '04/17/23  16:56:07',
    status: 'Success',
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07', 
    status: 'Success',
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07',
    status: 'Success', 
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07',
    status: 'Success',
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07',
    status: 'Success',
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07',
    status: 'Success',
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07',
    status: 'Success',
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07',
    status: 'Success',
    statusColor: '#3ac828'
  },
  {
    id: '29100214155...',
    type: 'OKYC Verification',
    date: '04/17/23  16:56:07',
    status: 'Success',
    statusColor: '#3ac828'
  }
]

const TransactionsPage = () => {
  const navigate = useNavigate()

  const handleViewDetails = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`)
  }

  const handleExportCsv = () => {
    console.log('Export CSV')
  }

  const handleDownloadReport = () => {
    console.log('Download Report')
  }

  const handleReset = () => {
    console.log('Reset filters')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start overflow-hidden p-4 sm:p-6 relative rounded-2xl w-full"
    >
      <TransactionsPageHeader />
      <TransactionsStatsGrid />

      {/* Table Container */}
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 w-full">
        <div className="flex flex-col gap-4 sm:gap-6 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] w-full">
          <TransactionsFilters 
            onExportCsv={handleExportCsv}
            onDownloadReport={handleDownloadReport}
            onReset={handleReset}
          />
          <TransactionsTable 
            transactions={transactions}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionsPage
