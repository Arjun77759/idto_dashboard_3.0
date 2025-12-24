import { useState, useMemo, useEffect } from 'react'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Checkbox } from '@/components/ui/checkbox'

export interface TableColumn<T> {
  key: string
  header: string
  width?: string
  align?: 'left' | 'center' | 'right'
  render?: (row: T, index: number) => React.ReactNode
}

export interface TableWithPaginationProps<T> {
  data: T[]
  columns: TableColumn<T>[]
  loading?: boolean
  error?: string | null
  emptyMessage?: string
  itemsPerPage?: number
  showCheckbox?: boolean
  onRowClick?: (row: T) => void
  className?: string
}

const ITEMS_PER_PAGE = 10

export function TableWithPagination<T extends { [key: string]: any }>({
  data,
  columns,
  loading = false,
  error = null,
  emptyMessage = 'No data available',
  itemsPerPage = ITEMS_PER_PAGE,
  showCheckbox = false,
  onRowClick,
  className
}: TableWithPaginationProps<T>) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set())

  // Calculate pagination
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const shouldShowPagination = data.length > itemsPerPage

  // Get current page data
  const paginatedData = useMemo(() => {
    if (!shouldShowPagination) return data
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return data.slice(startIndex, endIndex)
  }, [data, currentPage, itemsPerPage, shouldShowPagination])

  // Reset to page 1 when data changes
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1)
    }
  }, [data.length, totalPages, currentPage])

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = paginatedData.map((row, idx) => row.id || row.trax_id || idx)
      setSelectedRows(new Set(allIds))
    } else {
      setSelectedRows(new Set())
    }
  }

  const handleSelectRow = (row: T, index: number, checked: boolean) => {
    const id = row.id || row.trax_id || index
    const newSelected = new Set(selectedRows)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedRows(newSelected)
  }

  // Generate page numbers to display (max 5 pages)
  const getPageNumbers = () => {
    const maxVisible = 5
    const pages: (number | string)[] = []
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Show first page, current page area, and last page
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= 5; i++) {
          pages.push(i)
        }
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        for (let i = totalPages - 4; i <= totalPages; i++) {
          pages.push(i)
        }
      } else {
        // In the middle
        pages.push(1)
        pages.push('...')
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i)
        }
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
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

  if (error) {
    return (
      <div className="flex items-center justify-center p-8 text-sm text-red-600">
        {typeof error === 'string' ? error : 'Failed to load data'}
      </div>
    )
  }

  const allSelected = paginatedData.length > 0 && selectedRows.size === paginatedData.length

  return (
    <div className={cn("flex flex-col gap-6 w-full", className)}>
      {/* Table Container with horizontal scroll */}
      <div 
        className="bg-white border border-[#e7e8ea] border-solid relative rounded-[6px] w-full overflow-x-auto"
        style={{
          scrollbarWidth: 'none', /* Firefox */
          msOverflowStyle: 'none', /* IE and Edge */
        }}
      >
        <style>{`
          .table-scroll-hide::-webkit-scrollbar {
            display: none; /* Chrome, Safari and Opera */
          }
        `}</style>
        <div className="table-scroll-hide">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {showCheckbox && (
                  <TableHead className="w-[48px]">
                    <Checkbox
                      checked={allSelected}
                      onCheckedChange={handleSelectAll}
                      className="data-[state=checked]:bg-[#0019ff] data-[state=checked]:border-[#0019ff]"
                    />
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(
                      "text-[14px] text-[#131b31] font-normal",
                      column.align === 'center' && "text-center",
                      column.align === 'right' && "text-right"
                    )}
                    style={column.width ? { width: column.width } : undefined}
                  >
                    {column.header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (showCheckbox ? 1 : 0)}
                    className="text-center text-[#9296a0] py-8"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, rowIndex) => {
                  const rowId = row.id || row.trax_id || rowIndex
                  const isSelected = selectedRows.has(rowId)
                  
                  return (
                    <TableRow
                      key={rowId}
                      className={cn(
                        rowIndex % 2 === 0 && "bg-[#f7f7f8]",
                        onRowClick && "cursor-pointer hover:bg-[#f0f4ff]"
                      )}
                      onClick={() => onRowClick?.(row)}
                    >
                      {showCheckbox && (
                        <TableCell className="w-[48px]">
                          <Checkbox
                            checked={isSelected}
                            onCheckedChange={(checked) => {
                              handleSelectRow(row, rowIndex, checked as boolean)
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="data-[state=checked]:bg-[#0019ff] data-[state=checked]:border-[#0019ff]"
                          />
                        </TableCell>
                      )}
                      {columns.map((column) => {
                        const content = column.render
                          ? column.render(row, rowIndex)
                          : row[column.key] ?? ''
                        
                        return (
                          <TableCell
                            key={column.key}
                            className={cn(
                              "text-[14px] text-[#9296a0]",
                              column.align === 'center' && "text-center",
                              column.align === 'right' && "text-right"
                            )}
                          >
                            {content}
                          </TableCell>
                        )
                      })}
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage - 1)
                }}
                className={cn(
                  currentPage === 1 && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
            
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              
              const pageNum = page as number
              const isActive = pageNum === currentPage
              
              return (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      handlePageChange(pageNum)
                    }}
                    isActive={isActive}
                    className={cn(
                      isActive && "bg-[#e6e8ff] text-[#0019ff] hover:bg-[#e6e8ff]"
                    )}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            })}
            
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={(e) => {
                  e.preventDefault()
                  handlePageChange(currentPage + 1)
                }}
                className={cn(
                  currentPage === totalPages && "pointer-events-none opacity-50"
                )}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  )
}
