import { useState, useMemo, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

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

  const handleSelectAll = () => {
    if (selectedRows.size === paginatedData.length) {
      setSelectedRows(new Set())
    } else {
      const allIds = paginatedData.map((row, idx) => row.id || row.trax_id || idx)
      setSelectedRows(new Set(allIds))
    }
  }

  const handleSelectRow = (row: T, index: number) => {
    const id = row.id || row.trax_id || index
    const newSelected = new Set(selectedRows)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
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

  return (
    <div className={cn("flex flex-col gap-6 w-full items-center", className)}>
      {/* Table Container */}
      <div className="bg-white border border-[#e7e8ea] border-solid relative rounded-[6px] w-full overflow-x-auto">
        <div className="flex flex-col items-start overflow-hidden relative rounded-[inherit] w-full min-w-[800px]">
          {/* Table Header */}
          <div className="bg-white flex items-start relative shrink-0 w-full">
            {showCheckbox && (
              <div className="h-[40px] overflow-hidden relative shrink-0 w-[48px]">
                <div className="h-[40px] overflow-hidden relative rounded-[inherit] w-[48px]">
                  <div className="absolute left-1/2 top-[12px] translate-x-[-50%]">
                    <input
                      type="checkbox"
                      checked={selectedRows.size === paginatedData.length && paginatedData.length > 0}
                      onChange={handleSelectAll}
                      className="w-4 h-4 rounded border border-[#131b31] bg-[#f7f7f8] cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}
            {columns.map((column, colIndex) => (
              <div
                key={column.key}
                className={cn(
                  colIndex < columns.length - 1 && "border-[0px_1px_0px_0px] border-[#e7e8ea] border-solid",
                  "h-[40px] relative shrink-0",
                  !column.width && "flex-1 min-w-0"
                )}
                style={column.width ? { width: column.width } : undefined}
              >
                <div className="h-[40px] overflow-hidden relative rounded-[inherit] w-full">
                  <p
                    className={cn(
                      "absolute bottom-[32px] font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#131b31] tracking-[-0.084px] translate-y-[100%]",
                      column.align === 'center' && "left-1/2 translate-x-[-50%] text-center",
                      column.align === 'right' && "left-auto right-4 text-right"
                    )}
                  >
                    {column.header}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Table Rows */}
          {paginatedData.length === 0 ? (
            <div className="flex items-center justify-center p-8 text-sm text-[#9296a0] w-full h-full">
              {emptyMessage}
            </div>
          ) : (
            paginatedData.map((row, rowIndex) => {
              const rowId = row.id || row.trax_id || rowIndex
              const isSelected = selectedRows.has(rowId)
              
              return (
                <div
                  key={rowId}
                  className={cn(
                    "bg-white flex items-start relative shrink-0 w-full",
                    rowIndex % 2 === 0 && "bg-[#f7f7f8]",
                    onRowClick && "cursor-pointer hover:bg-[#f0f4ff]"
                  )}
                  onClick={() => onRowClick?.(row)}
                >
                  {showCheckbox && (
                    <div className="h-[40px] overflow-hidden relative shrink-0 w-[48px]">
                      <div className="h-[40px] overflow-hidden relative rounded-[inherit] w-[48px]">
                        <div className="absolute left-1/2 top-[12px] translate-x-[-50%]">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              e.stopPropagation()
                              handleSelectRow(row, rowIndex)
                            }}
                            className="w-4 h-4 rounded border border-[#9296a0] bg-[#f7f7f8] cursor-pointer"
                          />
                        </div>
                        {rowIndex < paginatedData.length - 1 && (
                          <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                        )}
                      </div>
                    </div>
                  )}
                  {columns.map((column, colIndex) => {
                    const content = column.render
                      ? column.render(row, rowIndex)
                      : row[column.key] ?? ''
                    
                    return (
                      <div
                        key={column.key}
                        className={cn(
                          colIndex < columns.length - 1 && "border-[0px_0px_0px_0px] border-[#e7e8ea] border-solid",
                          "h-[40px] relative shrink-0",
                          !column.width && "flex-1 min-w-0"
                        )}
                        style={column.width ? { width: column.width } : undefined}
                      >
                        <div className="h-[40px] overflow-hidden relative rounded-[inherit] w-full">
                      <div
                        className={cn(
                          "absolute font-normal leading-6 left-4 not-italic right-4 text-[14px] text-[#9296a0] top-2 tracking-[-0.084px]",
                          column.align === 'center' && "left-1/2 translate-x-[-50%] text-center right-auto",
                          column.align === 'right' && "left-auto right-4 text-right"
                        )}
                      >
                            {content}
                          </div>
                          {rowIndex < paginatedData.length - 1 && (
                            <div className="absolute bg-[#e7e8ea] bottom-0 h-px left-0 right-0" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Pagination */}
      {shouldShowPagination && (
        <div className="flex gap-6 items-center justify-center relative shrink-0 w-full">
          {/* Back Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "flex gap-1 h-full items-center justify-center overflow-hidden relative shrink-0",
              currentPage === 1 && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="flex items-center justify-center relative shrink-0 size-4">
              <ChevronLeft className="size-4 text-[#9296a0]" />
            </div>
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Back
            </p>
          </button>

          {/* Page Numbers */}
          <div className="flex gap-2 items-center relative shrink-0">
            {getPageNumbers().map((page, index) => {
              if (page === '...') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre"
                  >
                    ...
                  </span>
                )
              }
              
              const pageNum = page as number
              const isActive = pageNum === currentPage
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={cn(
                    "flex flex-col gap-2 items-center justify-center overflow-hidden relative rounded-[4px] shrink-0 size-6",
                    isActive && "bg-[#e6e8ff]"
                  )}
                >
                  <p className={cn(
                    "font-medium leading-[1.4] relative shrink-0 text-[12px] text-nowrap tracking-[-0.12px] whitespace-pre",
                    isActive ? "text-[#0019ff]" : "text-[#9296a0]"
                  )}>
                    {pageNum}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "flex gap-1 h-full items-center justify-center overflow-hidden relative shrink-0",
              currentPage === totalPages && "opacity-50 cursor-not-allowed"
            )}
          >
            <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
              Next
            </p>
            <div className="flex items-center justify-center relative shrink-0 size-4">
              <ChevronRight className="size-4 text-[#9296a0]" />
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

