import type { TableColumn } from '@/components/ui/TableWithPagination'
import { TableWithPagination } from '@/components/ui/TableWithPagination'
import { useUsageMonthly } from '@/hooks/useUsageMonthly'
import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'

type ApiUsageRow = {
  api_name: string
  number_of_transactions: number
  unit_price: number
  total_cost: number
  [key: string]: unknown
}

const formatApiName = (name: string): string => {
  return name
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}

const ApiUsageTable = () => {
  const { data, loading, error } = useUsageMonthly()
  const [showAll, setShowAll] = useState(false)
  const usageData = Array.isArray(data) ? (data as ApiUsageRow[]) : []

  const columns: TableColumn<ApiUsageRow>[] = useMemo(() => [
    {
      key: 'api_name',
      header: 'API Name',
      render: row => <span className="">{formatApiName(row.api_name)}</span>
    },
    {
      key: 'number_of_transactions',
      header: 'Calls',
      render: row => (
        <span className="">
          {row.number_of_transactions?.toLocaleString() ?? '-'}
        </span>
      )
    },
    {
      key: 'unit_price',
      header: 'Per Unit Cost',
      align: 'right',
      render: row => (
        <span className="">
          {typeof row.unit_price === 'number' ? `₹${row.unit_price.toFixed(2)}` : '-'}
        </span>
      )
    },
    {
      key: 'total_cost',
      header: 'Cost',
      align: 'right',
      render: row => (
        <span className="">
          {typeof row.total_cost === 'number' ? `₹${row.total_cost.toFixed(2)}` : '-'}
        </span>
      )
    }
  ], [])


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className="bg-white border border-[#e7e8ea] border-solid grow min-h-0 min-w-px relative rounded-2xl shrink-0 w-full lg:w-auto h-full"
    >
      <div className="flex flex-col gap-4 sm:gap-6 items-start overflow-hidden p-4 sm:p-6 relative rounded-[inherit] w-full h-full">
        <div className="flex font-medium items-center justify-between leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] w-full whitespace-pre">
          <p className="relative shrink-0">
            API Usage
          </p>
          <button
            onClick={() => setShowAll((v) => !v)}
            className="relative shrink-0 hover:text-[#131b31]"
          >
            {showAll ? 'Show less' : 'View all'}
          </button>
        </div>


        <TableWithPagination<ApiUsageRow>
          data={showAll ? usageData : usageData.slice(0, 5)}
          columns={columns}
          loading={loading}
          error={error}
          itemsPerPage={5}
          emptyMessage="No API usage available"
          className="w-full"
        />


      </div>
    </motion.div>
  )
}

export default ApiUsageTable
