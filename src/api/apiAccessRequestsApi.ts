import http from './axiosInstance'

export type ApiAccessRequestPayload = {
  api_name: string
  api_id: string
}

export type ApiAccessRequestResponse = {
  status: 'submitted'
  request_status: string
  sheet_recorded: boolean
  email_sent: boolean
}

export type RequestedApi = {
  api_id: string
  api_name: string
  status: 'requested' | 'approved' | 'rejected' | 'enabled' | string
  requested_at?: string | null
}

export async function submitApiAccessRequest(payload: ApiAccessRequestPayload) {
  const { data } = await http.post<ApiAccessRequestResponse>('/me/api-access-requests', payload)
  return data
}

export async function fetchRequestedApis() {
  const { data } = await http.get<RequestedApi[]>('/me/requested-apis')
  return data
}
