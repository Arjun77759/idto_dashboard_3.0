# API Gaps - Missing APIs Only

> This document lists ONLY APIs that are missing in the backend. All listed APIs must be implemented.

---

## 🔐 Authentication APIs

### Resend Verification Email / Sign-in Link
- **Endpoint**: `POST /auth/resend-email` or `POST /onboard/resend-verification`
- **Authorization**: Not required (uses email identifier)
- **Purpose**: Resend verification link or sign-in link to user's email
- **Payload**:
  ```typescript
  {
    email: string  // User's email address
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean,
    message: string  // e.g., "Verification email sent successfully"
  }
  ```
- **Use Cases**:
  - User didn't receive initial registration/signup email
  - Email link expired
  - User clicked "resend it" on check inbox page
- **Note**: Currently used in `CheckInboxPage.tsx` but only shows toast notification without actual API call
- **Status**: ❌ MISSING

---

## 📊 Dashboard & Analytics APIs

### Usage Trends (Period-over-Period Comparison)
- **Endpoint**: `GET /usage/overview/compare?period={1-12}` (month number)
- **Purpose**: Provide period-over-period deltas for dashboard cards
- **Response**: See detailed structure with total_verifications, successful_verifications, failed_verifications, monthly_spend (each with count/amount and change_percent), plus period metadata
- **Additional Field Needed**: `average_verification_time?: number` (in seconds)
- **Status**: ⚠️ BACKEND MISSING - Frontend ready with fallback to basic overview

### Monthly API Usage
- **Endpoint**: `GET /usage/monthly`
- **Purpose**: Get per-API transaction counts and costs for the current month
- **Query Parameters** (MISSING - needed for analytics filters):
  - `start_date` (optional): Filter start date (ISO format)
  - `end_date` (optional): Filter end date (ISO format)
  - `region` (optional): Filter by region ('all', 'north', 'south', 'east', 'west')
  - `api_name` (optional): Filter by specific API/verification type
  - `device_type` (optional): Filter by device type ('all', 'mobile', 'desktop', 'tablet')
- **Current Response**: `[{ api_name: string, number_of_transactions: number, unit_price: number, total_cost: number }]`
- **Status**: ⚠️ PARTIALLY IMPLEMENTED - Exists but missing filter parameters

### Volume Timeseries
- **Endpoint**: `GET /usage/volume/timeseries?start={Month Year}&end={Month Year}`
- **Purpose**: Get verification volume over time for charts
- **Query Parameters** (MISSING - needed for analytics filters):
  - `region` (optional): Filter by region ('all', 'north', 'south', 'east', 'west')
  - `api_name` (optional): Filter by specific API/verification type
  - `device_type` (optional): Filter by device type ('all', 'mobile', 'desktop', 'tablet')
- **Current Response**: `{ series: [{ month: string, count: number }] }`
- **Status**: ⚠️ PARTIALLY IMPLEMENTED - Exists but missing filter parameters


---

## 💰 Billing APIs

### Payment Methods
- **Endpoint**: `GET /billing/payment-methods`
- **Purpose**: List saved payment methods and auto-pay status
- **Response**: `{ methods: [{ id, brand, last4, exp_month, exp_year, is_default }], auto_pay_enabled: boolean }`
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
- **Purpose**: List all transactions/usage records
- **Current Implementation** (idto_dashboard):
  - ✅ Basic endpoint exists with `page` and `limit` parameters
  - ✅ Returns: `[{ trax_id: number, api_name: string, status: 'success' | 'failed', timestamp: string, turn_around_time: string }]`
- **Filtering Approach**: ✅ **Client-side filtering** (fetches all transactions, filters in browser)
  - Search by transaction ID, API name, or status
  - Filter by date range (start_date, end_date)
  - Filter by status ('success' | 'failed')
  - Filter by API type (api_name)
  - Filter by region (when region field added to response)
- **Frontend Status**: ✅ **FULLY IMPLEMENTED** - All filters working client-side
- **Backend Status**: ✅ **SUFFICIENT** - No server-side filter parameters needed (client-side filtering is acceptable)

### Transaction Details
- **Endpoint**: `GET /usage/{trax_id}`
- **Purpose**: Get detailed information for specific transaction
- **Response**: `{ trax_id: number, api_name: string, status: 'success' | 'failed', timestamp: string, turn_around_time?: string, request_details: object, response_details: object }`
- **Note**: Currently using mock data in frontend (TransactionDetailPage)
- **Status**: ❌ MISSING


---

## 🏢 KYB / Switch to Production APIs

> **Purpose**: APIs for business onboarding and production environment activation

### Step 1: Submit Basic Details
- **Endpoint**: `POST /onboard/basic-details`
- **Authorization**: Required
- **Purpose**: Submit basic business information (Step 1 of KYB flow)
- **Payload**:
  ```typescript
  {
    brand_name: string,
    website_url: string,
    entity_type: string  // e.g., "Private Limited", "LLP", "Proprietorship"
  }
  ```
- **Response**: `{ success: boolean, message: string, step_completed: 1 }`
- **Status**: ❌ MISSING

### Step 2: Submit Business Information
- **Endpoint**: `POST /onboard/business-info`
- **Authorization**: Required
- **Purpose**: Submit detailed business information (Step 2 of KYB flow)
- **Payload**:
  ```typescript
  {
    registered_name: string,
    authorized_email: string,
    authorized_mobile: string,  // 10-digit Indian mobile number
    office_address: string,
    pin_code: string  // 6-digit Indian PIN code
  }
  ```
- **Response**: `{ success: boolean, message: string, step_completed: 2 }`
- **Validation**: Email format, 10-digit mobile, 6-digit PIN code
- **Status**: ❌ MISSING

### Step 3: Verify Business PAN
- **Endpoint**: `POST /onboard/verify-pan`
- **Authorization**: Required
- **Purpose**: Submit and verify business PAN (Step 3 of KYB flow)
- **Payload**:
  ```typescript
  {
    pan_number: string  // Format: ABCDE1234F
  }
  ```
- **Response**: 
  ```typescript
  {
    success: boolean,
    message: string,
    step_completed: 3,
    pan_details: {
      name: string,
      pan_number: string,
      status: 'Valid' | 'Invalid'
    }
  }
  ```
- **Validation**: PAN format - 5 letters, 4 digits, 1 letter (e.g., ABCDE1234F)
- **Status**: ❌ MISSING

### Step 4: Verify GSTIN
- **Endpoint**: `POST /onboard/verify-gstin`
- **Authorization**: Required
- **Purpose**: Submit and verify GSTIN (Step 4 of KYB flow)
- **Payload**:
  ```typescript
  {
    gst_number: string  // Format: 22AAAAA0000A1Z5
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean,
    message: string,
    step_completed: 4,
    gst_details: {
      legal_name: string,
      trade_name: string,
      gst_number: string,
      status: 'Active' | 'Inactive',
      registration_date: string,
      state: string
    }
  }
  ```
- **Validation**: GSTIN format - 15 characters (2 digits + 10 char PAN + 1 digit + 1 letter + 1 alphanumeric)
- **Status**: ❌ MISSING

### Get KYB Status
- **Endpoint**: `GET /onboard/status`
- **Authorization**: Required
- **Purpose**: Get current KYB onboarding progress and status
- **Response**:
  ```typescript
  {
    current_step: number,
    completed_steps: number[],
    status: 'pending' | 'in_progress' | 'under_review' | 'approved' | 'rejected',
    environment: 'sandbox' | 'production',
    submitted_at?: string,
    approved_at?: string
  }
  ```
- **Status**: ❌ MISSING

---

## 🔐 DigiLocker APIs (Director KYC - Step 5)

> **Purpose**: Director KYC verification using DigiLocker integration

### Initiate DigiLocker Session
- **Endpoint**: `POST /verify/digilocker/initiate_session`
- **Authorization**: Required
- **Purpose**: Initialize a DigiLocker verification session for director KYC
- **Payload**:
  ```typescript
  {
    consent_purpose: string,  // e.g., "Identity verification for account opening"
    redirect_url: string,     // Frontend callback URL (e.g., "https://dashboard.idto.ai/kyc-callback")
    redirect_to_signup: boolean,
    consent: boolean
  }
  ```
- **Response**:
  ```typescript
  {
    status: "success",
    code: 1000,
    url: string  // DigiLocker authentication URL to redirect user to
  }
  ```
- **Flow**: 
  1. Frontend calls this API
  2. Backend returns DigiLocker URL with embedded client_id and redirect_uri
  3. Frontend redirects user to this URL
  4. User authenticates on DigiLocker
  5. DigiLocker redirects back to `redirect_url` with `code` and `code_verifier`
- **Status**: ❌ MISSING

### Get DigiLocker Reference Key
- **Endpoint**: `POST /verify/digilocker/get_reference`
- **Authorization**: Required
- **Purpose**: Exchange authorization code for reference key (callback handler)
- **Payload**:
  ```typescript
  {
    code: string,           // Authorization code from DigiLocker redirect
    code_verifier: string   // Code verifier for PKCE authentication flow
  }
  ```
- **Response**:
  ```typescript
  {
    status: "success",
    reference_key: string,    // Use this to fetch documents/details
    expires_at: string        // ISO timestamp
  }
  ```
- **Note**: This API is called after DigiLocker redirects back with `code` in URL params
- **Status**: ❌ MISSING

### Get DigiLocker User Details
- **Endpoint**: `POST /verify/digilocker/user_details`
- **Authorization**: Required
- **Purpose**: Fetch user profile details from DigiLocker using reference key
- **Payload**:
  ```typescript
  {
    reference_key: string
  }
  ```
- **Response**:
  ```typescript
  {
    status: "success",
    user: {
      digilockerid: string,
      name: string,
      dob: string,
      gender: string,
      eaadhaar: string,
      reference_key: string,
      mobile: string,
      picture: string,
      email: string
    }
  }
  ```
- **Status**: ❌ MISSING

### Fetch Aadhaar from DigiLocker
- **Endpoint**: `POST /verify/digilocker/fetch_aadhaar`
- **Authorization**: Required
- **Purpose**: Retrieve Aadhaar document from DigiLocker
- **Payload**:
  ```typescript
  {
    reference_key: string
  }
  ```
- **Response**: Aadhaar document data (format TBD - likely XML or PDF)
- **Status**: ❌ MISSING

### Fetch PAN from DigiLocker
- **Endpoint**: `POST /verify/digilocker/fetch_pan`
- **Authorization**: Required
- **Purpose**: Retrieve PAN document from DigiLocker
- **Payload**:
  ```typescript
  {
    reference_key: string
  }
  ```
- **Response**: PAN document data (format TBD)
- **Status**: ❌ MISSING

### Get Issued Documents List
- **Endpoint**: `POST /verify/digilocker/issued_docs`
- **Authorization**: Required
- **Purpose**: Get list of all documents issued to the user in DigiLocker
- **Payload**:
  ```typescript
  {
    reference_key: string
  }
  ```
- **Response**: Array of document objects with metadata
- **Status**: ❌ MISSING

### Complete KYB Flow
- **Endpoint**: `POST /onboard/complete`
- **Authorization**: Required
- **Purpose**: Mark KYB onboarding as complete and submit for approval
- **Payload**:
  ```typescript
  {
    digilocker_reference_key: string,
    director_details: {
      name: string,
      aadhaar_verified: boolean,
      pan_verified: boolean
    }
  }
  ```
- **Response**:
  ```typescript
  {
    success: boolean,
    message: string,
    status: 'under_review' | 'approved',
    review_time_estimate: string  // e.g., "2-3 business days"
  }
  ```
- **Status**: ❌ MISSING

---

## 📊 Summary

**Total Missing APIs**: 23
- Authentication: 1 (resend verification email)
- Dashboard & Analytics: 3 (1 missing, 2 partially implemented - need filter parameters)
- Billing: 3
- Transactions: 0 (All implemented)
- KYB/Production Switch: 6
- DigiLocker (Director KYC): 7
- Complete KYB Flow: 1

**Note**: The following APIs already exist and have been removed from this document:
- All User Management APIs (GET/POST/PATCH/DELETE `/users`)
- Authentication: GET `/me` (user profile), POST `/auth/login`, POST `/auth/firebase`, POST `/onboard/signup`, POST `/onboard/create-password`
- Billing: Pricing data (embedded in `/usage/monthly` response)
- Transactions: GET `/usage/` (exists with client-side filtering), GET `/usage/{trax_id}` (exists)

**Priority**: 
- **CRITICAL**: KYB/DigiLocker APIs (required for production switch feature)
- **HIGH**: Authentication, Dashboard, Billing APIs

**Implementation Order Recommendation**:
1. Authentication: Resend verification email (needed for CheckInboxPage)
2. Analytics Filter Support (add filter parameters to /usage/monthly and /usage/volume/timeseries)
3. KYB Basic Flow (Steps 1-4: basic-details, business-info, verify-pan, verify-gstin)
4. DigiLocker Integration (Director KYC - Step 5)
5. Dashboard APIs (usage comparison with average_verification_time)
6. Billing APIs

