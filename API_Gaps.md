# API Gaps (Only Missing)

## Signup
- Endpoint: POST `/auth/signup`
  - Payload: `{ name: string, email: string, password: string }`
  - Response: `{ user_id: string, email: string }` or `{ access_token: string }` if auto-login
  - Status: MISSING

## SSO - Google
- Endpoint (start): GET `/auth/google` (redirect to Google OAuth)
- Endpoint (callback): GET `/auth/google/callback`
  - Response (callback): should issue session/JWT and redirect with token, or set httpOnly cookie
  - Status: MISSING

## SSO - Microsoft
- Endpoint (start): GET `/auth/microsoft` (redirect to Microsoft OAuth)
- Endpoint (callback): GET `/auth/microsoft/callback`
  - Response (callback): should issue session/JWT and redirect with token, or set httpOnly cookie
  - Status: MISSING

## Usage Trends (Dashboard card change %)
- Endpoint: GET `/usage/overview/compare?period=month`
  - Purpose: Provide period-over-period deltas for top cards
  - Response (option A): `{ total_change_pct: number, success_change_pct: number, failed_change_pct: number, balance_change_pct: number }`
  - Response (option B): `{ current: { total:number, success:number, failed:number, balance:number }, previous: { total:number, success:number, failed:number, balance:number } }` (frontend computes %)
  - Status: MISSING

## Verification Volume Time Series (Chart)
- Endpoint: GET `/usage/volume/timeseries?period=month`
  - Purpose: Provide monthly verification volume for chart (e.g., [{ month, volume }])
  - Response: `[{ month: string, volume: number }]`
  - Status: MISSING

## Recent Invoices (Dashboard)
- Endpoint: GET `/invoices/recent?limit=4`
  - Purpose: Provide the 4 most recent invoices for dashboard table
  - Response: `[{ id: string, date: string, status: 'Paid'|'Unpaid'|'Pending', amount: string }]`
  - Status: MISSING

## Monthly Usage Summary (Billing)
- Endpoint: GET `/usage/month-summary`
  - Purpose: Provide current month usage and total quota for progress bar
  - Response: `{ used: number, total: number }`
  - Status: MISSING

## Payment Methods (Billing)
- Endpoint: GET `/billing/payment-methods`
  - Purpose: List saved payment methods and auto-pay status
  - Response: `{ methods: [{ id, brand, last4, exp_month, exp_year, is_default }], auto_pay_enabled: boolean }`
  - Status: MISSING

## Monthly API Usage (Billing Table)
- Endpoint: GET `/usage/monthly`
  - Purpose: Per-API usage counts for the current month
  - Response (existing in old dashboard): `[{ api_name: string, number_of_transactions: number }]`
  - Enhancement (missing): Include pricing fields to compute cost
    - Option A: Add `per_unit_cost` and `cost` to each item
    - Option B: Provide pricing via GET `/billing/pricing` and let FE compute
  - Status: PARTIAL (counts exist in old, pricing missing)
- Endpoint: PATCH `/billing/auto-pay`
  - Purpose: Enable/disable auto-pay
  - Payload: `{ enabled: boolean }`
  - Status: MISSING
- Endpoint: POST `/billing/payment-methods`
  - Purpose: Add a new payment method
  - Payload: gateway token payload (to be defined)
  - Status: MISSING

