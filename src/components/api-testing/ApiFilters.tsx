import { useState, useEffect } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Search, X } from 'lucide-react'
import { getAllCategories } from '@/config/apiEndpoints'

interface ApiFiltersProps {
  onSearch?: (query: string) => void
  onCategoryChange?: (category: string) => void
}

const ApiFilters = ({ onSearch, onCategoryChange }: ApiFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    // Load categories from API config
    const cats = getAllCategories()
    setCategories(cats)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch?.(query)
  }

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value)
    onCategoryChange?.(value)
  }

  const handleReset = () => {
    setSearchQuery('')
    setSelectedCategory('All')
    onSearch?.('')
    onCategoryChange?.('All')
  }

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== 'All'

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Search Field */}
      <div className="bg-white border border-[#e7e8ea] border-solid flex gap-2 h-[45px] items-center px-4 py-2 relative rounded-lg shrink-0 w-full">
        <Search className="size-5 text-[#9296a0]" />
        <input
          type="text"
          placeholder="Search for Id, name, description..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1 bg-transparent border-0 outline-none text-[12px] text-[#131b31] placeholder:text-[#9296a0] font-normal leading-[1.4] tracking-[-0.12px]"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => {
              setSearchQuery('')
              onSearch?.('')
            }}
            className="h-6 w-6 text-[#9296a0] hover:text-[#131b31] hover:bg-transparent p-0"
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      <div className="flex flex-col gap-2 items-start p-0 relative rounded shrink-0 w-full">
        <div className="flex items-center justify-between w-full">
          <p className="font-medium leading-[1.4] relative shrink-0 text-[12px] text-[#616675] text-nowrap tracking-[-0.12px] whitespace-pre">
            Category
          </p>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-auto py-1 px-2 text-[11px] text-[#0019ff] hover:text-[#0019ff] hover:bg-[#e6e8ff]"
            >
              <X className="size-3 mr-1" />
              Reset
            </Button>
          )}
        </div>
        
        <Select value={selectedCategory} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full border-[#e7e8ea] h-10 text-[12px] text-[#131b31]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category} className="text-[12px]">
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

export default ApiFilters
