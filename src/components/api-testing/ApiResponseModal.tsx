import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { CodeXml, Copy, List } from 'lucide-react'
import { useState } from 'react'

interface ApiResponseModalProps {
  isOpen: boolean
  onClose: () => void
  response?: any
}

const ApiResponseModal = ({ isOpen, onClose, response }: ApiResponseModalProps) => {
  const [activeTab, setActiveTab] = useState<'table' | 'json'>('table')

  // Sample JSON response based on the Figma design
  const jsonResponse = {
    status: "success",
    message: "Verification Successful",
    data: {
      full_name: "John Doe",
      pan_number: "ABCDE1234F",
      gender: "Male",
      date_of_birth: "1980-01-01",
      category: "Individual",
      verified_on: "2025-09-24T14:48:00Z",
      verification_status: "KYC Completed"
    }
  }

  // Use response prop if available, otherwise use sample data
  const actualResponse = response || jsonResponse

  // Sample data structure based on the Figma design
  const tableData = [
    {
      field: "Status",
      value: "Success",
      description: "Verification status",
      valueColor: "text-[#298e1c]"
    },
    {
      field: "Full Name",
      value: "John Doe",
      description: "Verified full name of the user",
      valueColor: "text-[#9296a0]"
    },
    {
      field: "PAN Number",
      value: "ABCDE1234F",
      description: "PAN card number verified",
      valueColor: "text-[#9296a0]"
    },
    {
      field: "Gender",
      value: "Male",
      description: "Gender of the user",
      valueColor: "text-[#9296a0]"
    },
    {
      field: "Date of Birth",
      value: "01/01/1980",
      description: "Verified date of birth",
      valueColor: "text-[#9296a0]"
    },
    {
      field: "Category",
      value: "Individual",
      description: "User category type",
      valueColor: "text-[#9296a0]"
    },
    {
      field: "Verified On",
      value: "Sep 24, 2025, 2:48 PM",
      description: "Timestamp of verification completion",
      valueColor: "text-[#9296a0]"
    }
  ]

  const handleCopyJson = () => {
    navigator.clipboard.writeText(JSON.stringify(actualResponse, null, 2))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] h-[468px] w-[776px] overflow-hidden p-0">
        <div className="bg-white border border-gray-200 rounded-2xl w-full h-full">
          <div className="flex flex-col gap-2.5 p-4 h-full">
            {/* Header with tabs - removed custom close button */}
            <div className="flex items-center justify-between w-full">
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

            {/* Content based on active tab */}
            {activeTab === 'table' ? (
              /* Table using shadcn components */
              <div className="bg-white border border-gray-200 rounded-2xl flex-1 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white">
                      <TableHead className="w-[205px] text-sm font-normal text-gray-800">
                        Field
                      </TableHead>
                      <TableHead className="w-[194px] text-sm font-normal text-gray-800">
                        Value
                      </TableHead>
                      <TableHead className="text-sm font-normal text-gray-800">
                        Description
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tableData.map((row, index) => (
                      <TableRow key={index} className="bg-gray-50">
                        <TableCell className="w-[205px] text-sm font-normal text-gray-400">
                          {row.field}
                        </TableCell>
                        <TableCell className={`w-[194px] text-sm font-normal ${row.valueColor}`}>
                          {row.value}
                        </TableCell>
                        <TableCell className="text-sm font-normal text-gray-400">
                          {row.description}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              /* JSON view */
              <div className="bg-gray-50 border border-gray-200 rounded-2xl flex-1 overflow-hidden">
                <div className="flex flex-col h-full p-4">
                  {/* Copy button */}
                  <div className="flex justify-end mb-4">
                    <button
                      onClick={handleCopyJson}
                      className="bg-white border border-gray-200 rounded px-4 py-2 flex items-center gap-1"
                    >
                      <span className="text-xs font-medium text-gray-400">Copy</span>
                      <div className="w-4 h-4 flex items-center justify-center">
                        <Copy className="w-4 h-4 text-gray-400 ml-[2px]" />
                      </div>
                    </button>
                  </div>

                  {/* JSON content */}
                  <div className="flex-1 font-mono text-sm text-gray-400 leading-6 overflow-auto">
                    <pre className="whitespace-pre-wrap">
                      <span className="text-gray-400">{"{ "}</span>
                      <br />
                      <span className="text-gray-400">  "status": "</span><span className="text-green-600">success</span><span className="text-gray-400">", </span>
                      <br />
                      <span className="text-gray-400">  "message": "Verification Successful", </span>
                      <br />
                      <span className="text-gray-400">  "data": {"{ "}</span>
                      <br />
                      <span className="text-gray-400">    "full_name": "John Doe", </span>
                      <br />
                      <span className="text-gray-400">    "pan_number": "ABCDE1234F", </span>
                      <br />
                      <span className="text-gray-400">    "gender": "Male", </span>
                      <br />
                      <span className="text-gray-400">    "date_of_birth": "1980-01-01", </span>
                      <br />
                      <span className="text-gray-400">    "category": "Individual", </span>
                      <br />
                      <span className="text-gray-400">    "verified_on": "2025-09-24T14:48:00Z", </span>
                      <br />
                      <span className="text-gray-400">    "verification_status": "</span><span className="text-green-600">KYC Completed</span><span className="text-gray-400">" </span>
                      <br />
                      <span className="text-gray-400">  {"} "}</span>
                      <br />
                      <span className="text-gray-400">{"} "}</span>
                    </pre>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ApiResponseModal
