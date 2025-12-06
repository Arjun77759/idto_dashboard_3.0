import type { ApiEndpoint, InputField } from '@/config/apiEndpoints'

const OPENAPI_URL = 'https://idto-sdk-usage-demo-bucket.s3.ap-south-1.amazonaws.com/openapi.json'

// Map OpenAPI tags to categories
const TAG_TO_CATEGORY_MAP: Record<string, ApiEndpoint['category']> = {
  'PAN Verification': 'Identity Verification',
  'Bank Verification': 'Identity Verification',
  'UAN Verification': 'Identity Verification',
  'Voter Verification': 'Identity Verification',
  'Passport Verification': 'Identity Verification',
  'Driving Licence Verification': 'Identity Verification',
  'Business Verification': 'Business Verification',
  'Company Verification': 'Business Verification',
  'GST Verification': 'Business Verification',
  'Business PAN Verification': 'Business Verification',
  'DigiLocker': 'DigiLocker',
  'OCR': 'Document Verification',
  'Face Match': 'Document Verification',
  'Name Match': 'Document Verification',
  'Liveness': 'Document Verification',
  'Mobile Profile': 'Data Linkage',
  'Mobile to PAN': 'Data Linkage',
  'Mobile to GST': 'Data Linkage',
  'PAN to GST': 'Data Linkage',
  'Vehicle RC Verification': 'Vehicle Verification',
  'Employment': 'Identity Verification',
  'eSign': 'Document Verification',
}

// Default credit cost (can be overridden if needed)
const DEFAULT_CREDIT = 10

interface OpenAPISchema {
  type: string
  properties?: Record<string, any>
  required?: string[]
  format?: string
  description?: string
  example?: any
  items?: OpenAPISchema
  nullable?: boolean
  enum?: any[]
  $ref?: string
  minLength?: number
  maxLength?: number
  pattern?: string
  minimum?: number
  maximum?: number
}

interface OpenAPIPath {
  post?: {
    tags?: string[]
    summary?: string
    description?: string
    requestBody?: {
      content?: {
        'application/json'?: {
          schema?: OpenAPISchema
        }
        'multipart/form-data'?: {
          schema?: OpenAPISchema
        }
      }
    }
    responses?: {
      '200'?: {
        content?: {
          'application/json'?: {
            schema?: any
          }
        }
      }
    }
  }
}

interface OpenAPISpec {
  paths: Record<string, OpenAPIPath>
  components?: {
    schemas?: Record<string, OpenAPISchema>
  }
}

function convertSchemaToInputField(
  schema: OpenAPISchema,
  isRequired: boolean,
  propertyName: string
): InputField {
  let type: InputField['type'] = 'string'
  let example: any = ''

  // Determine type from schema
  if (schema.type === 'integer' || schema.type === 'number') {
    type = 'number'
    example = schema.example ?? 0
  } else if (schema.type === 'boolean') {
    type = 'boolean'
    example = schema.example ?? false
  } else if (schema.format === 'date' || schema.format === 'date-time') {
    type = 'date'
    example = schema.example ?? '2024-01-01'
  } else if (schema.format === 'email') {
    type = 'email'
    example = schema.example ?? 'example@email.com'
  } else if (schema.format === 'uri' || schema.format === 'url') {
    type = 'url'
    example = schema.example ?? 'https://example.com'
  } else if (schema.format === 'binary' || propertyName.toLowerCase().includes('file') || propertyName.toLowerCase().includes('image')) {
    type = 'file'
    example = 'file.jpg'
  } else {
    type = 'string'
    example = schema.example ?? schema.description ?? ''
  }

  const validation: InputField['validation'] = {}
  
  if (schema.type === 'string') {
    if (schema.minLength !== undefined) validation.minLength = schema.minLength
    if (schema.maxLength !== undefined) validation.maxLength = schema.maxLength
    if (schema.pattern) validation.pattern = schema.pattern
  } else if (schema.type === 'number' || schema.type === 'integer') {
    if (schema.minimum !== undefined) validation.min = schema.minimum
    if (schema.maximum !== undefined) validation.max = schema.maximum
  }

  return {
    type,
    required: isRequired,
    description: schema.description,
    example,
    validation: Object.keys(validation).length > 0 ? validation : undefined,
  }
}

function resolveSchema(schema: any, schemas?: Record<string, OpenAPISchema>): OpenAPISchema {
  if (schema.$ref) {
    const refName = schema.$ref.split('/').pop()
    if (refName && schemas?.[refName]) {
      return resolveSchema(schemas[refName], schemas)
    }
  }
  return schema
}

function extractSampleInput(
  postSpec: OpenAPIPath['post'],
  schemas?: Record<string, OpenAPISchema>
): Record<string, InputField> {
  const sampleInput: Record<string, InputField> = {}

  if (!postSpec?.requestBody?.content) return sampleInput

  const requestBody = postSpec.requestBody
  if (!requestBody?.content) return sampleInput
  
  // Try JSON first, then multipart
  const jsonSchema = requestBody.content['application/json']?.schema
  const multipartSchema = requestBody.content['multipart/form-data']?.schema
  let schema = jsonSchema || multipartSchema

  if (!schema) return sampleInput

  // Resolve $ref if present
  schema = resolveSchema(schema, schemas)

  if (schema.type !== 'object' || !schema.properties) {
    return sampleInput
  }

  const requiredFields = schema.required || []

  Object.entries(schema.properties).forEach(([key, propSchema]) => {
    // Resolve $ref references
    const resolvedSchema = resolveSchema(propSchema, schemas)
    const isRequired = requiredFields.includes(key)
    sampleInput[key] = convertSchemaToInputField(resolvedSchema, isRequired, key)
  })

  return sampleInput
}

function generateSampleOutput(responseSchema: any, schemas?: Record<string, OpenAPISchema>): any {
  if (!responseSchema) {
    return { status: 'success', message: 'API call successful' }
  }

  // Resolve $ref
  const resolved = resolveSchema(responseSchema, schemas)

  // Handle object type
  if (resolved.type === 'object' && resolved.properties) {
    const output: any = {}
    Object.entries(resolved.properties).forEach(([key, prop]: [string, any]) => {
      const resolvedProp = resolveSchema(prop, schemas)
      
      if (resolvedProp.type === 'string') {
        output[key] = resolvedProp.example ?? `sample_${key}`
      } else if (resolvedProp.type === 'number' || resolvedProp.type === 'integer') {
        output[key] = resolvedProp.example ?? 0
      } else if (resolvedProp.type === 'boolean') {
        output[key] = resolvedProp.example ?? false
      } else if (resolvedProp.type === 'array') {
        if (resolvedProp.items) {
          const itemSchema = resolveSchema(resolvedProp.items, schemas)
          output[key] = [generateSampleOutput(itemSchema, schemas)]
        } else {
          output[key] = []
        }
      } else if (resolvedProp.type === 'object') {
        output[key] = generateSampleOutput(resolvedProp, schemas)
      } else {
        output[key] = null
      }
    })
    return output
  }

  // Handle array type
  if (resolved.type === 'array' && resolved.items) {
    const itemSchema = resolveSchema(resolved.items, schemas)
    return [generateSampleOutput(itemSchema, schemas)]
  }

  // Default response
  return { status: 'success', message: 'API call successful' }
}

function getCategoryFromTags(tags?: string[]): ApiEndpoint['category'] {
  if (!tags || tags.length === 0) return 'Identity Verification'
  
  const tag = tags[0]
  return TAG_TO_CATEGORY_MAP[tag] || 'Identity Verification'
}

function getContentType(postSpec?: OpenAPIPath['post']): ApiEndpoint['contentType'] {
  if (!postSpec?.requestBody?.content) return 'application/json'
  
  if (postSpec.requestBody.content['multipart/form-data']) {
    return 'multipart/form-data'
  }
  
  return 'application/json'
}

function pathToId(path: string): string {
  // Remove leading slash and convert to snake_case
  return path
    .replace(/^\//, '')
    .replace(/\//g, '_')
    .toLowerCase()
}

function pathToName(path: string, summary?: string): string {
  if (summary) return summary
  
  // Convert path to readable name
  return path
    .replace(/^\//, '')
    .replace(/\//g, ' ')
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export async function fetchOpenAPISpec(): Promise<OpenAPISpec> {
  const response = await fetch(OPENAPI_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`)
  }
  return response.json()
}

export function transformOpenAPIToEndpoints(spec: OpenAPISpec): ApiEndpoint[] {
  const endpoints: ApiEndpoint[] = []
  const schemas = spec.components?.schemas || {}

  Object.entries(spec.paths).forEach(([path, pathSpec]) => {
    const postSpec = pathSpec.post
    if (!postSpec) return

    const id = pathToId(path)
    const tags = postSpec.tags || []
    const category = getCategoryFromTags(tags)
    const contentType = getContentType(postSpec)
    const summary = postSpec.summary || ''
    const description = postSpec.description || summary

    // Extract request schema
    const sampleInput = extractSampleInput(postSpec, schemas)

    // Extract response schema
    const responseSchema = postSpec.responses?.['200']?.content?.['application/json']?.schema
    const sampleOutput = generateSampleOutput(responseSchema, schemas)

    // Only add endpoint if it has at least some input fields or is a valid endpoint
    // Some endpoints might have empty request bodies, which is fine
    endpoints.push({
      id,
      name: pathToName(path, summary),
      shortDescription: summary || (description ? description.substring(0, 100) : 'API endpoint'),
      longDescription: description || summary || 'API endpoint',
      credit: DEFAULT_CREDIT,
      endpoint: `/verify${path}`,
      method: 'POST',
      contentType,
      category,
      tags, // Include OpenAPI tags
      sampleInput: sampleInput || {},
      sampleOutput: sampleOutput || { status: 'success' },
    })
  })

  return endpoints.sort((a, b) => a.name.localeCompare(b.name))
}

