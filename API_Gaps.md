# API Gaps - Missing APIs Only

> This document lists ONLY APIs that are missing in the backend. All listed APIs must be implemented.

---

## 👥 User Management APIs

> **⚠️ ADMIN ONLY** - All user management endpoints require Admin role authentication

### Get Users List
- **Endpoint**: `GET /users`
- **Authorization**: Admin role required
- **Purpose**: Retrieve list of users with filtering and pagination
- **Query Parameters**:
  - `search` (optional): Search by name or email
  - `role` (optional): Filter by role (Admin/Moderator/User)
  - `status` (optional): Filter by status (Active/Inactive)
  - `limit` (optional): Number of results per page
  - `offset` (optional): Pagination offset
- **Response**: `{ users: [{ user_id, name, email, role, status, last_login, created_at, phone, company }], total, limit, offset }`
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Not admin role
- **Status**: ❌ MISSING

### Get User Details
- **Endpoint**: `GET /users/{user_id}`
- **Authorization**: Admin role required
- **Purpose**: Get detailed information for a specific user
- **Response**: `{ user_id, name, email, role, status, last_login, created_at, phone, company }`
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Not admin role
  - `404 Not Found` - User not found
- **Status**: ❌ MISSING

### Create User
- **Endpoint**: `POST /users`
- **Authorization**: Admin role required
- **Purpose**: Create a new user account
- **Payload**: `{ name: string, email: string, password: string, role?: 'Admin' | 'Moderator' | 'User' }`
- **Response**: `{ user_id, name, email, role, status, created_at }`
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Not admin role
  - `400 Bad Request` - Invalid payload or email already exists
- **Status**: ❌ MISSING

### Update User
- **Endpoint**: `PATCH /users/{user_id}`
- **Authorization**: Admin role required
- **Purpose**: Update user information (role, status, profile)
- **Payload**: `{ name?: string, email?: string, role?: string, status?: string }`
- **Response**: `{ user_id, name, email, role, status, last_login, created_at }`
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Not admin role
  - `404 Not Found` - User not found
  - `400 Bad Request` - Invalid payload
- **Status**: ❌ MISSING

### Delete User
- **Endpoint**: `DELETE /users/{user_id}`
- **Authorization**: Admin role required
- **Purpose**: Delete a user account (soft delete recommended)
- **Response**: `{ message: "User deleted successfully" }`
- **Error Responses**:
  - `401 Unauthorized` - Not authenticated
  - `403 Forbidden` - Not admin role
  - `404 Not Found` - User not found
  - `400 Bad Request` - Cannot delete own account
- **Status**: ❌ MISSING

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

### Get Current User Profile
- **Endpoint**: `GET /me`
- **Authorization**: Required
- **Purpose**: Get current authenticated user's profile information
- **Response**: 
  ```typescript
  {
    user_id: string,
    name: string,
    email: string,
    company_name: string,
    role: 'admin' | 'user',
    status: 'sandbox' | 'production',
    created_at: string
  }
  ```
- **Note**: Used in sidebar, header, and profile sections to display user info
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

**Total Missing APIs**: 32
- User Management: 5
- Authentication: 3
- Dashboard: 2
- Billing: 5
- Transactions: 2
- KYB/Production Switch: 6
- DigiLocker (Director KYC): 7
- Complete KYB Flow: 1

**Priority**: 
- **CRITICAL**: KYB/DigiLocker APIs (required for production switch feature)
- **HIGH**: User Management, Authentication, Dashboard, Billing, Transactions APIs

**Implementation Order Recommendation**:
1. Authentication APIs (signup, SSO, /me)
2. KYB Basic Flow (Steps 1-4: basic-details, business-info, verify-pan, verify-gstin)
3. DigiLocker Integration (Director KYC - Step 5)
4. User Management & Dashboard APIs
5. Billing & Transactions APIs

