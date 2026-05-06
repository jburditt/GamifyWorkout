# Feature Specification Template

> This template defines the standard structure for all GamifyWorkout feature specifications.
> Use this template when creating new specs or documenting existing features.

## Metadata

| Property | Value |
|----------|-------|
| **Spec ID** | `feature-id` (e.g., `gym-management`, `weekly-schedule`) |
| **Title** | Feature name |
| **Status** | `Completed` / `In Progress` / `Planned` |
| **Last Updated** | ISO date |
| **Version** | Semantic version (e.g., 1.0.0) |
| **Related Specs** | Links to dependent or related specs |
| **Implemented In** | Files/paths where this feature is currently implemented |

---

## 1. Overview

### What This Feature Does

Clear, concise description of the feature's purpose and value to the application. Answer: "Why would a user want this feature?"

Example: "Gym Management allows users to create personal gyms, assign equipment to each gym, and view available equipment for workout planning."

### Key Responsibilities

List the primary responsibilities of this feature:
- Responsibility 1
- Responsibility 2
- Responsibility 3

### Integration Points

Where does this feature connect to other parts of the system? List:
- **Upstream Dependencies**: Features or services this depends on
- **Downstream Consumers**: Features that depend on this
- **External Systems**: Azure services, third-party APIs, etc.

---

## 2. Data Models

### Domain Model Diagram

```
User
├── Gym (1:N relationship)
│   ├── id: Guid
│   ├── userId: Guid (FK)
│   ├── name: string
│   └── GymEquipment (N:M relationship via join table)
│       └── Equipment
```

### TypeScript Models (Frontend)

Define all TypeScript interfaces/types used on the frontend:

```typescript
// Interface definition with JSDoc comments
/**
 * Represents a user's personal gym
 */
export interface Gym {
  id: string;
  userId: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Request payload for creating/updating a gym
 */
export interface CreateGymRequest {
  name: string;
}

/**
 * Response from gym endpoints
 */
export interface GymResponse {
  success: boolean;
  data?: Gym;
  error?: string;
}
```

### C# Models (Backend)

Define all C# entities used in the backend:

```csharp
/// <summary>
/// Represents a user's personal gym
/// </summary>
public class Gym : BaseEntity
{
    public Guid UserId { get; set; }
    public string Name { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; }
    public virtual ICollection<GymEquipment> GymEquipments { get; set; }
}

/// <summary>
/// DTO for gym creation/update requests
/// </summary>
public class CreateGymDto
{
    public string Name { get; set; }
}
```

### Entity Relationships

Document all relationships between models:

| From | To | Type | Cardinality | Foreign Key | Cascade Delete |
|------|----|----|---|---|---|
| Gym | User | Association | N:1 | `UserId` | Yes |
| Gym | GymEquipment | Composition | 1:N | `GymId` | Yes |
| GymEquipment | Equipment | Association | N:1 | `EquipmentId` | No |

### Validation Rules

Define all validation constraints for models:

| Field | Type | Required | Constraints | Error Message |
|-------|------|----------|-------------|---|
| `name` | string | Yes | 1-100 chars | "Gym name must be between 1 and 100 characters" |
| `userId` | Guid | Yes | Must exist | "User not found" |

---

## 3. API Contracts

### Endpoints

Define all REST endpoints for this feature.

#### 3.1 GET List All Gyms

```
GET /api/gym
```

**Description**: Retrieve all gyms for the authenticated user

**Authentication**: Required (JWT Bearer token)

**Query Parameters**:
| Name | Type | Required | Description | Example |
|------|------|----------|---|---|
| `$skip` | int | No | Number of records to skip (OData) | 0 |
| `$top` | int | No | Number of records to return (OData) | 10 |
| `$filter` | string | No | OData filter expression | `name eq 'My Gym'` |

**Response** (200 OK):
```json
{
  "value": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "userId": "550e8400-e29b-41d4-a716-446655440001",
      "name": "My Gym",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ],
  "odata.count": 1
}
```

**Status Codes**:
- `200 OK`: Success
- `401 Unauthorized`: Missing or invalid token
- `500 Internal Server Error`: Server error

**Error Response** (401 Unauthorized):
```json
{
  "error": "Unauthorized"
}
```

---

#### 3.2 POST Create Gym

```
POST /api/gym
```

**Description**: Create a new gym for the authenticated user

**Authentication**: Required (JWT Bearer token)

**Request Body**:
```json
{
  "name": "Morning Gym"
}
```

**Response** (201 Created):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Morning Gym",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Status Codes**:
- `201 Created`: Gym created successfully
- `400 Bad Request`: Validation error
- `401 Unauthorized`: Missing or invalid token
- `409 Conflict`: Gym name already exists for user

**Error Response** (400 Bad Request):
```json
{
  "errors": {
    "name": ["Gym name must be between 1 and 100 characters"]
  }
}
```

---

#### 3.3 DELETE Gym

```
DELETE /api/gym/{gymId}
```

**Description**: Delete a gym and all associated equipment assignments

**Authentication**: Required (JWT Bearer token)

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|---|
| `gymId` | Guid | Yes | ID of the gym to delete |

**Response** (204 No Content):
```
(empty body)
```

**Status Codes**:
- `204 No Content`: Gym deleted successfully
- `401 Unauthorized`: Missing or invalid token
- `404 Not Found`: Gym not found or doesn't belong to user
- `500 Internal Server Error`: Server error

---

### State Management (NgRx)

Define NgRx store structure for this feature (if applicable):

#### Actions

```typescript
import { createAction, props } from '@ngrx/store';

export const loadGyms = createAction('[Gym] Load Gyms');

export const loadGymsSuccess = createAction(
  '[Gym] Load Gyms Success',
  props<{ gyms: Gym[] }>()
);

export const loadGymsError = createAction(
  '[Gym] Load Gyms Error',
  props<{ error: string }>()
);

export const createGym = createAction(
  '[Gym] Create Gym',
  props<{ name: string }>()
);

export const createGymSuccess = createAction(
  '[Gym] Create Gym Success',
  props<{ gym: Gym }>()
);
```

#### Reducer

```typescript
export interface GymState {
  gyms: Gym[];
  loading: boolean;
  error: string | null;
  selectedGymId: Guid | null;
}

export const initialState: GymState = {
  gyms: [],
  loading: false,
  error: null,
  selectedGymId: null
};
```

#### Selectors

```typescript
export const selectGyms = (state: GymState) => state.gyms;
export const selectLoading = (state: GymState) => state.loading;
export const selectError = (state: GymState) => state.error;
```

---

## 4. Components & Services (Frontend)

### Service Specifications

#### GymService

**Purpose**: Handle all gym-related API calls and data fetching

**Methods**:

```typescript
/**
 * Fetch all gyms for the current user
 * @returns Observable of gym list
 */
getGyms(): Observable<Gym[]> { }

/**
 * Create a new gym
 * @param request - CreateGymRequest with gym name
 * @returns Observable of created gym
 */
createGym(request: CreateGymRequest): Observable<Gym> { }

/**
 * Delete a gym by ID
 * @param gymId - ID of the gym to delete
 * @returns Observable of deletion result
 */
deleteGym(gymId: string): Observable<void> { }
```

**Dependencies**:
- `HttpClient` (Angular)
- `AuthService` (for auth tokens)
- Auto-generated API service from OpenAPI spec

**Error Handling**:
- Network errors → emit error with message "Failed to load gyms"
- 404 errors → emit error with message "Gym not found"
- 401 errors → redirect to login

---

### Component Specifications

#### ManageGymComponent

**Purpose**: Display list of user's gyms and allow management operations

**Selector**: `app-manage-gym`

**Inputs**:
```typescript
@Input() gyms: Gym[] = [];
@Input() loading: boolean = false;
@Input() error: string | null = null;
```

**Outputs**:
```typescript
@Output() selectGym = new EventEmitter<Gym>();
@Output() deleteGym = new EventEmitter<Guid>();
@Output() createGym = new EventEmitter<CreateGymRequest>();
```

**Template Structure**:
- Gym list with Material Data Table showing: name, equipment count, actions
- Add gym button → opens CreateGymDialog
- Delete button for each gym → shows confirmation dialog
- Loading spinner (ngx-ui-loader)

**Lifecycle**:
- `ngOnInit`: Dispatch action to load gyms from store
- `ngOnDestroy`: Unsubscribe from observables

**Business Logic**:
- Display gyms in a paginated table (5 items per page)
- Sort by creation date (newest first)
- Filter deleted gyms (soft delete if applicable)

---

## 5. Business Logic & Workflows

### Gym Lifecycle Workflow

```
User Request Create Gym
    ↓
Validate Gym Name
    ↓
Check if user already has gym with same name
    ↓
Create Gym in Database
    ↓
Return Gym ID
    ↓
Update Frontend State
    ↓
Display Success Toast
```

### Data Flow Diagram

```
Angular Component
    ↓ (dispatch action)
NgRx Effect
    ↓ (call API)
GymService
    ↓ (HTTP call)
Backend Controller
    ↓ (process request)
Service Layer (Business Logic)
    ↓ (save to database)
Repository<Gym>
    ↓ (return result)
Backend Response
    ↓ (update state)
NgRx Reducer
    ↓ (render)
Angular Component Display
```

### Error Scenarios

| Scenario | Trigger | Expected Behavior |
|----------|---------|---|
| Duplicate Gym Name | User creates gym with existing name | Return 409 Conflict, show error toast |
| Network Error | Connection lost during create | Show retry button, save draft locally |
| Invalid Input | Gym name is empty | Show validation error inline |
| Unauthorized Access | Token expired or invalid | Redirect to login |
| Race Condition | User rapidly creates multiple gyms | Queue requests, prevent duplicates |

---

## 6. Usage Examples

### Frontend Usage

```typescript
// In component
constructor(private store: Store, private gymService: GymService) {}

ngOnInit() {
  // Load gyms from store
  this.gyms$ = this.store.select(selectGyms);
  this.loading$ = this.store.select(selectLoading);
  
  // Dispatch load action
  this.store.dispatch(loadGyms());
}

onCreateGym(name: string) {
  this.store.dispatch(createGym({ name }));
}
```

### Backend Usage

```csharp
[HttpPost]
[Authorize]
public async Task<ActionResult<GymDto>> CreateGym([FromBody] CreateGymDto request)
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    var gym = await _gymService.CreateGymAsync(userId, request.Name);
    return CreatedAtAction(nameof(GetGym), new { id = gym.Id }, gym);
}
```

---

## 7. Related Files & References

**Frontend Implementation**:
- [src/app/modules/inventory/pages/gym.component.ts](src/app/modules/inventory/pages/gym.component.ts)
- [src/app/modules/inventory/components/manage-gym.component.ts](src/app/modules/inventory/components/manage-gym.component.ts)
- [src/app/api/services/gym.service.ts](src/app/api/services/gym.service.ts)

**Backend Implementation**:
- [api/Api/Controllers/GymController.cs](api/Api/Controllers/GymController.cs)
- [api/Core/Models/Gym.cs](api/Core/Models/Gym.cs)
- [api/Database/Services/Repository.cs](api/Database/Services/Repository.cs)

**Tests**:
- [tests/GymControllerTests.cs](tests/GymControllerTests.cs)
- [tests/GymServiceTests.cs](tests/GymServiceTests.cs)

---

## 8. Known Issues & TODOs

| Issue | Priority | Status | Description | Workaround |
|-------|----------|--------|---|---|
| Delete doesn't pass gymId | High | Open | Delete endpoint receiving null gymId | Manually pass ID from component |
| UI refresh after adding gym | High | Open | New gym doesn't display until page reload | Reload page manually |
| Async/await improvements | Medium | Open | Some operations are synchronous and block UI | Use Angular loading spinners as temporary fix |
| Move Save button | Medium | Planned | Move "Change Name" button beside name input | UI redesign |
| Add remove gym button | Medium | Planned | Users need clear way to delete gym | Use delete icon in table |
| "Select All Equipment" button | Low | Planned | Quick way to add all equipment to gym | Not available yet |

---

## 9. Future Enhancements

- [ ] Gym templates (pre-configured equipment sets)
- [ ] Gym capacity tracking (square footage, number of stations)
- [ ] Equipment inventory tracking (quantity per gym)
- [ ] Gym transfer/sharing between users
- [ ] Gym photos/visual identification

---

## 10. Appendix: Code Generation Notes

### For AI Code Generators

When generating code from this spec, follow these principles:

**Component Generation**:
1. Create component with specified selector and inputs/outputs
2. Use Material components for UI (Table, Dialog, Button, Form)
3. Subscribe to observables with `async` pipe where possible
4. Implement error boundary with error message display
5. Add loading state with ngx-ui-loader spinner

**Service Generation**:
1. Use dependency injection for HttpClient and AuthService
2. Map responses to TypeScript interfaces
3. Add error handling with meaningful error messages
4. Use RxJS operators for transformation (map, catchError, switchMap)

**Controller Generation** (Backend):
1. Use [Authorize] attribute on controller/methods
2. Extract userId from JWT claims
3. Return appropriate HTTP status codes (200, 201, 400, 404)
4. Map domain models to DTOs before returning
5. Add XML documentation comments for Swagger/OpenAPI

**Database Operations**:
1. Use generic Repository<T> pattern
2. Implement DbContext for EntityFramework operations
3. Add migrations for schema changes
4. Include seed data for development

---

*Last reviewed: [DATE] | Spec version: 1.0.0*
