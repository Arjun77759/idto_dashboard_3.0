import { Layers } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export interface WorkflowOption {
  id: string
  name: string
}

const ALL_WORKFLOWS = 'all'

interface WorkflowFilterSelectProps {
  options: WorkflowOption[]
  value: string
  onChange: (value: string) => void
}

const WorkflowFilterSelect = ({ options, value, onChange }: WorkflowFilterSelectProps) => {
  if (options.length < 2) return null

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="h-auto w-[200px] px-3 py-2.5 text-[13px] font-medium text-[#131b31] border-[#e7e8ea]">
        <Layers className="size-4 mr-1.5 text-[#9296a0]" />
        <SelectValue placeholder="All workflows" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_WORKFLOWS}>All workflows</SelectItem>
        {options.map((option) => (
          <SelectItem key={option.id} value={option.id}>
            {option.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export { ALL_WORKFLOWS }
export default WorkflowFilterSelect
