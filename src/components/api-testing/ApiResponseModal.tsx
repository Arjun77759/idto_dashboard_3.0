import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { CodeXml, Copy, List, ExternalLink, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface ApiResponseModalProps {
  isOpen: boolean
  onClose: () => void
  response?: {
    success: boolean
    data?: any
    error?: any
    statusCode: number
    responseTime: number
    message: string
  }
}

const ApiResponseModal = ({ isOpen, onClose, response }: ApiResponseModalProps) => {
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table')
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }
    
    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const [copiedUrl, setCopiedUrl] = useState('')

  // Parse response data (from old dashboard pattern)
  const responseData = response?.success ? response.data : response?.error
  const parsedData = typeof responseData === 'string'
    ? (() => { try { return JSON.parse(responseData) } catch { return {} } })()
    : responseData || {}

  // Format field name (from old dashboard)
  const formatFieldName = (key: string) => {
    return key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
      .split('.')
      .pop() || key
  }

  // Check if value is a URL
  const isUrl = (value: any): boolean => {
    if (typeof value !== 'string') return false
    return value.startsWith('http://') || value.startsWith('https://')
  }

  // Handle URL copy
  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    setCopiedUrl(url)
    setTimeout(() => setCopiedUrl(''), 2000)
  }

  // Recursive function to render table rows (from old dashboard OutputBox)
  const renderTableRows = (data: any, parentKey: string = ''): React.JSX.Element[] => {
    if (!data || typeof data !== 'object') return []

    return Object.entries(data).map(([key, value]) => {
      const fullKey = parentKey ? `${parentKey}.${key}` : key
      const isArray = Array.isArray(value)
      const isObject = typeof value === 'object' && value !== null && !isArray

      if (isArray) {
        return (
          <TableRow key={fullKey} className="border-b border-gray-100">
            <TableCell className="py-2 px-2 font-medium text-gray-700">
              {formatFieldName(fullKey)} []
            </TableCell>
            <TableCell className="py-2 px-2 text-gray-600">
              <div className="pl-4 space-y-2">
                {value.map((item, index) => (
                  <div key={index}>
                    <div className="font-medium text-gray-600 mb-1 text-xs">
                      Item {index + 1}:
                    </div>
                    {typeof item === 'object' && item !== null ? (
                      <div className="border border-gray-200 rounded overflow-hidden">
                        <Table>
                          <TableBody>
                            {renderTableRows(item, `${fullKey}[${index}]`)}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <div className="pl-4 text-gray-600 text-sm">{String(item)}</div>
                    )}
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        )
      }

      if (isObject) {
        return (
          <TableRow key={fullKey} className="border-b border-gray-100">
            <TableCell className="py-2 px-2 font-medium text-gray-700">
              {formatFieldName(fullKey)}
            </TableCell>
            <TableCell className="py-2 px-2 text-gray-600">
              <div className="pl-4">
                <div className="border border-gray-200 rounded overflow-hidden">
                  <Table>
                    <TableBody>
                      {renderTableRows(value, fullKey)}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </TableCell>
          </TableRow>
        )
      }

      if (isUrl(value)) {
        return (
          <TableRow key={fullKey} className="border-b border-gray-100">
            <TableCell className="py-2 px-2 font-medium text-gray-700">
              {formatFieldName(fullKey)}
            </TableCell>
            <TableCell className="py-2 px-2 text-gray-600">
              <div className="flex items-center gap-2">
                <span className="text-blue-600 font-mono text-xs break-all">{String(value)}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 px-2"
                  onClick={() => handleCopyUrl(String(value))}
                  title="Copy URL"
                >
                  {copiedUrl === value ? <CheckCircle className="size-3 text-green-500" /> : <Copy className="size-3 text-gray-500" />}
                </Button>
                <a
                  href={String(value)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 hover:bg-gray-100 rounded"
                  title="Open URL"
                >
                  <ExternalLink className="size-3 text-gray-500" />
                </a>
              </div>
            </TableCell>
          </TableRow>
        )
      }

      return (
        <TableRow key={fullKey} className="border-b border-gray-100">
          <TableCell className="py-2 px-2 font-medium text-gray-700">
            {formatFieldName(fullKey)}
          </TableCell>
          <TableCell className="py-2 px-2 text-gray-600 text-sm">
            {String(value)}
          </TableCell>
        </TableRow>
      )
    })
  }

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(parsedData, null, 2))
  }

  const ModalContent = () => (
    <div className="flex flex-col gap-2.5 h-full">
      {/* Header with tabs - Fixed at top */}
      <div className="flex items-center justify-between w-full px-4 pt-4">
        <div className="flex gap-2.5 items-start">
          <button
            onClick={() => setActiveTab('table')}
            className={`flex gap-4 items-center px-4 py-2 rounded-2xl ${activeTab === 'table'
              ? 'bg-blue-50'
              : 'bg-gray-50'
              }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <List className={`${activeTab === 'table' ? 'text-blue-600' : 'text-gray-400'} w-4 h-4 ml-[2px]`} />
            </div>
            <p className={`text-xs font-medium whitespace-nowrap ${activeTab === 'table'
              ? 'text-blue-600'
              : 'text-gray-400'
              }`}>
              Table Output
            </p>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex gap-4 items-center px-4 py-2 rounded-2xl ${activeTab === 'json'
              ? 'bg-blue-50'
              : 'bg-gray-50'
              }`}
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <CodeXml className={`${activeTab === 'json' ? 'text-blue-600' : 'text-gray-400'} w-4 h-4 ml-[2px]`} />
            </div>
            <p className={`text-xs font-medium whitespace-nowrap ${activeTab === 'json'
              ? 'text-blue-600'
              : 'text-gray-400'
              }`}>
              JSON
            </p>
          </button>
        </div>
      </div>

      {/* Response Metadata - Fixed below tabs */}
      {response && (
        <div className="flex flex-wrap gap-2 pb-3 px-4 border-b border-gray-200">
          <div className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
            response.success
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700'
          }`}>
            {response.statusCode} {response.success ? 'Success' : 'Error'}
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 text-xs font-medium">
            {response.responseTime}ms
          </div>
          <div className="px-3 py-1.5 rounded-lg bg-gray-50 text-gray-700 text-xs font-medium">
            {response.message}
          </div>
        </div>
      )}

      {/* Content based on active tab - Scrollable */}
      {activeTab === 'table' ? (
        /* Table using shadcn components - Dynamic rendering from old dashboard */
        <div className="flex-1 min-h-0 overflow-hidden px-4 pb-4">
          <div className="bg-white border border-gray-200 rounded-2xl h-full overflow-y-auto">
            {response ? (
              <Table>
                <TableBody>
                  {renderTableRows(parsedData)}
                </TableBody>
              </Table>
            ) : (
              <div className="flex items-center justify-center p-8 text-gray-400 text-sm">
                No response data available
              </div>
            )}
          </div>
        </div>
      ) : (
        /* JSON view */
        <div className="flex-1 min-h-0 overflow-hidden px-4 pb-4">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl h-full flex flex-col overflow-hidden">
            {/* Copy button - Sticky at top */}
            <div className="flex justify-end p-4 border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
              <button
                onClick={handleCopyJson}
                className="bg-white border border-gray-200 rounded px-4 py-2 flex items-center gap-1 hover:bg-gray-50 transition-colors"
              >
                <span className="text-xs font-medium text-gray-600">Copy</span>
                <div className="w-4 h-4 flex items-center justify-center">
                  <Copy className="w-4 h-4 text-gray-600 ml-[2px]" />
                </div>
              </button>
            </div>

            {/* JSON content - Scrollable */}
            <div className="flex-1 overflow-auto p-4">
              {response ? (
                <pre className="whitespace-pre-wrap text-gray-700 text-xs sm:text-sm leading-6">
                  {JSON.stringify(parsedData, null, 2)}
                </pre>
              ) : (
                <div className="flex items-center justify-center p-8 text-gray-400 text-sm">
                  No response data available
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <>
      {isMobile ? (
        /* Mobile Bottom Sheet */
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent side="bottom" className="h-[80vh] p-0 flex flex-col">
            <ModalContent />
          </SheetContent>
        </Sheet>
      ) : (
        /* Desktop Modal */
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-4xl w-[776px] h-[80vh] max-h-[600px] overflow-hidden p-0 flex flex-col">
            <ModalContent />
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}

export default ApiResponseModal
