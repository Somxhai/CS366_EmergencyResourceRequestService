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

### Hybrid Deployment Model
This service utilizes a hybrid cloud architecture, combining the cost-efficiency of self-hosting with the scalability of managed serverless components.

### Components
- **Main API (Coolify @ Hetzner VPS):** The core Elysia/Bun service is deployed via Coolify on a Hetzner VPS.
- **Database (PostgreSQL @ Hetzner VPS):** Self-hosted PostgreSQL managed by Coolify on the same VPS.
- **Cache (Redis @ Hetzner VPS):** Self-hosted Redis used for idempotency key management.
- **Messaging (AWS SNS/SQS):** Managed AWS services used for reliable event distribution and queuing.
- **Async Workers (AWS Lambda):** Serverless functions that consume events from SQS to perform background database writes.
- **Container Registry (AWS ECR):** Stores the Docker images for the Lambda functions.

### Execution Flows
1. **Synchronous Flow:** Used for fetching and managing requests. The API on Coolify communicates directly with the local PostgreSQL database.
2. **Asynchronous Flow:** Used for creating requests. The API publishes an event to **AWS SNS** -> SNS fans out to **AWS SQS** -> **AWS Lambda** (triggered by SQS) connects back to the PostgreSQL instance on the VPS to save the request. This ensures high availability for the ingestion endpoint.

---

## 6. Non-Functional Requirements
- **Idempotency:** All state-changing operations (Create, Assign) must support `idempotency-key` to prevent duplicates.
- **High Availability:** The creation endpoint is decoupled from the database via SNS/SQS to remain operational even during DB maintenance or high load.
- **Security:** Management endpoints require proper authorization (Rescue Team / Dispatcher).
