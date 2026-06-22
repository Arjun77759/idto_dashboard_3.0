import http from './axiosInstance'
import type { SessionOutcome, KnownOutcome } from '@/lib/workflowOutcome'

type SessionStatus = 'completed' | 'in_progress' | 'abandoned' | 'failed' | 'pending'

export interface MerchantWorkflowAssignment {
  id: string
  workflow_template_id: string | null
  continuity_mode: 'merchant_injects' | 'we_store'
  is_active: boolean
  pricing?: {
    pricing_mode: 'per_api' | 'per_api_with_sdk_premium' | 'workflow_cost_on_submit'
    sdk_premium_cost?: number
    workflow_cost?: number
    incomplete_cost?: number
    amount_per_step?: number
    estimated_per_step_cost?: number
  }
  workflow_template: {
    id: string
    name: string
    module_sequence: string[]
  } | null
}

export interface SdkConfig {
  client_token_placeholder: string
  workflow_template_id: string
  continuity_mode: string
  embed_code: string
}

export interface MerchantAnalytics {
  total_sessions: number
  completed: number
  abandoned: number
  in_progress: number
  // Sessions that timed out / expired — distinct from explicitly abandoned.
  expired?: number
  // Verification verdict breakdown across completed sessions.
  outcome_breakdown?: Record<KnownOutcome, number>
  avg_total_time_seconds?: number
  sessions_with_reopens?: number
  total_estimated_cost?: number
  funnel: MerchantFunnelStep[]
  time_per_step: TimePerStep[]
  retry_rate: RetryRate[]
  error_distribution: ErrorDistribution[]
  sessions: MerchantSessionListItem[]
}

export interface MerchantFunnelStep {
  step_index: number
  module_slug: string
  started: number
  completed: number
}

export interface TimePerStep {
  module_slug: string
  avg_seconds: number
}

export interface RetryRate {
  module_slug: string
  total: number
  retry_count: number
  retry_rate: number
}

export interface ErrorDistribution {
  module_slug: string
  error_code: string | null
  error_count: number
}

export interface MerchantSessionListItem {
  id: string
  session_token: string
  status: SessionStatus
  // Verification verdict — null until the session has completed.
  outcome?: SessionOutcome
  current_step_index: number
  start_count: number
  estimated_cost: number
  // 'recorded' = estimated_cost is the true billed amount summed from tagged
  // charges; 'estimated' = per-step estimate (historical/untagged session).
  cost_basis?: 'recorded' | 'estimated'
  created_at: string | null
  completed_at: string | null
}

export interface PriceBreakdownLineItem {
  label: string
  amount: number
  count: number
  module_slug: string | null
  api_type: string | null
}

export interface PriceBreakdown {
  line_items: PriceBreakdownLineItem[]
  total: number
  cost_basis: 'recorded' | 'estimated'
}

export interface MerchantSessionDetail {
  session_token: string
  session_id: string
  workflow: {
    id: string
    name: string
    modules: Array<{ slug: string; name: string }>
  }
  current_step_index: number
  status: SessionStatus
  // Verification verdict — null until the session has completed.
  outcome?: SessionOutcome
  start_count: number
  customer_id: string
  steps: Array<{
    step_index: number
    module_slug: string
    status: SessionStatus
    version: number
    retry_count: number
    started_at: string | null
    completed_at: string | null
  }>
  events: Array<{
    event_type: string
    step_index?: number
    module_slug?: string
    created_at: string
  }>
  // Real recorded price breakdown (per-charge), with estimate fallback.
  price_breakdown?: PriceBreakdown
}

export async function getMerchantWorkflowAssignments(): Promise<MerchantWorkflowAssignment[]> {
  const res = await http.get('/merchant/workflow-assignments')
  return res.data
}

export async function getMerchantSdkConfig(assignmentId: string): Promise<SdkConfig> {
  const res = await http.get(`/merchant/workflow-assignments/${assignmentId}/sdk-config`)
  return res.data
}

export async function getMerchantAnalytics(workflowTemplateId?: string): Promise<MerchantAnalytics> {
  const params = workflowTemplateId ? { workflow_template_id: workflowTemplateId } : undefined
  const res = await http.get('/merchant/analytics/workflow-sessions', { params })
  return res.data
}

export async function getMerchantSessionDetail(sessionId: string): Promise<MerchantSessionDetail> {
  const res = await http.get(`/merchant/analytics/workflow-sessions/${sessionId}`)
  return res.data
}
