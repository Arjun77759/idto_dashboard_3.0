import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Trash2, Minus, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import type { InputField } from '@/config/apiEndpoints'

interface ArrayOfObjectsInputProps {
  fieldName: string
  field: InputField
  value: any[]
  onChange: (value: any[]) => void
  itemSchema?: Record<string, any> // Schema for items in the array
  onKeyPress?: (e: React.KeyboardEvent) => void
}

const ArrayOfObjectsInput = ({
  fieldName,
  field,
  value = [],
  onChange,
  itemSchema = {},
  onKeyPress
}: ArrayOfObjectsInputProps) => {
  const [collapsedObjects, setCollapsedObjects] = useState<Set<number>>(new Set())

  const addObject = () => {
    const newObject: Record<string, any> = {}
    // Initialize with empty values based on schema
    if (field.example && Array.isArray(field.example) && field.example.length > 0) {
      const exampleObj = field.example[0]
      Object.keys(exampleObj).forEach(key => {
        if (typeof exampleObj[key] === 'object' && exampleObj[key] !== null && !Array.isArray(exampleObj[key])) {
          // Nested object (like signer_position)
          newObject[key] = {}
          Object.keys(exampleObj[key]).forEach(nestedKey => {
            newObject[key][nestedKey] = typeof exampleObj[key][nestedKey] === 'boolean' ? false : ''
          })
        } else if (Array.isArray(exampleObj[key])) {
          newObject[key] = []
        } else if (typeof exampleObj[key] === 'boolean') {
          newObject[key] = false
        } else {
          newObject[key] = ''
        }
      })
      } else {
        // Fallback: create empty object structure based on common eSign fields
        if (fieldName === 'documents') {
          newObject.reference_doc_id = ''
          newObject.content_type = ''
          newObject.content = ''
          newObject.signature_sequence = ''
          newObject.return_url = ''
        } else if (fieldName === 'signers_info') {
          newObject.signer_ref_id = ''
          newObject.signer_name = ''
          newObject.signer_email = ''
          newObject.signer_mobile = ''
          newObject.signature_type = ''
          newObject.authentication_mode = ''
          newObject.document_to_be_signed = ''
          // Store page_number, sequence, and trigger_esign_request inside signer_position for UI
          // They will be extracted to top level when building JSON payload
          newObject.signer_position = { 
            appearance: '',
            page_number: '',
            sequence: '',
            trigger_esign_request: false
          }
        }
      }
    onChange([...value, newObject])
  }

  const removeObject = (index: number) => {
    const newValue = value.filter((_, i) => i !== index)
    onChange(newValue)
    // Remove from collapsed set
    const newCollapsed = new Set(collapsedObjects)
    newCollapsed.delete(index)
    setCollapsedObjects(newCollapsed)
  }

  const toggleCollapse = (index: number) => {
    const newCollapsed = new Set(collapsedObjects)
    if (newCollapsed.has(index)) {
      newCollapsed.delete(index)
    } else {
      newCollapsed.add(index)
    }
    setCollapsedObjects(newCollapsed)
  }

  const updateObjectField = (objectIndex: number, fieldKey: string, fieldValue: any, isNested = false, nestedKey?: string) => {
    const newValue = [...value]
    if (isNested && nestedKey) {
      if (!newValue[objectIndex][fieldKey]) {
        newValue[objectIndex][fieldKey] = {}
      }
      newValue[objectIndex][fieldKey][nestedKey] = fieldValue
    } else {
      newValue[objectIndex][fieldKey] = fieldValue
    }
    onChange(newValue)
  }

  const renderField = (
    key: string,
    fieldValue: any,
    objectIndex: number,
    isNested = false,
    parentKey?: string,
    exampleValue?: any
  ) => {
    const fieldType = typeof fieldValue === 'boolean' ? 'boolean' : 
                     typeof fieldValue === 'number' ? 'number' : 'string'
    
    // Check if this is a nested object (like signer_position)
    if (typeof fieldValue === 'object' && fieldValue !== null && !Array.isArray(fieldValue)) {
      const nestedObjKey = `${objectIndex}-${key}`
      const isNestedCollapsed = collapsedObjects.has(parseInt(nestedObjKey))
      
      return (
        <div key={key} className="flex flex-col gap-2 w-full border border-gray-200 rounded-lg p-3 bg-gray-50">
          <div className="flex items-center justify-between">
            <label className="font-medium text-[11px] text-[#616675] uppercase">
              {key.replace(/_/g, ' ')}
            </label>
            <button
              type="button"
              onClick={() => {
                const newCollapsed = new Set(collapsedObjects)
                if (newCollapsed.has(parseInt(nestedObjKey))) {
                  newCollapsed.delete(parseInt(nestedObjKey))
                } else {
                  newCollapsed.add(parseInt(nestedObjKey))
                }
                setCollapsedObjects(newCollapsed)
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              {isNestedCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </button>
          </div>
          {!isNestedCollapsed && (
            <div className="flex flex-col gap-2">
              {Object.entries(fieldValue).map(([nestedKey, nestedValue]) => 
                renderField(nestedKey, nestedValue, objectIndex, true, key, exampleValue?.[nestedKey])
              )}
            </div>
          )}
        </div>
      )
    }

    // Handle enum/select fields (like signature_sequence)
    if (key === 'signature_sequence') {
      const currentValue = isNested && parentKey 
        ? value[objectIndex]?.[parentKey]?.[key] 
        : value[objectIndex]?.[key]
      
      return (
        <div key={key} className="flex flex-col gap-1 w-full">
          <label className="font-medium text-[11px] text-[#616675]">
            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex gap-2">
            {['sequential', 'parallel'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateObjectField(objectIndex, key, option, isNested, parentKey)}
                className={`px-3 py-1.5 rounded text-[12px] border ${
                  currentValue === option
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )
    }

    // Handle appearance field (can be string or array)
    if (key === 'appearance') {
      const currentValue = isNested && parentKey 
        ? value[objectIndex]?.[parentKey]?.[key] 
        : value[objectIndex]?.[key]
      
      return (
        <div key={key} className="flex flex-col gap-1 w-full">
          <label className="font-medium text-[11px] text-[#616675]">
            {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {['bottom-left', 'bottom-right', 'top-left', 'top-right'].map(option => (
              <button
                key={option}
                type="button"
                onClick={() => updateObjectField(objectIndex, key, option, isNested, parentKey)}
                className={`px-3 py-1.5 rounded text-[12px] border ${
                  (Array.isArray(currentValue) && currentValue.includes(option)) || currentValue === option
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )
    }

    // Regular input field
    return (
      <div key={key} className="flex flex-col gap-1 w-full">
        <label className="font-medium text-[11px] text-[#616675]">
          {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
          {(key === 'reference_doc_id' || key === 'content_type' || key === 'content' || 
           key === 'signer_ref_id' || key === 'signer_name' || key === 'signer_email' || 
           key === 'signer_mobile' || key === 'signature_type' || key === 'authentication_mode' ||
           key === 'document_to_be_signed' || key === 'sequence' || key === 'appearance' || 
           key === 'page_number') ? (
            <span className="text-red-500 ml-1">*</span>
          ) : null}
        </label>
        {fieldType === 'boolean' ? (
          <div className="flex items-center gap-2">
            <select
              value={fieldValue === true ? 'true' : fieldValue === false ? 'false' : ''}
              onChange={(e) => updateObjectField(objectIndex, key, e.target.value === 'true', isNested, parentKey)}
              className="w-full border border-[#e7e8ea] rounded-lg px-3 py-2 text-[12px] h-9"
            >
              <option value="">Select...</option>
              <option value="true">true</option>
              <option value="false">false</option>
            </select>
          </div>
        ) : (
          <Input
            type={fieldType === 'number' ? 'number' : key.includes('email') ? 'email' : key.includes('url') ? 'url' : 'text'}
            value={fieldValue || ''}
            onChange={(e) => {
              const val = fieldType === 'number' ? parseFloat(e.target.value) || 0 : e.target.value
              updateObjectField(objectIndex, key, val, isNested, parentKey)
            }}
            onKeyDown={onKeyPress}
            placeholder={exampleValue ? `e.g., ${String(exampleValue)}` : ''}
            className="w-full border-[#e7e8ea] h-9 text-[12px]"
          />
        )}
      </div>
    )
  }

  if (value.length === 0) {
    return (
      <div className="flex flex-col gap-2 w-full">
        <div className="flex items-center justify-between">
          <label className="font-medium text-[12px] text-[#616675]">
            {fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
            <span className="text-gray-400 text-[11px] ml-2">array of objects</span>
            {field.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        </div>
        <Button
          type="button"
          onClick={addObject}
          className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Object
        </Button>
        {field.description && (
          <p className="font-normal text-[11px] text-[#9296a0]">{field.description}</p>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <div className="flex items-center justify-between">
        <label className="font-medium text-[12px] text-[#616675]">
          {fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} 
          <span className="text-gray-400 text-[11px] ml-2">array of objects</span>
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      </div>

      {value.map((obj, index) => {
        const isCollapsed = collapsedObjects.has(index)
        const exampleObj = field.example && Array.isArray(field.example) ? field.example[0] : {}

        return (
          <div key={index} className="border border-gray-300 rounded-lg p-4 bg-white">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200">
              <span className="font-medium text-[11px] text-gray-600 uppercase">Object</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleCollapse(index)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                  title={isCollapsed ? 'Expand' : 'Collapse'}
                >
                  {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={() => removeObject(index)}
                  className="text-red-400 hover:text-red-600 p-1"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isCollapsed && (
              <div className="flex flex-col gap-3">
                {Object.entries(obj).map(([key, fieldValue]) => 
                  renderField(key, fieldValue, index, false, undefined, exampleObj[key])
                )}
              </div>
            )}
          </div>
        )
      })}

      <Button
        type="button"
        onClick={addObject}
        variant="outline"
        className="w-full sm:w-auto border-dashed"
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Object
      </Button>

      {field.description && (
        <p className="font-normal text-[11px] text-[#9296a0]">{field.description}</p>
      )}
    </div>
  )
}

export default ArrayOfObjectsInput
