import http from './axiosInstance'

/**
 * Onboarding API endpoints for production switch verification
 */

// Basic Details Check
export type BasicDetailsCheckResponse = {
  exists: boolean
}

export async function checkBasicDetailsExists(): Promise<BasicDetailsCheckResponse> {
  const { data } = await http.get<BasicDetailsCheckResponse>('/onboard/details/check')
  return data
}

// Basic Details Update
export type BasicDetailsPayload = {
  brand_name: string
  website_url: string
  entity_type: string
}

export type BasicDetailsResponse = {
  status: string
  customer_id: string
}

export async function updateBasicDetails(payload: BasicDetailsPayload): Promise<BasicDetailsResponse> {
  const { data } = await http.post<BasicDetailsResponse>('/onboard/details', payload)
  return data
}

// Business Info
export type BusinessCheckResponse = {
  exists: boolean
}

export async function checkBusinessExists(): Promise<BusinessCheckResponse> {
  const { data } = await http.get<BusinessCheckResponse>('/onboard/business/check')
  return data
}

export type BusinessInfoPayload = {
  registered_name: string
  email: string
  mobile: string
  address: string
  pin_code: string
}

export type BusinessInfoResponse = {
  status: string
  customer_id: string
}

export async function updateBusinessInfo(payload: BusinessInfoPayload): Promise<BusinessInfoResponse> {
  const { data } = await http.post<BusinessInfoResponse>('/onboard/business', payload)
  return data
}

// Business PAN
export type PANCheckResponse = {
  exists: boolean
}

export async function checkPANExists(): Promise<PANCheckResponse> {
  const { data } = await http.get<PANCheckResponse>('/customers/verify-and-update-pan/check')
  return data
}

export type PANPayload = {
  pan_number: string
}

export type PANResponse = {
  success: boolean
  message: string
  verification_result: {
    matched: boolean
  }
  customer_updated: boolean
  updated_fields: string[]
}

export async function updatePAN(payload: PANPayload): Promise<PANResponse> {
  const { data } = await http.post<PANResponse>('/customers/verify-and-update-pan', payload)
  return data
}

// GST
export type GSTCheckResponse = {
  exists: boolean
  not_applicable?: boolean
}

export async function checkGSTExists(): Promise<GSTCheckResponse> {
  const { data } = await http.get<GSTCheckResponse>('/customers/verify-and-update-gst/check')
  return data
}

export type GSTPayload = {
  gst_number: string
}

export type GSTResponse = {
  success: boolean
  message: string
  verification_result: {
    matched: boolean
  }
  customer_updated: boolean
  updated_fields: string[]
}

export async function updateGST(payload: GSTPayload): Promise<GSTResponse> {
  const { data } = await http.post<GSTResponse>('/customers/verify-and-update-gst', payload)
  return data
}

// Director KYC
export type DirectorKYCPayload = {
  code: string
  code_verifier: string
  redirect_uri?: string
}

export type DirectorKYCResponse = {
  status: string
  directors_info_id: string
}

export async function updateDirectorKYC(payload: DirectorKYCPayload): Promise<DirectorKYCResponse> {
  const { data } = await http.post<DirectorKYCResponse>('/customers/directors/digilocker', payload)
  return data
}

