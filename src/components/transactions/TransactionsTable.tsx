import { useMemo } from 'react'
import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TableWithPagination, type TableColumn } from '@/components/ui/TableWithPagination'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { format } from 'date-fns'
import { parseTransactionTimestamp } from '@/lib/utils'
import type { Transaction } from '@/hooks/useTransactions'

interface TransactionsTableProps {
  onViewDetails: (transactionId: string) => void
  transactions: Transaction[]
  loading: boolean
  error: string | null
}

const TransactionsTable = ({ 
  onViewDetails, 
  transactions,
  loading,
  error
}: TransactionsTableProps) => {
  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    navigator.clipboard.writeText(id)
  }

  const formatDateTime = (timestamp: string) => {
    const parsed = parseTransactionTimestamp(timestamp)
    return parsed ? format(parsed, 'MM/dd/yy  HH:mm:ss') : timestamp
  }

  const formatApiName = (apiName: string) => {
    return apiName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  const columns: TableColumn<Transaction>[] = useMemo(() => [
    {
      key: 'trax_id',
      header: 'Transaction ID',
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="truncate">{row.trax_id}</span>
          <button 
            onClick={(e) => handleCopyId(row.trax_id, e)}
            className="shrink-0"
          >
            <Copy className="size-4 text-[#9296a0] hover:text-[#131b31] cursor-pointer" />
          </button>
        </div>
      )
    },
    {
      key: 'api_name',
      header: 'Type',
      width: '252px',
      render: (row) => formatApiName(row.api_name)
    },
    {
      key: 'timestamp',
      header: 'Date & Time',
      width: '224px',
      render: (row) => formatDateTime(row.timestamp)
    },
    {
      key: 'status',
      header: 'Status',
      width: '148px',
      render: (row) => <StatusBadge status={row.status} />
    },
    {
      key: 'actions',
      header: 'Details',
      width: '107px',
      align: 'center',
      render: (row) => (
        <div className="flex items-center justify-center">
          <Button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetails(row.trax_id)
            }}
            variant="outline"
            size="sm"
            className="h-[29px] px-2 border-[#e7e8ea] text-[12px] text-[#9296a0] hover:bg-[#f7f7f8]"
          >
            View
          </Button>
        </div>
      )
    }
  ], [onViewDetails])

  if (error) {
    console.error('Failed to load transactions:', error)
  }

  return (
    <TableWithPagination
      data={transactions}
      columns={columns}
      loading={loading}
      error={error}
      emptyMessage="No transactions found"
      showCheckbox={true}
      itemsPerPage={10}
    />
  )
}

export default TransactionsTable
