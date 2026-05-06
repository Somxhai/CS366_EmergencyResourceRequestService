# EmergencyResourceRequest Service

**Service Owner:** นายชนกันต์ ทองรอง (Chanakan Thongrong)  
**Student ID:** 6609611816

---

## 1. Service Overview
EmergencyResourceRequest Service is responsible for receiving, collecting, and managing requests for assistance resources (e.g., food, water, medicine) from disaster victims and front-line agencies. It converts these requests into structured data to help rescue teams plan distribution efficiently.

### Pain Points Solved
- **Scattered Data:** Centralizes requests that are often reported through various unorganized channels.
- **Unclear Location:** Ensures precise coordinates (latitude/longitude) are captured.
- **Duplicate Requests:** Implements idempotency and duplicate detection to prevent redundant resource allocation in unstable network conditions.

### Target Users
1. **Citizens:** Victims reporting needs through a frontend application.
2. **Rescue Teams:** Field staff viewing and accepting requests for fulfillment.

---

## 2. Service Boundary

### In-Scope Responsibilities
- Receiving and storing resource requests (Resource Requests).
- Managing the lifecycle/status of requests.
- Duplicate detection and idempotency handling.
- Storing locations and determining request priority.

### Out-of-Scope
- Inventory and stock management.
- Rescue team fleet routing and navigation.
- Master data for the incident itself (handled by Incident Service).

---

## 3. Data Model

### Resource Request Master Data
| Field | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `id` | UUID (PK) | Yes | Unique identifier for the request. |
| `incidentId` | UUID | Yes | Reference to the incident. |
| `requestFor` | String | Yes | Category of the requester (e.g., CITIZEN). |
| `priority` | Enum | Yes | `CRITICAL`, `HIGH`, `NORMAL`, `LOW`, `UNDECIDED`. |
| `status` | Enum | Yes | `NEW`, `IN_PROGRESS`, `CLOSED`. |
| `requesterName` | String | Yes | Name of the person requesting help. |
| `phone` | String | Yes | Contact phone number. |
| `address` | String | Yes | Physical address. |
| `description` | String | No | Additional details or location description. |
| `latitude` | Double | Yes | GPS Latitude. |
| `longitude` | Double | Yes | GPS Longitude. |
| `verified` | Boolean | Yes | Whether the incident is verified. |
| `requestedAt` | Timestamp | Yes | Time when the request was created. |

---

## 4. API Contracts

**Base URL Prefix:** `/v1/resource`

### Synchronous (Management)
| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/list-request` | List requests filtered by `incident_id`, `status`, or `priority`. |
| `GET` | `/:request_id` | Get detailed information for a specific request. |
| `POST` | `/:request_id/assign` | Assign a rescue team to a request. (Sets status to `IN_PROGRESS`) |
| `PATCH` | `/:request_id/close` | Mark a request as `CLOSED`. |
| `PATCH` | `/:request_id/unassign` | Remove assigned team and reset status to `NEW`. |
| `POST` | `/deprecated/` | Legacy synchronous request creation. |

### Asynchronous (Primary Creation)
- **Endpoint:** `POST /v1/resource/`
- **Description:** Receives a request and publishes an event to SNS for background processing.
- **Headers:** Requires `idempotency-key` (UUID).
- **Request Body:**
```json
{
  "incidentId": "uuid",
  "requestFor": "CITIZEN",
  "items": [
    { "id": "item-uuid", "amount": 2 }
  ],
  "extraItems": [
    { "name": "Blankets", "amount": 5 }
  ],
  "from": {
    "name": "John Doe",
    "location": {
      "address": "123 Main St",
      "description": "Near the old bridge",
      "latitude": 13.7563,
      "longitude": 100.5018
    },
    "contact": {
      "phone": "0812345678"
    }
  }
}
```

---

## 5. Service Architecture

### Components
- **ECS (Backend):** Elysia/Bun service handling API requests and business logic.
- **PostgreSQL (RDS):** Persistent storage for requests and assignments.
- **SNS/SQS:** Asynchronous flow for request creation to ensure high availability.
- **AWS Lambda:** Worker process that consumes from SQS and inserts data into the DB.
- **Redis (ElastiCache):** Used for idempotency key management.

### Execution Flows
1. **Synchronous Flow:** Used for fetching and managing requests. ECS communicates directly with the database.
2. **Asynchronous Flow:** Used for creating requests. ECS publishes to SNS -> SNS fans out to SQS -> Lambda consumes from SQS and saves to RDS. This protects the system from spikes and ensures requests are not lost if the DB is under heavy load.

---

## 6. Non-Functional Requirements
- **Idempotency:** All state-changing operations (Create, Assign) must support `idempotency-key` to prevent duplicates.
- **High Availability:** The creation endpoint is decoupled from the database via SNS/SQS to remain operational even during DB maintenance or high load.
- **Security:** Management endpoints require proper authorization (Rescue Team / Dispatcher).
