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
import { useTransactions } from '@/hooks/useTransactions'
import { format, isWithinInterval, parseISO } from 'date-fns'
import { useState, useMemo } from 'react'

interface TransactionsTableProps {
  onViewDetails: (transactionId: string) => void
  searchQuery?: string
  dateFilter?: any
  documentTypeFilter?: string
  statusFilter?: string
  locationFilter?: string
}

const TransactionsTable = ({ 
  onViewDetails, 
  searchQuery = '',
  dateFilter,
  documentTypeFilter = '',
  statusFilter = '',
  locationFilter = ''
}: TransactionsTableProps) => {
  const { data: transactions, loading, error } = useTransactions()
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  // Filter transactions based on all filter criteria
  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions]
    
    // Search query filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(transaction =>
        transaction.trax_id.toString().includes(query) ||
        transaction.api_name.toLowerCase().includes(query) ||
        transaction.status.toLowerCase().includes(query)
      )
    }
    
    // Date range filter
    if (dateFilter?.from && dateFilter?.to) {
      filtered = filtered.filter(transaction => {
        try {
          const transactionDate = parseISO(transaction.timestamp)
          return isWithinInterval(transactionDate, {
            start: dateFilter.from,
            end: dateFilter.to
          })
        } catch {
          return true // Keep if date parsing fails
        }
      })
    }
    
    // Document type filter
    if (documentTypeFilter) {
      filtered = filtered.filter(transaction =>
        transaction.api_name === documentTypeFilter
      )
    }
    
    // Status filter (map 'completed' to 'success')
    if (statusFilter) {
      const mappedStatus = statusFilter === 'completed' ? 'success' : statusFilter
      filtered = filtered.filter(transaction =>
        transaction.status === mappedStatus
      )
    }
    
    // Location filter (not available in current data structure, but prepared for future)
    // if (locationFilter) {
    //   filtered = filtered.filter(transaction =>
    //     transaction.location?.toLowerCase() === locationFilter.toLowerCase()
    //   )
    // }
    
    return filtered
  }, [transactions, searchQuery, dateFilter, documentTypeFilter, statusFilter, locationFilter])

  const handleCopyId = (id: number) => {
    navigator.clipboard.writeText(id.toString())
  }

  const toggleSelectAll = () => {
    if (selectedRows.length === filteredTransactions.length) {
      setSelectedRows([])
    } else {
      setSelectedRows(filteredTransactions.map(t => t.trax_id))
    }
  }

  const toggleSelectRow = (id: number) => {
    setSelectedRows(prev =>
      prev.includes(id) ? prev.filter(rowId => rowId !== id) : [...prev, id]
    )
  }

  const getStatusColor = (status: string) => {
    return status === 'success' ? '#54eebe' : '#ff4d4f'
  }

  const formatDateTime = (timestamp: string) => {
    try {
      return format(new Date(timestamp), 'MMM d, yyyy h:mm a')
    } catch {
      return timestamp
    }
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
                checked={selectedRows.length === filteredTransactions.length && filteredTransactions.length > 0}
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
          {filteredTransactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-[#9296a0] py-8">
                No transactions found
              </TableCell>
            </TableRow>
          ) : (
            filteredTransactions.map((transaction, index) => (
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
                  {transaction.api_name}
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
                    onClick={() => onViewDetails(transaction.trax_id.toString())}
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
