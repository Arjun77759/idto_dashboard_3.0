import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, ChevronDown } from 'lucide-react'

interface ApiFiltersProps {
  onSearch?: (query: string) => void
  onFilterChange?: (filters: { solution: string; type: string }) => void
}

const ApiFilters = ({ onSearch, onFilterChange }: ApiFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({
    solution: 'All',
    type: 'All'
  })

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleFilterChange = (key: 'solution' | 'type', value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange?.(newFilters)
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search Field */}
      <div className="bg-white border border-[#e7e8ea] border-solid flex gap-2 h-[45px] items-center px-4 py-2 relative rounded-lg shrink-0 w-full">
        <Search className="size-6 text-[#9296a0]" />
        <input
          type="text"
          placeholder="Search for Id, name product etc"
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 bg-transparent border-0 outline-none text-[12px] text-[#9296a0] placeholder:text-[#9296a0] font-normal leading-[1.4] tracking-[-0.12px]"
        />
      </div>

      {/* Filter Controls */}
      <div className="flex gap-2 items-center p-0 relative rounded shrink-0 w-full">
        <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
          Filters :
        </p>
        
        <Button
          variant="outline"
          className="border-[#e7e8ea] h-auto px-2 py-3.5 rounded-lg"
          onClick={() => handleFilterChange('solution', filters.solution === 'Solution' ? 'All' : 'Solution')}
        >
          <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Solution
          </p>
          <ChevronDown className="size-4 ml-1 text-[#9296a0]" />
        </Button>

        <Button
          variant="outline"
          className="border-[#e7e8ea] h-auto px-2 py-3.5 rounded-lg"
          onClick={() => handleFilterChange('type', filters.type === 'Type' ? 'All' : 'Type')}
        >
          <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Type
          </p>
          <ChevronDown className="size-4 ml-1 text-[#9296a0]" />
        </Button>
      </div>
    </div>
  )
}

export default ApiFilters
