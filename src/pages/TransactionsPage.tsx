import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import TransactionsPageHeader from '@/components/transactions/TransactionsPageHeader'
import TransactionsStatsGrid from '@/components/transactions/TransactionsStatsGrid'
import TransactionsFilters from '@/components/transactions/TransactionsFilters'
import TransactionsTable from '@/components/transactions/TransactionsTable'

const TransactionsPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<any>(undefined)
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [locationFilter, setLocationFilter] = useState<string>('')

  const handleExportCsv = () => {
    console.log('Export CSV clicked')
  }

  const handleDownloadReport = () => {
    console.log('Download Report clicked')
  }

  const handleReset = () => {
    console.log('Reset filters clicked')
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleDateChange = (date: any) => {
    setDateFilter(date)
  }

  const handleDocumentTypeChange = (type: string) => {
    setDocumentTypeFilter(type)
  }

  const handleStatusChange = (status: string) => {
    setStatusFilter(status)
  }

  const handleLocationChange = (location: string) => {
    setLocationFilter(location)
  }

  const handleViewDetails = (transactionId: string) => {
    navigate(`/transactions/${transactionId}`)
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
            onSearchChange={handleSearchChange}
            onDateChange={handleDateChange}
            onDocumentTypeChange={handleDocumentTypeChange}
            onStatusChange={handleStatusChange}
            onLocationChange={handleLocationChange}
          />
          <TransactionsTable 
            onViewDetails={handleViewDetails}
            searchQuery={searchQuery}
            dateFilter={dateFilter}
            documentTypeFilter={documentTypeFilter}
            statusFilter={statusFilter}
            locationFilter={locationFilter}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionsPage
