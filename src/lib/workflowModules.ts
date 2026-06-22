export const MODULE_REGISTRY: Record<string, { name: string; icon: string }> = {
  mobile_verification: { name: 'Mobile Verification', icon: '📱' },
  aadhar_verification: { name: 'Aadhaar Verification', icon: '🆔' },
  pan_verification: { name: 'PAN Card Verification', icon: '💳' },
  face_match: { name: 'Face Match', icon: '👤' },
  account_verification: { name: 'Bank Account Verification', icon: '🏦' },
  e_sign: { name: 'E-Sign', icon: '✍️' },
  govt_id_selection: { name: 'Government ID Selection', icon: '🪪' },
}

export const MODULE_ICONS: Record<string, string> = Object.fromEntries(
  Object.entries(MODULE_REGISTRY).map(([k, v]) => [k, v.icon])
)

export const PRICING_MODE_LABELS: Record<string, string> = {
  per_api: 'Per API call',
  per_api_with_sdk_premium: 'Per API call + SDK premium',
  workflow_cost_on_submit: 'Flat — on submit',
}

export const formatSlug = (slug: string) => slug.replace(/_/g, ' ')
