> **CONFIDENTIAL**
> This document and the information contained herein are the proprietary and confidential information of CHM Solutions Pty Ltd. This document may not be reproduced, distributed, or disclosed to any third party, in whole or in part, without the prior written permission of CHM Solutions Pty Ltd.

# iconpractice Online Booking API — Developer Reference

### Authentication

All endpoints authenticate via two **Online Booking tokens** found in your iconpractice account settings under **Online Booking**:

| Token | Parameter |
|---|---|
| Token 1 | `ob_token` |
| Token 2 | `ob_token2` |

> **Note on CSRF:** These are standard API routes — Laravel's web CSRF protection does not apply. The `csrf_key` and `csrf_token` fields required by `register-appointment` are **not** Laravel CSRF tokens. They are simple session tokens returned by `practice-details` or `practitioners-services` and must be passed back when registering an appointment.

---

### Recommended Flow

```
1. GET /practices              → get customer_id + list of practices
2. GET /practice-details       → get practitioners, csrf_key, csrf_token for a practice
3. GET /practitioners-services → get practitioners + services (alternative to step 2)
4. GET /practitioner-services  → get services for a specific practitioner
5. GET /month-schedule         → get available time slots for a month
6. POST /register-appointment  → book the appointment
7. GET /check-payment          → (if payment required) poll for payment status
```

---

### 1. GET `/api/v1/widget/practices`

Returns the list of active practices with online booking enabled for the account.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `ob_token` | Yes | Online Booking Token 1 |
| `ob_token2` | Yes | Online Booking Token 2 |
| `practices` | No | Comma-separated list of practice IDs to filter results |

**Example Request**
```
GET /api/v1/widget/practices?ob_token=abc&ob_token2=xyz
```

**Success Response**
```json
{
  "success": true,
  "details": {
    "customer_id": 42,
    "practices": [
      {
        "id": 1,
        "name": "Main Clinic",
        "address_1": "123 Example St",
        "address_2": "",
        "address_3": "Sydney",
        "postcode": "2000",
        "phone": "02 9999 0000",
        "fax": "",
        "email": "info@clinic.com",
        "website": "https://clinic.com"
      }
    ]
  }
}
```

---

### 2. GET `/api/v1/widget/practice-details`

Returns full details for a specific practice, including practitioners and a CSRF session token pair required for booking.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `ob_token` | Yes | Online Booking Token 1 |
| `ob_token2` | Yes | Online Booking Token 2 |
| `practice_id` | Yes | The practice ID (from `/practices`) |
| `practitioners` | No | Comma-separated practitioner IDs to filter results |

**Success Response**
```json
{
  "success": true,
  "details": {
    "customer_id": 42,
    "csrf_key": "a1b2c3d4e5f6...",
    "csrf_token": "f6e5d4c3b2a1...",
    "practice": {
      "id": 1,
      "name": "Main Clinic",
      "address_1": "123 Example St"
    },
    "practioners": [
      {
        "id": 10,
        "title": "Dr",
        "firstname": "Jane",
        "lastname": "Smith",
        "qualification": "MBBS",
        "description": "General Practitioner"
      }
    ],
    "currency_symbol": "$",
    "attended_text": "Have You Attended Before?"
  }
}
```

> Save `csrf_key`, `csrf_token`, and `customer_id` — they are required later.

---

### 3. GET `/api/v1/widget/practitioners-services`

Returns practitioners and available group appointment types for a practice. Also returns a `csrf_key`/`csrf_token` pair.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `customer_id` | Yes | Customer ID (from `/practices`) |
| `practice_id` | Yes | Practice ID |
| `practitioners` | No | Comma-separated practitioner IDs to filter |

**Success Response**
```json
{
  "success": true,
  "details": {
    "csrf_key": "a1b2c3d4...",
    "csrf_token": "f6e5d4c3...",
    "practioners": [
      {
        "id": 10,
        "title": "Dr",
        "firstname": "Jane",
        "lastname": "Smith",
        "qualification": "MBBS",
        "description": "General Practitioner"
      }
    ],
    "group_appts": [
      {
        "id": 5,
        "desc": "Yoga Class",
        "require_online_payment": false,
        "tax_multiplier": 0.1
      }
    ],
    "currency_symbol": "$",
    "attended_text": "Have You Attended Before?",
    "terms_url": "https://clinic.com/terms",
    "stripe_publishable_key": "pk_live_...",
    "payment_text": ""
  }
}
```

---

### 4. GET `/api/v1/widget/practitioner-services`

Returns the services offered by a specific practitioner, filtered by whether the patient is new or existing.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `customer_id` | Yes | Customer ID |
| `practice_id` | Yes | Practice ID |
| `practitioner_id` | Yes | Practitioner ID |
| `existing` | Yes | `"true"` if the patient has attended before, `"false"` if new |

**Success Response**
```json
{
  "success": true,
  "details": {
    "service_count": 2,
    "services": [
      {
        "id": 100,
        "item_number": "105",
        "desc": "Initial Consultation",
        "invoice_desc": "Initial Consultation 45min",
        "tax_multiplier": 0.1,
        "fee": 120.00,
        "tax_code": 3,
        "duration": 45,
        "require_online_payment": false,
        "is_np": true,
        "terms_url": null
      }
    ]
  }
}
```

---

### 5. GET `/api/v1/widget/month-schedule`

Returns available appointment slots for every day in a given month.

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `customer_id` | Yes | Customer ID |
| `practice_id` | Yes | Practice ID |
| `practioner` | Yes | Practitioner ID |
| `service_item_id` | Yes | Service item ID (from `/practitioner-services`) |
| `month` | Yes | Month number (e.g. `3` for March) |
| `year` | Yes | Four-digit year (e.g. `2026`) |
| `group` | Yes | `"false"` for individual, `"true"` for group/class |
| `new_patient` | Yes | `"true"` or `"false"` |
| `booking_type` | No | Optional booking type hint |

**Success Response**
```json
{
  "success": true,
  "details": {
    "group": false,
    "month": "March",
    "no_of_days": 31,
    "schedule": [
      {
        "day": 1,
        "date": "2026-03-01",
        "available": true,
        "times": ["09:00", "09:30", "10:00"]
      },
      {
        "day": 2,
        "date": "2026-03-02",
        "available": false,
        "times": []
      }
    ]
  }
}
```

---

### 6. POST `/api/v1/widget/register-appointment`

Books an appointment. This is the only `POST` endpoint.

**Request Body (JSON or form-encoded)**

**Required for all bookings:**

| Parameter | Description |
|---|---|
| `ob_token` | Online Booking Token 1 |
| `ob_token2` | Online Booking Token 2 |
| `csrf_key` | Value returned by `practice-details` or `practitioners-services` |
| `csrf_token` | Value returned by `practice-details` or `practitioners-services` |
| `practice_id` | Practice ID |
| `practitioner_id` | Practitioner ID |
| `service_item_id` | Service item ID (or group appointment ID if `is_group=true`) |
| `is_group` | `"true"` for group/class booking, `"false"` for individual |
| `existing` | `"true"` if patient has attended before, `"false"` if new |
| `ts_schedule_start` | Start timestamp (Unix timestamp or datetime string) |
| `ts_schedule_end` | End timestamp |
| `customer_firstname` | Patient first name |
| `customer_lastname` | Patient last name |
| `customer_dob` | Patient date of birth (format: `YYYY-MM-DD`) |
| `customer_email` | Patient email address |
| `customer_mobile` | Patient mobile number |

**Optional:**

| Parameter | Description |
|---|---|
| `comments` | Additional notes from patient |
| `scheduled_datetime` | Human-readable datetime (informational) |

**Only required if the service has `require_online_payment: true`:**

| Parameter | Description |
|---|---|
| `payment_method` | Stripe Payment Method ID (e.g. `pm_...`) |
| `return_url` | URL to redirect to after 3DS authentication |
| `group_payment_type` | `"full"` or `"concession"` (group bookings only) |

**Success Response (no payment / payment succeeded)**
```json
{
  "success": true,
  "redirect": false,
  "details": { },
  "confirmed": true,
  "payment_result": false
}
```

**Response when 3DS authentication is required**
```json
{
  "success": true,
  "redirect": true,
  "redirect_url": "https://hooks.stripe.com/..."
}
```

After the user completes 3DS, use `/check-payment` to confirm the outcome.

---

### 7. GET `/api/v1/widget/check-payment`

Checks the status of a Stripe payment intent (used after 3DS redirect).

**Query Parameters**

| Parameter | Required | Description |
|---|---|---|
| `ob_token` | Yes | Online Booking Token 1 |
| `ob_token2` | Yes | Online Booking Token 2 |
| `practice_id` | Yes | Practice ID |
| `payment_intent` | Yes | Stripe Payment Intent ID (e.g. `pi_...`) |
| `payment_intent_secret` | Yes | Stripe Payment Intent client secret |

**Success Response**
```json
{
  "success": true,
  "details": {
    "payment_status": "succeeded",
    "code": "",
    "message": ""
  }
}
```

Possible values for `payment_status`: `succeeded`, `requires_action`, `requires_payment_method`, `canceled`.

---

### Error Response (all endpoints)

All endpoints return HTTP `200` even on failure. Check the `success` field:

```json
{
  "success": false,
  "message": "ob_token is required"
}
```

---

### How Existing Patient Matching Works

When `existing` is `"true"` (the patient has attended before), the system attempts to match the submitted details against records in the practice's patient database. Understanding this process is important for building reliable integrations.

#### The Matching Query

The system performs an **exact match** on first name and last name, combined with a flexible date of birth check:

```sql
WHERE first_name = '{customer_firstname}'
  AND last_name  = '{customer_lastname}'
  AND (
        dob = '{customer_dob}'
     OR dob LIKE '%0000-00-00%'
     OR dob IS NULL
  )
```

#### Match Outcomes

| Matching records | Outcome | Effect |
|---|---|---|
| Exactly 1 | Appointment is linked to the existing patient record | `valid = 1`, patient ID attached to event |
| 0 | No match found — appointment still created but **unlinked** | `valid = 0`, staff alerted to contact patient |
| 2 or more | Ambiguous match — appointment still created but **unlinked** | `valid = 0`, staff alerted to confirm identity |

Unlinked appointments (0 or multiple matches) are still saved and confirmed to the patient, but they appear in the practice calendar without being associated to a patient record. Staff receive an in-app notification to manually resolve the match.

#### Name Matching Is Case-Sensitive and Exact

The name lookup uses a direct SQL `WHERE` clause with no fuzzy matching, SOUNDEX, or case folding. The submitted `customer_firstname` and `customer_lastname` values must **exactly** match what is stored in the patient record, including:

- Capitalisation (e.g. `Smith` vs `smith` may not match depending on database collation)
- Spacing and hyphens (e.g. `Mary Jane` vs `Mary-Jane`)
- Accented characters and special characters

**Best practice:** Present the patient with their name as it appears on their Medicare card or previous correspondence, and encourage them to enter it exactly as it was registered at the practice.

#### Date of Birth Matching

The `customer_dob` value (format: `YYYY-MM-DD`) is used as a secondary filter alongside the name. However, the system is deliberately lenient when a DOB is missing from the patient's record:

- If the patient record has **no DOB** (`NULL` or `0000-00-00`), the booking will still match on name alone.
- If the patient record **has a DOB** on file, the submitted `customer_dob` must match it exactly.

This means:
- Submitting the correct DOB for a patient who has one on file: **match succeeds** (if name also matches)
- Submitting an incorrect DOB for a patient who has one on file: **no match**
- Submitting any DOB for a patient with no DOB on file: **match succeeds** (if name matches)

**Best practice:** Always collect and submit date of birth. Even when it is not strictly required for matching (because the patient record lacks one), it serves as a useful identifier for staff when resolving ambiguous or unmatched appointments.

#### New Patients (`existing = "false"`)

When `existing` is `"false"`, no lookup is performed. The patient is treated as new:
- The appointment is created with `pat_ID = 0` (unlinked)
- The submitted DOB is recorded in the appointment notes for staff reference
- `valid = 1` — the booking proceeds without any match requirement

---

### Notes for Chatbot Integration

- A chatbot only needs to read availability — endpoints 1–5 require no payment handling and involve no CSRF complexity.
- The `csrf_key`/`csrf_token` for booking are **not** sensitive tokens to protect — they are randomly generated per request and the values returned by `practice-details`/`practitioners-services` just need to be echoed back in the `register-appointment` call.
- Since this is an API route (`/api/v1/...`), **no `X-CSRF-TOKEN` header** is required — Laravel's CSRF middleware does not apply to the `/api` route group.
- Stripe payment handling (`payment_method`) requires the Stripe.js library on the client side to tokenise card details before calling `register-appointment`. If the chatbot is only facilitating bookings for services with `require_online_payment: false`, Stripe is not needed at all.
