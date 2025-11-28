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

export type CreateClientRequest = {
  name: string
}

export type CreateClientResponse = {
  client_id: string
  client_secret: string
  name: string
}

/**
 * Get list of clients for the current user
 * @returns Array of client objects
 */
export async function getClients(): Promise<Client[]> {
  const { data } = await http.get<Client[]>('/me/clients')
  return data
}

/**
 * Create a new client (API key)
 * @param name - Name for the API key
 * @returns Client with client_id and client_secret (secret only shown once)
 */
export async function createClient(name: string): Promise<CreateClientResponse> {
  const { data } = await http.post<CreateClientResponse>('/customers/create-client', { name })
  return data
}

/**
 * Update a client (API key)
 * @param clientId - UUID of the client to update
 * @param updates - Partial client data to update
 * @returns Updated client object
 */
export async function updateClient(
  clientId: string,
  updates: { name?: string; active?: boolean }
): Promise<Client> {
  const { data } = await http.patch<Client>(`/me/clients/${clientId}`, updates)
  return data
}

/**
 * Delete a client (API key)
 * @param clientId - UUID of the client to delete
 */
export async function deleteClient(clientId: string): Promise<void> {
  await http.delete(`/me/clients/${clientId}`)
}

/**
 * Enable a client (API key)
 * @param clientId - UUID of the client to enable
 * @returns Response with status and client_id
 */
export async function enableClient(clientId: string): Promise<{ status: string; client_id: string }> {
  const { data } = await http.get<{ status: string; client_id: string }>(`/me/clients/${clientId}/enable`)
  return data
}

/**
 * Disable a client (API key)
 * @param clientId - UUID of the client to disable
 * @returns Response with status and client_id
 */
export async function disableClient(clientId: string): Promise<{ status: string; client_id: string }> {
  const { data } = await http.get<{ status: string; client_id: string }>(`/me/clients/${clientId}/disable`)
  return data
}
