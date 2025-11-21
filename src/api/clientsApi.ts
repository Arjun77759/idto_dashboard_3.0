import http from './axiosInstance'

/**
 * Client Management API
 * 
 * Endpoints for managing clients (sub-accounts) under the current user
 */

export type Client = {
  client_id: string
  name: string
  active: boolean
  created_at: string
}

/**
 * Get list of clients for the current user
 * @returns Array of client objects
 */
export async function getClients(): Promise<Client[]> {
  const { data } = await http.get<Client[]>('/me/clients')
  return data
}

