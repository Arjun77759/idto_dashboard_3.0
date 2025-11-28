# API Credentials - Missing Backend APIs

> This document lists the missing backend APIs required for the API Credentials page functionality.

---

## 🔑 API Credentials APIs

> **Purpose**: APIs for managing API keys (clients) and viewing API access/usage

### Get API Keys (Clients) List
- **Endpoint**: `GET /me/clients`
- **Authorization**: Required (JWT Bearer token)
- **Purpose**: Get list of all API keys (clients) for the current customer
- **Response**:
  ```typescript
  [
    {
      client_id: string,        // UUID
      name: string,             // API key name (e.g., "Default API Key", "Test API Key")
      active: boolean,          // Enabled/disabled status
      created_at: string        // ISO timestamp (e.g., "2024-04-17T16:56:07Z")
    }
  ]
  ```
- **Note**: 
  - Currently `POST /customers/create-client` exists, but no GET endpoint for customers to list their own clients
  - Admin endpoint exists: `GET /admin/clients?customer_id={id}` but customers need their own endpoint
  - Should only return clients belonging to the authenticated customer
- **Status**: ❌ MISSING
- **Implementation Location**: Add to `api/v1/dashboard.py` (under `/me` prefix) or `api/v1/customer_router.py`

### Update API Key
- **Endpoint**: `PATCH /me/clients/{client_id}`
- **Authorization**: Required (JWT Bearer token)
- **Purpose**: Update API key name or enable/disable status
- **Path Parameters**:
  - `client_id`: UUID of the client to update
- **Payload**:
  ```typescript
  {
    name?: string,      // Optional: Update API key name
    active?: boolean    // Optional: Enable/disable API key
  }
  ```
- **Response**:
  ```typescript
  {
    client_id: string,
    name: string,
    active: boolean,
    created_at: string
  }
  ```
- **Validation**:
  - Verify that the client belongs to the authenticated customer
  - Return 404 if client not found
  - Return 403 if customer tries to update another customer's client
- **Status**: ❌ MISSING
- **Implementation Location**: Add to `api/v1/dashboard.py` (under `/me` prefix) or `api/v1/customer_router.py`

### Delete API Key
- **Endpoint**: `DELETE /me/clients/{client_id}`
- **Authorization**: Required (JWT Bearer token)
- **Purpose**: Delete an API key (client)
- **Path Parameters**:
  - `client_id`: UUID of the client to delete
- **Response**:
  ```typescript
  {
    success: boolean,
    message: string  // e.g., "API key deleted successfully"
  }
  ```
- **Validation**:
  - Verify that the client belongs to the authenticated customer
  - Return 404 if client not found
  - Return 403 if customer tries to delete another customer's client
  - Consider soft delete vs hard delete (recommend soft delete by setting `active=false`)
- **Status**: ❌ MISSING
- **Implementation Location**: Add to `api/v1/dashboard.py` (under `/me` prefix) or `api/v1/customer_router.py`

### Get API Access & Usage
- **Endpoint**: `GET /me/api-access-usage`
- **Authorization**: Required (JWT Bearer token)
- **Purpose**: Get API usage statistics and access permissions for each API
- **Response**:
  ```typescript
  [
    {
      api_name: string,              // e.g., "Account API", "Transaction API", "pan_verification", "aadhaar_otp"
      unit_cost: number,             // Cost per unit/verification (e.g., 0.50, 1.50)
      verification_usage: number,   // Total number of verifications/calls
      total_cost: number,            // Total cost (unit_cost * verification_usage)
      status: 'enabled' | 'disabled' // API access status
    }
  ]
  ```
- **Note**: 
  - Similar to `/me/subscribed-apis` but with usage statistics and cost breakdown
  - Should aggregate data from `ApiCall` table grouped by `backend_call` or `api_name`
  - Should calculate costs based on customer's pricing configuration
  - Can reuse logic from existing usage endpoints
- **Status**: ❌ MISSING
- **Implementation Location**: Add to `api/v1/dashboard.py` (under `/me` prefix)

### Create API Key (Already Exists)
- **Endpoint**: `POST /customers/create-client`
- **Authorization**: Required (JWT Bearer token)
- **Purpose**: Create a new API key (client)
- **Payload**:
  ```typescript
  {
    name: string  // API key name (e.g., "Production API Key", "Test API Key")
  }
  ```
- **Response**:
  ```typescript
  {
    client_id: string,      // UUID
    client_secret: string,  // Only shown once on creation - should be stored securely
    name: string
  }
  ```
- **Status**: ✅ EXISTS (in `api/v1/customer_router.py`)
- **Note**: This endpoint is already implemented and working

---

## 📋 Implementation Notes

### Database Model
The `Client` model already exists in `db/models/client.py` with the following fields:
- `client_id`: UUID (primary key)
- `customer_id`: UUID (foreign key to Customer)
- `name`: String
- `token_hash`: String (hashed client secret)
- `active`: Boolean
- `created_at`: Timestamp

### Security Considerations
1. **Client Secret**: Never return the actual client secret after creation. Only return it once in the creation response.
2. **Authorization**: All endpoints must verify that the client belongs to the authenticated customer.
3. **Rate Limiting**: Consider rate limiting for client creation to prevent abuse.
4. **Audit Logging**: Log all client creation, update, and deletion operations.

### Data Aggregation for API Access & Usage
The `/me/api-access-usage` endpoint should:
1. Query `ApiCall` table filtered by customer_id
2. Group by `backend_call` or `api_name`
3. Count total calls per API
4. Get unit cost from customer's pricing configuration (CustomerVendorConfig or default pricing)
5. Calculate total cost (unit_cost × verification_usage)
6. Determine status based on customer's API subscriptions or configuration

### Error Handling
All endpoints should return appropriate HTTP status codes:
- `200`: Success
- `400`: Bad request (invalid payload)
- `401`: Unauthorized (missing or invalid token)
- `403`: Forbidden (trying to access another customer's client)
- `404`: Not found (client doesn't exist)
- `500`: Internal server error

---

## 📊 Summary

**Total Missing APIs**: 4
- Get API Keys List: `GET /me/clients`
- Update API Key: `PATCH /me/clients/{client_id}`
- Delete API Key: `DELETE /me/clients/{client_id}`
- Get API Access & Usage: `GET /me/api-access-usage`

**Existing APIs**: 1
- Create API Key: `POST /customers/create-client` ✅

**Priority**: **HIGH** - Required for API Credentials page functionality

**Implementation Order**:
1. `GET /me/clients` - Most critical, needed to display the list
2. `PATCH /me/clients/{client_id}` - Needed for toggle status and rename functionality
3. `GET /me/api-access-usage` - Needed for the second table on the page
4. `DELETE /me/clients/{client_id}` - Nice to have, can be added later if not critical

