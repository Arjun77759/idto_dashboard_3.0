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


