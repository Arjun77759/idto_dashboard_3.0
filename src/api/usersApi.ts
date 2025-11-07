import http from './axiosInstance'

/**
 * User Management API
 * 
 * ⚠️ ADMIN ONLY - All endpoints require Admin role authorization
 * Backend will return 403 Forbidden for non-admin users
 */

export type User = {
  user_id: string
  name: string
  email: string
  role: 'Admin' | 'Moderator' | 'User'
  status: 'Active' | 'Inactive'
  last_login: string
  created_at: string
  phone?: string
  company?: string
}

export type CreateUserPayload = {
  name: string
  email: string
  password: string
  role?: 'Admin' | 'Moderator' | 'User'
}

export type UpdateUserPayload = {
  name?: string
  email?: string
  role?: 'Admin' | 'Moderator' | 'User'
  status?: 'Active' | 'Inactive'
}

export type UsersListParams = {
  search?: string
  role?: string
  status?: string
  limit?: number
  offset?: number
}

export type UsersListResponse = {
  users: User[]
  total: number
  limit: number
  offset: number
}

/**
 * Get list of users with filters
 * @requires Admin role
 * @throws 403 if user is not admin
 */
export async function getUsers(params?: UsersListParams): Promise<UsersListResponse> {
  const { data } = await http.get<UsersListResponse>('/users', { params })
  return data
}

/**
 * Get single user details
 * @requires Admin role
 * @throws 403 if user is not admin
 * @throws 404 if user not found
 */
export async function getUser(userId: string): Promise<User> {
  const { data } = await http.get<User>(`/users/${userId}`)
  return data
}

/**
 * Create new user
 * @requires Admin role
 * @throws 403 if user is not admin
 * @throws 400 if email already exists
 */
export async function createUser(payload: CreateUserPayload): Promise<User> {
  const { data } = await http.post<User>('/users', payload)
  return data
}

/**
 * Update existing user
 * @requires Admin role
 * @throws 403 if user is not admin
 * @throws 404 if user not found
 */
export async function updateUser(userId: string, payload: UpdateUserPayload): Promise<User> {
  const { data } = await http.patch<User>(`/users/${userId}`, payload)
  return data
}

/**
 * Delete user (soft delete recommended)
 * @requires Admin role
 * @throws 403 if user is not admin
 * @throws 404 if user not found
 * @throws 400 if trying to delete own account
 */
export async function deleteUser(userId: string): Promise<{ message: string }> {
  const { data} = await http.delete<{ message: string }>(`/users/${userId}`)
  return data
}
