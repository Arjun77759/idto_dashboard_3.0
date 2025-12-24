import { useMemo } from 'react'
import { TableWithPagination, type TableColumn } from '@/components/ui/TableWithPagination'

interface DetailItem {
  field: string
  value: string
}

interface TransactionDetailsTableProps {
  details: DetailItem[]
}

const TransactionDetailsTable = ({ details }: TransactionDetailsTableProps) => {
  const getValueColor = (field: string, value: string) => {
    if (field === 'Status') {
      return value === 'Success' ? '#3AC828' : '#ff4d4f'
    }
    return '#9296a0' // Default color
  }

  const columns: TableColumn<DetailItem>[] = useMemo(() => [
    {
      key: 'field',
      header: 'Field',
      width: '280px',
      render: (row) => (
        <span className="text-[14px] text-[#9296a0]">{row.field}</span>
      )
    },
    {
      key: 'value',
      header: 'Value',
      render: (row) => (
        <span 
          className="text-[14px] break-words"
          style={{ color: getValueColor(row.field, row.value) }}
        >
          {row.value}
        </span>
      )
    }
  ], [])

  return (
    <div className="bg-white border border-[#e7e8ea] border-solid flex-1 relative rounded-2xl w-full lg:w-auto h-full flex flex-col">
      <div className="box-border flex flex-col gap-4 items-start p-6 relative rounded-[inherit] flex-1 min-h-0">
        <p className="font-['Inter'] font-medium leading-[1.4] not-italic relative shrink-0 text-[12px] text-[#131b31] tracking-[-0.12px] w-full whitespace-pre-wrap">
          Transaction Details
        </p>
        <div className="flex-1 min-h-0 w-full overflow-hidden">
          <TableWithPagination
            data={details}
            columns={columns}
            emptyMessage="No details available"
            itemsPerPage={1000}
            className="h-full"
          />
        </div>
      </div>
    </div>
  )
}

export default TransactionDetailsTable
