import type { UsageComparisonResponse } from '@/api/usageApi'
import type { Transaction } from '@/hooks/useTransactions'
import type { TransactionDetail } from '@/hooks/useTransactionDetail'
import type { UsageMonthlyItem } from '@/hooks/useUsageMonthly'

export const sandboxTransactions: Transaction[] = [
  {
    trax_id: 'SBX-TXN-100248',
    api_name: 'pan_detailed',
    request_details: '{"pan":"ABCDE1234F","consent":"Y"}',
    response_details: '{"name":"Aarav Sharma","pan_status":"VALID","dob_match":true}',
    response_message: 'PAN details fetched successfully',
    status: 'success',
    timestamp: '18 Jun 2026, 10:42 AM',
    turn_around_time: '842ms',
  },
  {
    trax_id: 'SBX-TXN-100247',
    api_name: 'bank_account_verification',
    request_details: '{"account_number":"1234567890","ifsc":"HDFC0001234"}',
    response_details: '{"account_exists":true,"beneficiary_name":"Neha Verma","ifsc_valid":true}',
    response_message: 'Bank account verified',
    status: 'success',
    timestamp: '18 Jun 2026, 10:31 AM',
    turn_around_time: '1.2s',
  },
  {
    trax_id: 'SBX-TXN-100246',
    api_name: 'voter_verification',
    request_details: '{"epic_number":"XYZ1234567"}',
    response_details: '{"epic_number":"XYZ1234567","status":"NOT_FOUND"}',
    response_message: 'Voter record not found',
    status: 'failed',
    timestamp: '18 Jun 2026, 09:58 AM',
    turn_around_time: '963ms',
  },
  {
    trax_id: 'SBX-TXN-100245',
    api_name: 'vehicle_rc_plus',
    request_details: '{"vehicle_number":"KA01AB1234"}',
    response_details: '{"owner_name":"Rohan Iyer","fuel_type":"PETROL","registration_status":"ACTIVE"}',
    response_message: 'Vehicle RC fetched successfully',
    status: 'success',
    timestamp: '17 Jun 2026, 06:18 PM',
    turn_around_time: '1.5s',
  },
  {
    trax_id: 'SBX-TXN-100244',
    api_name: 'vpa_verification',
    request_details: '{"vpa":"demo@upi"}',
    response_details: '{"vpa":"demo@upi","account_holder_name":"Kavya Nair","status":"VALID"}',
    response_message: 'VPA verified',
    status: 'success',
    timestamp: '17 Jun 2026, 05:47 PM',
    turn_around_time: '711ms',
  },
  {
    trax_id: 'SBX-TXN-100243',
    api_name: 'employment_history',
    request_details: '{"uan":"100200300400"}',
    response_details: '{"uan":"100200300400","employers_found":3,"latest_exit_date":null}',
    response_message: 'Employment history fetched successfully',
    status: 'success',
    timestamp: '17 Jun 2026, 03:12 PM',
    turn_around_time: '2.1s',
  },
  {
    trax_id: 'SBX-TXN-100242',
    api_name: 'face_match',
    request_details: '{"source_image":"base64://sample-a","target_image":"base64://sample-b"}',
    response_details: '{"match_score":0.93,"is_match":true}',
    response_message: 'Face match completed',
    status: 'success',
    timestamp: '16 Jun 2026, 01:05 PM',
    turn_around_time: '1.8s',
  },
  {
    trax_id: 'SBX-TXN-100241',
    api_name: 'aadhar_to_pan',
    request_details: '{"aadhaar_last_four":"6789"}',
    response_details: '{"linked":false,"reason":"No PAN mapping available in sandbox sample"}',
    response_message: 'Aadhaar to PAN mapping unavailable',
    status: 'failed',
    timestamp: '16 Jun 2026, 11:23 AM',
    turn_around_time: '1.0s',
  },
]

const parseJsonField = (value: string) => {
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

const parseTurnAroundTimeSeconds = (value?: string | null) => {
  if (!value) return 0

  const amount = Number.parseFloat(value.replace(/[^\d.]/g, ''))
  if (Number.isNaN(amount)) return 0

  return value.toLowerCase().includes('ms') ? amount / 1000 : amount
}

export const getSandboxTransactionDetail = (traxId: string): TransactionDetail | null => {
  const transaction = sandboxTransactions.find((item) => item.trax_id === traxId)
  if (!transaction) return null

  return {
    ...transaction,
    request_details: parseJsonField(transaction.request_details),
    response_details: parseJsonField(transaction.response_details),
  }
}

export const getSandboxUsageOverview = (): UsageComparisonResponse => {
  const now = new Date()
  const successCount = sandboxTransactions.filter((transaction) => transaction.status === 'success').length
  const failedCount = sandboxTransactions.filter((transaction) => transaction.status === 'failed').length
  const averageTime =
    sandboxTransactions.reduce((total, transaction) => total + parseTurnAroundTimeSeconds(transaction.turn_around_time), 0) /
    sandboxTransactions.length

  return {
    total_verifications: { count: sandboxTransactions.length, change_percent: 12 },
    successful_verifications: { count: successCount, change_percent: 9 },
    failed_verifications: { count: failedCount, change_percent: -4 },
    monthly_spend: { amount: 0, change_percent: 0 },
    average_verification_time: averageTime,
    period: {
      requested_month: now.getMonth() + 1,
      current_year: now.getFullYear(),
      current_month_window: { start: '', end: '' },
      previous_month_window: { start: '', end: '' },
    },
  }
}

export const getSandboxUsageMonthly = (): UsageMonthlyItem[] => {
  const usageByApi = sandboxTransactions.reduce<Record<string, number>>((accumulator, transaction) => {
    accumulator[transaction.api_name] = (accumulator[transaction.api_name] || 0) + 1
    return accumulator
  }, {})

  return Object.entries(usageByApi).map(([apiName, count]) => ({
    api_name: apiName,
    number_of_transactions: count,
    unit_price: 0,
    total_cost: 0,
  }))
}
