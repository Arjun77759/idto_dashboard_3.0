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

