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

## Usage Trends (Dashboard card change %)
- Endpoint: GET `/usage/overview/compare?period=month`
  - Purpose: Provide period-over-period deltas for top cards
  - Response (option A): `{ total_change_pct: number, success_change_pct: number, failed_change_pct: number, balance_change_pct: number }`
  - Response (option B): `{ current: { total:number, success:number, failed:number, balance:number }, previous: { total:number, success:number, failed:number, balance:number } }` (frontend computes %)
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

## Billing Pricing Data
- Endpoint: GET `/billing/pricing`
  - Purpose: Provide per-API pricing to compute cost (GET `/usage/monthly` exists but lacks pricing)
  - Response: `[{ api_name: string, per_unit_cost: number, currency: string }]`
  - Status: MISSING

## Auto-Pay Toggle
- Endpoint: PATCH `/billing/auto-pay`
  - Purpose: Enable/disable auto-pay
  - Payload: `{ enabled: boolean }`
  - Status: MISSING

## Add Payment Method
- Endpoint: POST `/billing/payment-methods`
  - Purpose: Add a new payment method
  - Payload: gateway token payload (to be defined)
  - Status: MISSING

## Transactions List
- Endpoint: GET `/usage/`
  - Purpose: Provide list of all transactions/usage records
  - Query Parameters:
    - `limit` (optional): Number of records to return
    - `offset` (optional): Pagination offset
    - `start_date` (optional): Filter start date
    - `end_date` (optional): Filter end date
    - `status` (optional): Filter by status (success/failed)
    - `api_name` (optional): Filter by API type
  - Response: `[{ trax_id: number, api_name: string, status: 'success' | 'failed', timestamp: string, turn_around_time: string }]`
  - Note: Currently using mock data in frontend
  - Status: MISSING

## Transaction Details
- Endpoint: GET `/usage/{trax_id}`
  - Purpose: Get detailed information for a specific transaction
  - Response: `{ trax_id: number, api_name: string, status: 'success' | 'failed', timestamp: string, turn_around_time?: string, request_details: object, response_details: object }`
  - Note: Currently using mock data in frontend (TransactionDetailPage). Old dashboard has this endpoint.
  - Status: MISSING

## Analytics Page

### Average Verification Time
- Endpoint: GET `/analytics/avg-verification-time`
  - Purpose: Provide aggregate average verification time metric
  - Query Parameters:
    - `start_date` (optional): Filter start date
    - `end_date` (optional): Filter end date
    - `region` (optional): Filter by region
    - `verification_type` (optional): Filter by verification type
    - `device_type` (optional): Filter by device type
  - Response: `{ avg_time: string, unit: 'ms' | 's' }`
  - Example: `{ avg_time: "2.1", unit: "s" }`
  - Note: Individual transactions have `turn_around_time` but no aggregate average is provided
  - Status: MISSING

### Filter Options (Regions & Device Types)
- Endpoint: GET `/analytics/filters/options`
  - Purpose: Provide available filter options for regions and device types
  - Response: `{ regions: string[], device_types: string[] }`
  - Example: `{ regions: ["North", "South", "East", "West"], device_types: ["Mobile", "Desktop", "Tablet"] }`
  - Note: Verification types are currently extracted from `/usage/monthly` endpoint (api_name field)
  - Status: MISSING

