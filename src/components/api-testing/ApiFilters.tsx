import { useState } from 'react'
import { Button } from '@/components/ui/button'

// Image assets from Figma
const imgSearch = "http://localhost:3845/assets/dd51b8c4adb7c8615abf036bb45f6c82ed4a7815.svg"
const imgArrowDown = "http://localhost:3845/assets/ff0fc17489d3d953c2fc499240c7f604473bcade.svg"

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
        <div className="relative shrink-0 size-6">
          <div className="absolute inset-[16.67%_20.83%_20.83%_16.67%]">
            <img alt="" className="block max-w-none size-full" src={imgSearch} />
          </div>
        </div>
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
          <div className="flex items-center justify-center relative shrink-0 size-4 ml-1">
            <div className="flex-none rotate-180">
              <div className="overflow-hidden relative size-4">
                <div className="absolute inset-[37.5%_25%]">
                  <img alt="" className="block max-w-none size-full" src={imgArrowDown} />
                </div>
              </div>
            </div>
          </div>
        </Button>

        <Button
          variant="outline"
          className="border-[#e7e8ea] h-auto px-2 py-3.5 rounded-lg"
          onClick={() => handleFilterChange('type', filters.type === 'Type' ? 'All' : 'Type')}
        >
          <p className="font-medium leading-[1.4] text-[12px] text-[#9296a0] text-nowrap tracking-[-0.12px] whitespace-pre">
            Type
          </p>
          <div className="flex items-center justify-center relative shrink-0 size-4 ml-1">
            <div className="flex-none rotate-180">
              <div className="overflow-hidden relative size-4">
                <div className="absolute inset-[37.5%_25%]">
                  <img alt="" className="block max-w-none size-full" src={imgArrowDown} />
                </div>
              </div>
            </div>
          </div>
        </Button>
      </div>
    </div>
  )
}

export default ApiFilters
