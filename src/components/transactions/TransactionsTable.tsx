import { Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { format } from 'date-fns'
import { useEffect, useState } from 'react'
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
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  useEffect(() => {
    setSelectedRows((prev) => prev.filter((id) => transactions.some((t) => t.trax_id === id)))
  }, [transactions])

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id)
  }

  const toggleSelectAll = () => {
    if (selectedRows.length === transactions.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(transactions.map(t => t.trax_id))
    }
  }

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const getStatusColor = (status: string) => {
    return status?.toLowerCase() === 'success' ? '#54eebe' : '#ff4d4f'
  }

  const formatDateTime = (timestamp: string) => {
    const parsed = parseTransactionTimestamp(timestamp)
    return parsed ? format(parsed, 'MMM d, yyyy h:mm a') : timestamp
  }

  const formatApiName = (apiName: string) => {
    return apiName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  if (error) {
    console.error('Failed to load transactions:', error)
  }

  if (loading) {
    return (
      <div className="w-full space-y-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-10 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 bg-[length:200%_100%] animate-shimmer rounded" />
        ))}
      </div>
    )
  }

  return (
    <div className="rounded-md border border-[#e7e8ea] w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12">
              <Checkbox
                checked={selectedRows.length === transactions.length && transactions.length > 0}
                onCheckedChange={toggleSelectAll}
              />
            </TableHead>
            <TableHead className="text-[14px] text-[#131b31] font-normal">Transaction ID</TableHead>
            <TableHead className="text-[14px] text-[#131b31] font-normal">Type</TableHead>
            <TableHead className="text-[14px] text-[#131b31] font-normal">Date & Time</TableHead>
            <TableHead className="text-[14px] text-[#131b31] font-normal">Status</TableHead>
            <TableHead className="text-[14px] text-[#131b31] font-normal text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-[#9296a0] py-8">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((transaction, index) => (
              <TableRow key={transaction.trax_id} className={index % 2 === 0 ? 'bg-[#f7f7f8]' : 'bg-white'}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(transaction.trax_id)}
                    onCheckedChange={() => toggleSelectRow(transaction.trax_id)}
                  />
                </TableCell>
                <TableCell className="font-normal text-[14px] text-[#9296a0]">
                  <div className="flex items-center gap-2">
                    <span>{transaction.trax_id}</span>
                    <button onClick={() => handleCopyId(transaction.trax_id)}>
                      <Copy className="size-4 text-[#9296a0] hover:text-[#131b31] cursor-pointer" />
                    </button>
                  </div>
                </TableCell>
                <TableCell className="font-normal text-[14px] text-[#9296a0]">
                  {formatApiName(transaction.api_name)}
                </TableCell>
                <TableCell className="font-normal text-[14px] text-[#9296a0]">
                  {formatDateTime(transaction.timestamp)}
                </TableCell>
                <TableCell 
                  className="font-normal text-[14px] capitalize"
                  style={{ color: getStatusColor(transaction.status) }}
                >
                  {transaction.status}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    onClick={() => onViewDetails(transaction.trax_id)}
                    variant="outline"
                    size="sm"
                    className="h-[29px] px-2 border-[#e7e8ea] text-[12px] text-[#9296a0] hover:bg-[#f7f7f8]"
                  >
                    See details
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

export default TransactionsTable
