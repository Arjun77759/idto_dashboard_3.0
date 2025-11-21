import http from './axiosInstance'

export interface InvoiceResponse {
  // Add proper typing based on actual API response
  [key: string]: any
}

export async function getInvoice(year: number, month: number): Promise<InvoiceResponse> {
  const res = await http.get(`/me/invoice?year=${year}&month=${month}`)
  return res.data
}

export async function downloadInvoice(year: number, month: number): Promise<Blob> {
  const res = await http.get(`/me/invoice?year=${year}&month=${month}`, {
    responseType: 'blob'
  })
  return res.data
}

