import http from './axiosInstance'

export interface CreateOrderRequest {
  amount: number
  tax: number
  total_amount: number
  gst_number?: string
  company_name?: string
  state?: string
  address?: string
}

export interface CreateOrderResponse {
  internal_payment_id: string
  razorpay_response: {
    amount: number
    amount_due: number
    amount_paid: number
    attempts: number
    created_at: number
    currency: string
    entity: string
    id: string // This is the order_id
    notes: any[]
    offer_id: string | null
    receipt: string
    status: string
  }
  status: string
}

export interface ConfirmOrderSuccessRequest {
  razorpay_payment_id: string
  razorpay_order_id: string
  razorpay_signature: string
}

export interface ConfirmOrderFailedRequest {
  code: string
  description: string
  source: string
  step: string
  reason: string
  metadata: {
    payment_id: string
    order_id: string
  }
}

export interface ConfirmOrderSuccessResponse {
  status: string
  internal_payment_id: string
  razorpay_payment_id: string
  new_balance: number
}

export interface ConfirmOrderFailedResponse {
  status: string
  internal_payment_id: string
  error: {
    code: string
    description: string
    source: string
    step: string
    reason: string
    metadata: {
      payment_id: string
      order_id: string
    }
  }
}

/**
 * Create a Razorpay order
 */
export async function createOrder(
  payload: CreateOrderRequest
): Promise<CreateOrderResponse> {
  const { data } = await http.post<CreateOrderResponse>(
    '/me/payments/create-order',
    payload
  )
  return data
}

/**
 * Confirm a successful payment
 */
export async function confirmOrderSuccess(
  payload: ConfirmOrderSuccessRequest
): Promise<ConfirmOrderSuccessResponse> {
  const { data } = await http.post<ConfirmOrderSuccessResponse>(
    '/me/payments/confirm',
    payload
  )
  return data
}

/**
 * Confirm a failed payment
 */
export async function confirmOrderFailed(
  payload: ConfirmOrderFailedRequest
): Promise<ConfirmOrderFailedResponse> {
  const { data } = await http.post<ConfirmOrderFailedResponse>(
    '/me/payments/confirm',
    payload
  )
  return data
}

