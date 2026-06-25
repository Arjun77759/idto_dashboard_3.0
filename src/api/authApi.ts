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

export type RequestSignupOtpPayload = {
  email: string
}

export type RequestSignupOtpResponse = {
  status?: string
  message?: string
  otp_sent?: boolean
  email_sent?: boolean
}

const requestSignupOtpEndpoints = [
  '/auth/request-email-otp',
  '/auth/send-email-otp',
  '/auth/request-signup-otp',
  '/onboard/request-email-otp',
  '/onboard/send-email-otp',
  '/onboard/send-signup-otp',
  '/onboard/request-otp',
]

export async function requestSignupOtp(payload: RequestSignupOtpPayload): Promise<RequestSignupOtpResponse> {
  let lastError: any

  for (const endpoint of requestSignupOtpEndpoints) {
    try {
      const { data } = await http.post<RequestSignupOtpResponse>(endpoint, payload)
      return data
    } catch (err: any) {
      lastError = err
      const status = err?.response?.status

      if (status && status !== 404 && status !== 405) {
        throw err
      }
    }
  }

  const error = new Error('Signup email OTP is not available on the backend yet.')
  ;(error as any).cause = lastError
  throw error
}

export type CreatePasswordPayload = {
  customer_id: string
  password: string
  full_name?: string
  organisation_name?: string
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

export type VerifySignupOtpPayload = {
  email: string
  otp: string
}

export type VerifySignupOtpResponse = {
  status?: string
  message?: string
  customer_id?: string
  customerId?: string
  token?: string
  verification_token?: string
  signup_token?: string
}

const signupOtpEndpoints = [
  '/auth/verify-email-otp',
  '/auth/verify-signup-otp',
  '/onboard/verify-email-otp',
  '/onboard/verify-otp',
  '/onboard/verify-email',
]

export async function verifySignupOtp(payload: VerifySignupOtpPayload): Promise<VerifySignupOtpResponse> {
  let lastError: any

  for (const endpoint of signupOtpEndpoints) {
    try {
      const { data } = await http.post<VerifySignupOtpResponse>(endpoint, {
        email: payload.email,
        otp: payload.otp,
        code: payload.otp,
      })
      return data
    } catch (err: any) {
      lastError = err
      const status = err?.response?.status

      if (status && status !== 404 && status !== 405) {
        throw err
      }
    }
  }

  const error = new Error('Signup OTP verification is not available on the backend yet.')
  ;(error as any).cause = lastError
  throw error
}

export type CompleteSignupPayload = {
  email: string
  password: string
  verification_token?: string
  mobile?: string
  full_name?: string
  job_title?: string
  team_function?: string
  company_name?: string
  operation_type?: 'business' | 'freelancer'
  business_type?: string
}

export type CompleteSignupResponse = {
  status?: string
  message?: string
  access_token?: string
  user_agent?: string
}

const completeSignupEndpoints = [
  '/auth/complete-signup',
  '/onboard/complete-signup',
  '/onboard/signup/complete',
  '/onboard/register',
]

export async function completeSignup(payload: CompleteSignupPayload): Promise<CompleteSignupResponse> {
  let lastError: any

  for (const endpoint of completeSignupEndpoints) {
    try {
      const { data } = await http.post<CompleteSignupResponse>(endpoint, payload)
      return data
    } catch (err: any) {
      lastError = err
      const status = err?.response?.status

      if (status && status !== 404 && status !== 405) {
        throw err
      }
    }
  }

  const error = new Error('Final signup completion is not available on the backend yet.')
  ;(error as any).cause = lastError
  throw error
}

export type RequestMobileOtpPayload = {
  mobile: string
}

export type RequestMobileOtpResponse = {
  status?: string
  message?: string
  otp_sent?: boolean
  session_id?: string
}

export async function requestMobileOtp(payload: RequestMobileOtpPayload): Promise<RequestMobileOtpResponse> {
  const { data } = await http.post<RequestMobileOtpResponse>('/auth/request-mobile-otp', payload)
  return data
}

export type VerifyMobileOtpPayload = {
  mobile: string
  otp: string
  session_id?: string
}

export type VerifyMobileOtpResponse = {
  status?: string
  message?: string
}

export async function verifyMobileOtp(payload: VerifyMobileOtpPayload): Promise<VerifyMobileOtpResponse> {
  const { data } = await http.post<VerifyMobileOtpResponse>('/auth/verify-mobile-otp', payload)
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
