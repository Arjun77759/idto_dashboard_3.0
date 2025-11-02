# API Gaps - Missing APIs Only

> This document lists ONLY APIs that are missing in the backend. All listed APIs must be implemented.

---

## 🔐 Authentication APIs

### Signup
- **Endpoint**: `POST /auth/signup`
- **Payload**: `{ name: string, email: string, password: string }`
- **Response**: `{ user_id: string, email: string }` or `{ access_token: string }` if auto-login
- **Status**: ❌ MISSING

### SSO - Google
- **Start**: `GET /auth/google` (redirect to Google OAuth)
- **Callback**: `GET /auth/google/callback`
- **Response**: Should issue session/JWT and redirect with token, or set httpOnly cookie
- **Status**: ❌ MISSING

---

## 📊 Dashboard APIs

### Usage Trends (Period-over-Period Comparison)
- **Endpoint**: `GET /usage/overview/compare?period=month`
- **Purpose**: Provide period-over-period deltas for dashboard cards
- **Response**: `{ total_change_pct: number, success_change_pct: number, failed_change_pct: number, balance_change_pct: number }`
- **Status**: ❌ MISSING

### Recent Invoices
- **Endpoint**: `GET /invoices/recent?limit=4`
- **Purpose**: Get 4 most recent invoices for dashboard table
- **Response**: `[{ invoice_id: string, date: string, amount: number, status: 'Paid' | 'Pending', description: string }]`
- **Status**: ❌ MISSING

---

## 💰 Billing APIs

### Monthly Usage Summary
- **Endpoint**: `GET /usage/month-summary`
- **Purpose**: Current month usage and total quota for progress bar
- **Response**: `{ used: number, total: number }`
- **Status**: ❌ MISSING

### Payment Methods
- **Endpoint**: `GET /billing/payment-methods`
- **Purpose**: List saved payment methods and auto-pay status
- **Response**: `{ methods: [{ id, brand, last4, exp_month, exp_year, is_default }], auto_pay_enabled: boolean }`
- **Status**: ❌ MISSING

### Billing Pricing Data
- **Endpoint**: `GET /billing/pricing`
- **Purpose**: Per-API pricing to compute cost
- **Response**: `[{ api_name: string, per_unit_cost: number, currency: string }]`
- **Status**: ❌ MISSING

### Auto-Pay Toggle
- **Endpoint**: `PATCH /billing/auto-pay`
- **Purpose**: Enable/disable auto-pay
- **Payload**: `{ enabled: boolean }`
- **Status**: ❌ MISSING

### Add Payment Method
- **Endpoint**: `POST /billing/payment-methods`
- **Purpose**: Add a new payment method
- **Payload**: Gateway token payload (to be defined)
- **Status**: ❌ MISSING

---

## 📝 Transactions APIs

### Transactions List
- **Endpoint**: `GET /usage/`
- **Purpose**: List all transactions/usage records with filters
- **Query Parameters**:
  - `limit` (optional): Number of records
  - `offset` (optional): Pagination offset
  - `start_date` (optional): Filter start date
  - `end_date` (optional): Filter end date
  - `status` (optional): Filter by status (success/failed)
  - `api_name` (optional): Filter by API type
- **Response**: `[{ trax_id: number, api_name: string, status: 'success' | 'failed', timestamp: string, turn_around_time: string }]`
- **Note**: Currently using mock data in frontend
- **Status**: ❌ MISSING

### Transaction Details
- **Endpoint**: `GET /usage/{trax_id}`
- **Purpose**: Get detailed information for specific transaction
- **Response**: `{ trax_id: number, api_name: string, status: 'success' | 'failed', timestamp: string, turn_around_time?: string, request_details: object, response_details: object }`
- **Note**: Currently using mock data in frontend (TransactionDetailPage)
- **Status**: ❌ MISSING

---

## 🧪 API Testing - Verification APIs

### All Verification Endpoints
All these endpoints are POST requests that require authentication. Based on old dashboard pattern.

1. **PAN Verification** - `POST /verify/pan_verification`
2. **Bank Account Verification** - `POST /verify/bank_verification`
3. **Bank Verification (Pennyless)** - `POST /verify/bank_verification/pennyless`
4. **CIN MCA Verification** - `POST /verify/cin_mca_verification`
5. **GST Verification** - `POST /verify/gst_verification`
6. **GST Verification Basic** - `POST /verify/gst_verification_basic`
7. **GST Advance** - `POST /verify/gst_advance`
8. **UAN Verification** - `POST /verify/uan_verification`
9. **Voter Verification** - `POST /verify/voter_verification`
10. **Driving Licence** - `POST /verify/driving_licence`
11. **Passport** - `POST /verify/passport`
12. **Face Match** - `POST /verify/face_match` (multipart/form-data)
13. **OCR** - `POST /verify/ocr` (multipart/form-data)
14. **Name Match** - `POST /verify/name_match`
15. **PAN All In One** - `POST /verify/pan_all_in_one`
16. **Business PAN** - `POST /verify/business_pan`
17. **PAN Detailed** - `POST /verify/pan_detailed`
18. **PAN NSDL** - `POST /verify/pan_nsdl`
19. **Mobile To PAN** - `POST /verify/mobile_to_pan`
20. **Mobile To GST** - `POST /verify/mobile_to_gst`
21. **PAN To GST** - `POST /verify/pan_to_gst`
22. **Mobile Profile** - `POST /verify/mobile_profile`
23. **Mobile Profile Advance** - `POST /verify/mobile_profile_advance`
24. **Mobile Profile Address Intelligence** - `POST /verify/mobile_profile/address_intelligence`
25. **Vehicle RC** - `POST /verify/vehicle_rc`
26. **DigiLocker Initiate Session** - `POST /verify/digilocker/initiate_session`
27. **DigiLocker Get Reference** - `POST /verify/digilocker/get_reference`
28. **DigiLocker User Details** - `POST /verify/digilocker/user_details`
29. **DigiLocker Fetch Aadhaar** - `POST /verify/digilocker/fetch_aadhaar`
30. **DigiLocker Fetch PAN** - `POST /verify/digilocker/fetch_pan`
31. **DigiLocker Issued Docs** - `POST /verify/digilocker/issued_docs`
32. **DigiLocker Get Issued Docs** - `POST /verify/digilocker/get_issued_docs`
33. **DigiLocker Get Issued Docs XML** - `POST /verify/digilocker/get_issued_docs_xml`

**Status**: ❌ All 33 verification APIs are MISSING in new backend

**Note**: All APIs follow the same pattern from old dashboard. See `src/config/apiEndpoints.ts` for detailed input/output structure.

---

## 📈 Analytics APIs

### Average Verification Time
- **Endpoint**: `GET /analytics/avg-verification-time`
- **Purpose**: Aggregate average verification time metric
- **Query Parameters**:
  - `start_date` (optional): Filter start date
  - `end_date` (optional): Filter end date
  - `region` (optional): Filter by region
  - `verification_type` (optional): Filter by verification type
  - `device_type` (optional): Filter by device type
- **Response**: `{ avg_time: string, unit: 'ms' | 's' }`
- **Example**: `{ avg_time: "2.1", unit: "s" }`
- **Note**: Individual transactions have `turn_around_time` but no aggregate average provided
- **Status**: ❌ MISSING

### Filter Options (Regions & Device Types)
- **Endpoint**: `GET /analytics/filters/options`
- **Purpose**: Available filter options for regions and device types
- **Response**: `{ regions: string[], device_types: string[] }`
- **Example**: `{ regions: ["North", "South", "East", "West"], device_types: ["Mobile", "Desktop", "Tablet"] }`
- **Note**: Verification types are extracted from `/usage/monthly` endpoint (api_name field)
- **Status**: ❌ MISSING

---

## 📊 Summary

**Total Missing APIs**: 51
- Authentication: 2
- Dashboard: 2
- Billing: 5
- Transactions: 2
- Verification/Testing: 33
- Analytics: 2

**Priority**: HIGH - These APIs are required for full dashboard functionality

