import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import TransactionsPageHeader from '@/components/transactions/TransactionsPageHeader'
import TransactionsStatsGrid from '@/components/transactions/TransactionsStatsGrid'
import TransactionsFilters from '@/components/transactions/TransactionsFilters'
import TransactionsTable from '@/components/transactions/TransactionsTable'
import { useTransactions } from '@/hooks/useTransactions'
import { parseTransactionTimestamp, formatTransactionTimestampIST } from '@/lib/utils'
import { isWithinInterval } from 'date-fns'
import { downloadCsv } from '@/lib/downloadCsv'

const TransactionsPage = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [dateFilter, setDateFilter] = useState<any>(undefined)
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [locationFilter, setLocationFilter] = useState<string>('')

  const { data: transactions, loading, error } = useTransactions(searchQuery)

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]

    if (dateFilter?.from && dateFilter?.to) {
      filtered = filtered.filter((transaction) => {
        const transactionDate = parseTransactionTimestamp(transaction.timestamp)
        if (!transactionDate) {
          return true
        }

        return isWithinInterval(transactionDate, {
          start: dateFilter.from,
          end: dateFilter.to
        })
      })
    }

    if (documentTypeFilter) {
      filtered = filtered.filter((transaction) => transaction.api_name === documentTypeFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter((transaction) => transaction.status === statusFilter)
    }

    // location filter placeholder

    return filtered
  }, [transactions, dateFilter, documentTypeFilter, statusFilter, locationFilter])

  const handleExportCsv = () => {
    // const headers = ['Transaction ID', 'Type', 'Date & Time', 'Status']
    const headers = ['Transaction ID', 'Backend call', 'Request Payload', 'Response Payload', 'Response Status', 'Response Message', 'Date & Time', 'Turn Around Time']

    const rows = filteredTransactions.map((transaction) => [
      transaction.trax_id,
      transaction.api_name,
      transaction.request_details,
      transaction.response_details,
      transaction.response_message,
      transaction.status,
      formatTransactionTimestampIST(transaction.timestamp),
      transaction.turn_around_time
    ])

    const today = new Date()
    const formattedDate = today.toISOString().split('T')[0]
    downloadCsv({ headers, rows, filename: `Transactions_${formattedDate}` })
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
      className="bg-[#f7f7f8] flex flex-col gap-4 sm:gap-5 items-start p-6 sm:p-6 relative rounded-2xl w-full"
    >
      <TransactionsPageHeader />
      <TransactionsStatsGrid />

      {/* Table Container */}
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-2xl shrink-0 w-full">
        <div className="flex flex-col gap-4 sm:gap-6 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] w-full">
          <TransactionsFilters 
            onExportCsv={handleExportCsv}
            onReset={handleReset}
            onSearchChange={handleSearchChange}
            onDateChange={handleDateChange}
            onDocumentTypeChange={handleDocumentTypeChange}
            onStatusChange={handleStatusChange}
            onLocationChange={handleLocationChange}
          />
          <TransactionsTable 
            onViewDetails={handleViewDetails}
            transactions={filteredTransactions}
            loading={loading}
            error={error}
          />
        </div>
      </div>
    </motion.div>
  )
}

export default TransactionsPage
