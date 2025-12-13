import http from './axiosInstance'

export type LoginPayload = {
  email: string
  password: string
}

export type LoginResponse = {
  access_token: string
  user_agent?: string
}

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>('/auth/login', payload)
  return data
}

export type RegisterPayload = {
  email: string
}

export type RegisterResponse = {
  status: string
  message?: string
}

export async function register(payload: RegisterPayload): Promise<RegisterResponse> {
  const { data } = await http.post<RegisterResponse>('/onboard/signup', payload)
  return data
}

export type CreatePasswordPayload = {
  customer_id: string
  password: string
  token?: string
}

export type CreatePasswordResponse = {
  status: string
  message?: string
}

export async function createPassword(payload: CreatePasswordPayload): Promise<CreatePasswordResponse> {
  const { data } = await http.post<CreatePasswordResponse>('/onboard/create-password', payload)
  return data
}

export type FirebaseAuthPayload = {
  id_token: string
}

export type FirebaseAuthResponse = {
  access_token: string
  token_type: string
  expires_in: number
  customer_id: string
}

export async function firebaseAuth(payload: FirebaseAuthPayload): Promise<FirebaseAuthResponse> {
  const { data } = await http.post<FirebaseAuthResponse>('/auth/firebase', payload)
  return data
}

export type ResendEmailPayload = {
  email: string
}

export type ResendEmailResponse = {
  status: 'resent' | 'already_verified'
  customer_id?: string
  email_sent?: boolean
}

export async function resendVerificationEmail(payload: ResendEmailPayload): Promise<ResendEmailResponse> {
  const { data } = await http.post<ResendEmailResponse>('/onboard/resend-email', payload)
  return data
}

export type RequestPasswordResetPayload = {
  email: string
}

export type RequestPasswordResetResponse = {
  status: string
  customer_id?: string
  email_sent?: boolean
}

export async function requestPasswordReset(payload: RequestPasswordResetPayload): Promise<RequestPasswordResetResponse> {
  const { data } = await http.post<RequestPasswordResetResponse>('/onboard/request-password-reset', payload)
  return data
}

export type ResendPasswordResetPayload = {
  email: string
}

export type ResendPasswordResetResponse = {
  status: 'resent' | 'already_set'
  customer_id?: string
  email_sent?: boolean
}

export async function resendPasswordReset(payload: ResendPasswordResetPayload): Promise<ResendPasswordResetResponse> {
  const { data } = await http.post<ResendPasswordResetResponse>('/onboard/resend-reset-email', payload)
  return data
}
