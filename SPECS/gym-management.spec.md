# Gym Management Feature Specification

> Full-stack specification for gym creation, management, and equipment assignment functionality.

## Metadata

| Property | Value |
|----------|-------|
| **Spec ID** | `gym-management` |
| **Title** | Gym Management |
| **Status** | Completed (core features) / In Progress (optimizations) |
| **Last Updated** | 2024-01-15 |
| **Version** | 1.0.0 |
| **Related Specs** | [equipment.spec.md](./equipment.spec.md), [authentication.spec.md](./authentication.spec.md) |
| **Implemented In** | Frontend: `projects/gamifyworkout/src/app/modules/inventory/`, Backend: `projects/gamifyworkout/api/` |

---

## 1. Overview

### What This Feature Does

Gym Management enables users to create and maintain personal gyms, then assign equipment to each gym for workout planning. Users can manage multiple gyms (home gym, commercial gym, hotel gym) and customize which equipment is available at each location.

**Key Capabilities**:
- Create new personal gyms with custom names
- View all personal gyms in a tabbed interface
- Assign multiple equipment items to each gym
- Remove equipment from gyms
- Update gym names (in-progress)

### Key Responsibilities

- **Gym Lifecycle**: Create, read, list, and delete gyms for authenticated users
- **Equipment Assignment**: Associate equipment with specific gyms via join table
- **Multi-Gym Support**: Allow users to manage multiple gyms independently
- **Data Persistence**: Save gym and equipment associations to MSSQL database
- **User Scoping**: Filter gyms by authenticated user (TODO: currently unfiltered)

### Integration Points

- **Upstream Dependencies**: 
  - Authentication (user identity via JWT claims)
  - Equipment library (available equipment to assign)
  
- **Downstream Consumers**:
  - Weekly Schedule (schedules can be associated with gyms)
  - RPG Features (future: XP rewards for gym workouts)

- **External Systems**:
  - MSSQL Database (via EntityFramework Core 9)
  - OpenAPI/Swagger (auto-generates API client)

---

## 2. Data Models

### Domain Model Diagram

```
User
└── Gym (1:N relationship)
    ├── UserId (Foreign Key)
    ├── Name (string)
    └── GymEquipment (1:N join table)
        └── Equipment (N:M relationship)
            ├── EquipmentId (Foreign Key)
            ├── Name (string)
            └── Icon (string)
```

### TypeScript Models (Frontend)

**Auto-generated from OpenAPI spec in `src/app/api/models/`**

```typescript
/**
 * Represents a user's personal gym
 * Generated from OpenAPI spec
 */
export interface Gym {
  id?: string;  // Guid serialized as string
  userId?: string;  // Guid of gym owner
  name?: string;  // Gym name (e.g., "Home Gym", "Crossfit Box")
  equipment?: Equipment[];  // Associated equipment (navigation property)
}

/**
 * Represents fitness equipment (standardized library)
 * Generated from OpenAPI spec
 */
export interface Equipment {
  id?: string;  // Guid
  name?: string;  // Equipment name (e.g., "Dumbbells", "Bench")
  icon?: string;  // Icon identifier (e.g., "dumbbell", "bench")
  gyms?: Gym[];  // Gyms containing this equipment (navigation property)
}

/**
 * Join table for Gym-Equipment many-to-many relationship
 * Generated from OpenAPI spec
 */
export interface GymEquipment {
  id?: string;  // Guid primary key
  gymId?: string;  // Foreign key to Gym
  equipmentId?: string;  // Foreign key to Equipment
}

/**
 * Response payload when fetching equipment for a specific gym
 * API returns Equipment[] with only equipment in that gym
 */
export type GymEquipmentResponse = Equipment[];
```

### C# Models (Backend)

**Located in `api/Core/Models/`**

```csharp
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core;

/// <summary>
/// Represents a user's personal gym
/// </summary>
public class Gym : BaseEntity
{
    /// <summary>
    /// Owner of the gym (Foreign Key to User)
    /// </summary>
    [ForeignKey("User.Id")]
    public Guid UserId { get; set; }

    /// <summary>
    /// Name of the gym (e.g., "Home Gym", "Planet Fitness")
    /// Must be 1-100 characters
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Navigation property: Equipment in this gym
    /// Exclude from JSON serialization to prevent circular references
    /// </summary>
    [JsonIgnore]
    public List<Equipment> Equipment { get; set; } = new();
}

/// <summary>
/// Represents standardized fitness equipment
/// </summary>
public class Equipment : BaseEntity
{
    /// <summary>
    /// Equipment name (e.g., "Dumbbells", "Bench Press")
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// Icon identifier for UI display (e.g., "dumbbell", "bench")
    /// </summary>
    public required string Icon { get; set; }

    /// <summary>
    /// Navigation property: Gyms containing this equipment
    /// Exclude from JSON to prevent circular references
    /// </summary>
    [JsonIgnore]
    public List<Gym> Gyms { get; set; } = new();
}

/// <summary>
/// Join table for Gym-Equipment many-to-many relationship
/// </summary>
public class GymEquipment : BaseEntity
{
    /// <summary>
    /// Foreign Key to Gym
    /// </summary>
    [ForeignKey("Gym.Id")]
    public Guid GymId { get; set; }

    /// <summary>
    /// Foreign Key to Equipment
    /// </summary>
    [ForeignKey("Equipment.Id")]
    public Guid EquipmentId { get; set; }
}

/// <summary>
/// Base class for all entities
/// Provides primary key (Guid)
/// </summary>
public abstract class BaseEntity : Identifier
{
    [Key]
    public Guid Id { get; set; }
}

/// <summary>
/// Base interface for entities with identity
/// </summary>
public interface Identifier { }
```

### Entity Relationships

| From | To | Type | Cardinality | Foreign Key | Delete Behavior | Notes |
|------|----|----|---|---|---|---|
| Gym | User | Association | N:1 | `UserId` | Cascade | User owns multiple gyms |
| Gym | GymEquipment | Composition | 1:N | `GymId` | Cascade | Delete gym → deletes equipment assignments |
| GymEquipment | Equipment | Association | N:1 | `EquipmentId` | No action | Equipment library persists |
| GymEquipment | Gym | Association | N:1 | `GymId` | Cascade | Join table managed by gym |

### Validation Rules

| Field | Type | Required | Constraints | Error Message | Backend Enforced |
|-------|------|----------|-------------|---|---|
| `name` | string | Yes | 1-100 chars, non-empty | "Gym name must be 1-100 characters" | FormControl validators + server-side validation |
| `userId` | Guid | Yes | Must exist in Users table | "User not found" | Foreign Key constraint |
| `equipmentIds[]` | Guid[] | No | 0-4 items per gym (UI), no limit database | "Cannot add more than 4 equipment" | UI only (no server validation yet) |

---

## 3. API Contracts

### Endpoints

#### 3.1 GET List All Gyms

```
GET /api/gym
```

**Description**: Retrieve all gyms. Currently returns all gyms in database (TODO: filter by current user).

**Authentication**: Not enforced (TODO: should require JWT Bearer token)

**Query Parameters**: None currently supported

**Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Home Gym",
    "equipment": []
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440002",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Commercial Gym",
    "equipment": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440003",
        "name": "Dumbbells",
        "icon": "dumbbell"
      }
    ]
  }
]
```

**Status Codes**:
- `200 OK`: Success, returns array (may be empty)
- `500 Internal Server Error`: Database or server error

**Known Issues**:
- Endpoint does not filter by authenticated user (returns all gyms)
- No pagination support

---

#### 3.2 POST Create Gym

```
POST /api/gym
```

**Description**: Create a new gym for the current user

**Authentication**: Not enforced (TODO: should extract userId from JWT)

**Request Body**:
```json
{
  "name": "Morning Gym",
  "userId": "550e8400-e29b-41d4-a716-446655440001"
}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "550e8400-e29b-41d4-a716-446655440001",
  "name": "Morning Gym",
  "equipment": []
}
```

**Status Codes**:
- `200 OK`: Gym created successfully
- `400 Bad Request`: Validation error (empty name, etc.)
- `500 Internal Server Error`: Database error

**Error Response** (400 Bad Request):
```json
{
  "error": "Gym name is required"
}
```

**Validation**:
- Name must be 1-100 characters
- Name must not be empty or whitespace
- Name must be unique per user (TODO: not currently enforced)

**Known Issues**:
- userId must be manually provided (not extracted from JWT)
- No duplicate name detection

---

#### 3.3 GET Equipment for Gym

```
GET /api/equipment/{gymId}
```

**Description**: Retrieve equipment assigned to a specific gym

**Authentication**: Not enforced

**Path Parameters**:
| Name | Type | Required | Description | Example |
|------|------|----------|---|---|
| `gymId` | Guid | Yes | ID of the gym | `550e8400-e29b-41d4-a716-446655440000` |

**Response** (200 OK):
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440003",
    "name": "Dumbbells",
    "icon": "dumbbell"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440004",
    "name": "Bench",
    "icon": "bench"
  }
]
```

**Status Codes**:
- `200 OK`: Success
- `404 Not Found`: Gym not found
- `500 Internal Server Error`: Server error

---

#### 3.4 POST Assign Equipment to Gym

```
POST /api/gymequipment/{gymId}
```

**Description**: Add one or more equipment items to a gym

**Authentication**: Not enforced

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|---|
| `gymId` | Guid | Yes | ID of the gym to modify |

**Request Body**:
```json
[
  "550e8400-e29b-41d4-a716-446655440003",
  "550e8400-e29b-41d4-a716-446655440004"
]
```

**Response** (200 OK):
```json
true
```

**Status Codes**:
- `200 OK`: Equipment assigned successfully
- `400 Bad Request`: Invalid equipment IDs or gym not found
- `409 Conflict`: Equipment already assigned to gym (TODO: currently allows duplicates)
- `500 Internal Server Error`: Server error

**Known Issues**:
- Returns boolean instead of created resource
- Allows duplicate assignments (can assign same equipment twice)
- No server-side validation of equipment IDs

---

#### 3.5 DELETE Remove Equipment from Gym

```
DELETE /api/gymequipment/{gymId}/{equipmentId}
```

**Description**: Remove an equipment item from a gym

**Authentication**: Not enforced

**Path Parameters**:
| Name | Type | Required | Description |
|------|------|----------|---|
| `gymId` | Guid | Yes | ID of the gym |
| `equipmentId` | Guid | Yes | ID of equipment to remove |

**Response** (200 OK):
```json
true
```

**Status Codes**:
- `200 OK`: Equipment removed successfully
- `404 Not Found`: Gym or equipment not found
- `500 Internal Server Error`: Server error

**Known Issues**:
- Frontend sometimes passes null/undefined for gymId (bug)
- Returns boolean instead of no-content response (201 would be more appropriate)

---

## 4. Components & Services (Frontend)

### Service Specifications

#### GymService

**File**: `src/app/api/services/gym.service.ts` (auto-generated)

**Purpose**: HTTP client for gym-related API operations

**Methods**:

```typescript
/**
 * Get all gyms (currently unfiltered)
 * @returns Observable of Gym array
 */
apiGymGet(): Observable<Gym[]> { }

/**
 * Create a new gym
 * @param request - Request object with gym data
 * @param request.body - Gym object with name and userId
 * @returns Observable of created Gym
 */
apiGymPost(request: { body: Gym }): Observable<Gym> { }
```

**Dependencies**:
- `HttpClient` (Angular, provided by app bootstrap)
- `Configuration` (OpenAPI configuration with base URL)

**Error Handling**:
- Network errors → propagates to component via Observable error channel
- 5xx errors → propagates as error
- No automatic retry or error transformation

---

#### EquipmentService

**File**: `src/app/api/services/equipment.service.ts` (auto-generated)

**Purpose**: HTTP client for equipment operations

**Methods**:

```typescript
/**
 * Get equipment in a specific gym
 * @param request - Request with gymId
 * @param request.id - Gym ID as string
 * @returns Observable of Equipment array
 */
apiEquipmentIdGet(request: { id: string }): Observable<Equipment[]> { }
```

---

#### GymEquipmentService

**File**: `src/app/api/services/gym-equipment.service.ts` (auto-generated)

**Purpose**: HTTP client for gym-equipment join table operations

**Methods**:

```typescript
/**
 * Add equipment to gym
 * @param request - Request with gymId and equipment IDs
 * @param request.gymId - Gym ID as string
 * @param request.body - Array of equipment Guids
 * @returns Observable of boolean (true if successful)
 */
apiGymEquipmentGymIdPost(request: { gymId: string; body: string[] }): Observable<boolean> { }

/**
 * Remove equipment from gym
 * @param request - Request with gymId and equipmentId
 * @param request.gymId - Gym ID as string
 * @param request.equipmentId - Equipment ID as string
 * @returns Observable of boolean (true if successful)
 */
apiGymEquipmentGymIdEquipmentIdDelete(
  request: { gymId: string; equipmentId: string }
): Observable<boolean> { }
```

---

### Component Specifications

#### GymPageComponent

**File**: `src/app/modules/inventory/pages/gym.component.ts`

**Purpose**: Main page for gym management; displays list of gyms in tabs and allows creation

**Selector**: (used in routing, no selector)

**Inputs**: None

**Outputs**: None

**Template Structure**:
- Material TabGroup with tabs for each gym
- Create Gym section with form:
  - Text input for gym name (FormControl with validators: required, minLength(3), maxLength(50))
  - "Add Gym" button (triggers form submission)
- Error display area (TODO: add error messaging)
- Loading indicator (TODO: add spinner)

**Class Properties**:

```typescript
/**
 * List of all gyms fetched from API
 */
gyms: Gym[] = [];

/**
 * Reactive form for creating new gym
 */
form: FormGroup = new FormGroup({
  name: new FormControl('', {
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
  })
});

/**
 * Reference to Material TabGroup for programmatic control
 */
@ViewChild(MatTabGroup) tabGroup!: MatTabGroup;
```

**Lifecycle**:

```typescript
ngOnInit() {
  // 1. Fetch all gyms from backend
  // 2. Display in tabs
  // 3. Select first tab
  // 4. Trigger change detection
}

protected insert() {
  // 1. Validate form
  // 2. Create new Gym object with name from form
  // 3. TODO: Extract userId from UserService
  // 4. Call GymService.apiGymPost()
  // 5. On success:
  //    - Add new gym to local gyms array
  //    - Reset form
  //    - TODO: Update tab selection to show new gym
  // 6. On error: Log error (TODO: show user-friendly error)
}
```

**Business Logic**:

- Form validation rules:
  - Gym name: required, 3-50 characters
  - Automatically validates on form value changes

- UI behavior:
  - Displays gym list as tabs (one tab per gym)
  - First tab selected by default
  - Form remains visible above tabs
  - After creating gym, form resets and displays new gym tab

**Known Issues**:

| Issue | Impact | Workaround |
|-------|--------|---|
| userId hardcoded as undefined | Gym not associated with current user | Manually specify userId in form |
| New gym requires page reload to display fully | UX friction | Reload page |
| Form stays visible after create | Expected but not optimal | Form automatically resets |

**Child Components**:
- `ManageGymComponent` (passed gym prop for each tab)

---

#### ManageGymComponent

**File**: `src/app/features/rpg/component/manage-gym.component.ts`

**Purpose**: Manage a single gym, including viewing and assigning equipment

**Selector**: `manage-gym`

**Inputs**:
```typescript
/**
 * The gym to manage (required)
 * Passed from parent GymPageComponent
 */
gym = input.required<Gym>();
```

**Outputs**: None (updates made directly via services)

**Template Structure**:
- Gym name display field (editable text)
- Equipment grid (up to 4 items)
- Equipment items showing:
  - Equipment icon
  - Equipment name
  - Delete button for each item
- "Add Equipment" button (opens dialog)

**Class Properties**:

```typescript
/**
 * Form for editing gym name
 */
form: FormGroup = new FormGroup({
  name: new FormControl('', {
    validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
  })
});

/**
 * List of equipment in this gym
 */
equipment: Equipment[] = [];

/**
 * MatDialog reference for opening equipment selection dialog
 */
readonly dialog = inject(MatDialog);
```

**Lifecycle**:

```typescript
protected ngOnInit() {
  // 1. Initialize form with current gym name
  // 2. Fetch equipment for this gym from EquipmentService
  // 3. Set equipment list
}

protected openDialog(equipmentIds: string[]) {
  // 1. Open AddGymEquipmentDialog with currently assigned equipment
  // 2. On dialog close:
  //    - If result returned:
  //      - Call GymEquipmentService.apiGymEquipmentGymIdPost()
  //      - Refresh equipment list by re-fetching from API
  //    - If cancelled: do nothing
}

protected deleteGymEquipment(equipmentId: string) {
  // 1. Remove equipment from local array (optimistic update)
  // 2. Call GymEquipmentService.apiGymEquipmentGymIdEquipmentIdDelete()
  // 3. If error: TODO - restore item to list
}

protected canAddRow(equipment: Equipment[]): boolean {
  // Return true if fewer than 4 items (UI constraint)
  return equipment.length < 4;
}
```

**Business Logic**:

- Equipment display limit: 4 items per row (UI only, not enforced on backend)
- "Add Equipment" button disabled if 4 items already in grid
- Delete operation removes item from UI immediately, then calls API
- Equipment refresh fetches full list after assignment (inefficient - TODO: optimize)

**Known Issues**:

| Issue | Priority | Status | Workaround |
|-------|----------|--------|---|
| Equipment reload after add is inefficient | Medium | Open | Could update local array instead of API call |
| Delete doesn't validate gymId parameter | High | Open | Bug: sometimes gymId is null/undefined |
| No optimistic update error recovery | Medium | Open | User sees item deleted even if API fails |
| UI refresh requires page reload sometimes | Medium | Open | Restart component |

**Child Components**:
- `GymEquipmentTableComponent` (displays equipment list)
- `AddGymEquipmentDialog` (modal for selecting equipment)

---

#### GymEquipmentTableComponent

**File**: `src/app/features/rpg/component/gym-equipment-table.component.ts`

**Purpose**: Display equipment assigned to a gym in grid/table layout

**Selector**: `app-gym-equipment-table`

**Inputs**:
```typescript
/**
 * List of equipment to display
 */
@Input() equipment: Equipment[] = [];

/**
 * Gym ID (for delete operations)
 */
@Input() gymId: string = '';
```

**Outputs**:
```typescript
/**
 * Emitted when user clicks delete for an equipment item
 */
@Output() deleteEquipment = new EventEmitter<string>();
```

**Template Structure**:
- Grid layout (responsive columns)
- Equipment cards showing:
  - Icon image
  - Equipment name
  - Delete button (X icon)

**Behavior**:
- Displays equipment in 4-column grid (responsive)
- Click delete button → emits deleteEquipment event with equipment ID

---

## 5. Business Logic & Workflows

### Gym Creation Workflow

```
User Fills Gym Form (name field)
    ↓
Form Validation (3-50 chars, required)
    ↓
User Clicks "Add Gym" Button
    ↓
Component Validates Form
    ↓
POST /api/gym with Gym object
    ↓
Backend Creates Gym in Database
    ↓
Backend Returns Created Gym
    ↓
Frontend Adds to Gyms Array (optimistic update)
    ↓
Form Resets
    ↓
New Tab Created with Gym
    ↓
First Tab Selected
    ↓
Change Detection Triggered
    ↓
UI Updated
```

### Equipment Assignment Workflow

```
User Clicks "Add Equipment" Button
    ↓
AddGymEquipmentDialog Opens
    ↓
User Selects Equipment Items
    ↓
User Clicks Save
    ↓
Dialog Returns Selected Equipment IDs
    ↓
POST /api/gymequipment/{gymId} with equipment IDs
    ↓
Backend Creates GymEquipment Join Records
    ↓
Frontend Removes Item from Local List (optimistic)
    ↓
GET /api/equipment/{gymId} (refresh)
    ↓
Frontend Updates Equipment Display
    ↓
UI Re-renders
```

### Equipment Deletion Workflow

```
User Clicks Delete on Equipment Item
    ↓
Frontend Removes from Local Array (optimistic)
    ↓
DELETE /api/gymequipment/{gymId}/{equipmentId}
    ↓
Backend Deletes GymEquipment Join Record
    ↓
Backend Returns Success
    ↓
UI Updates (already updated optimistically)
```

### Data Flow Diagram

```
Frontend Component (GymPageComponent)
    ↓
User Input (form)
    ↓
Validation (FormControl validators)
    ↓
Service Call (GymService.apiGymPost())
    ↓
HttpClient.post()
    ↓
Backend API (GymController.Post())
    ↓
Service Layer (Repository<Gym>.Insert())
    ↓
Database (EfDbContext.SaveChangesAsync())
    ↓
Response (created Gym object)
    ↓
Frontend Store Update (gyms array)
    ↓
UI Re-render (new tab created)
```

---

## 6. Error Scenarios

| Scenario | Trigger | Current Behavior | Expected Behavior | Status |
|----------|---------|---|---|---|
| Empty gym name | User submits form with blank name | Form validation blocks | Form shows validation error | Working |
| Gym name too short | Name < 3 chars | Form validation blocks | Form shows "Min 3 characters" | Working |
| Gym name too long | Name > 50 chars | Form validation blocks | Form shows "Max 50 characters" | Working |
| Network error creating gym | Network outage | No error handling | Show error toast to user | TODO |
| Duplicate gym name | Name already exists for user | API allows (TODO) | Return 409 Conflict | TODO |
| Delete equipment fails | Network error on DELETE | Equipment stays in UI | UI reverts on error | TODO |
| Equipment ID not found | Invalid equipmentId passed | API might fail silently | Return 404 Not Found | TODO |
| gymId is null | Bug in delete method | Delete call includes null | Validate before DELETE | Bug |
| User not authenticated | JWT token invalid/missing | No auth check | Return 401 Unauthorized | TODO |

---

## 7. Usage Examples

### Frontend Usage - Create Gym

```typescript
// GymPageComponent
export class GymPageComponent implements OnInit {
  constructor(private gymService: GymService) { }

  ngOnInit() {
    // 1. Load all gyms on init
    this.gymService.apiGymGet().subscribe({
      next: (gyms) => {
        this.gyms = gyms;
        // Switch to first tab
        setTimeout(() => {
          this.tabGroup.selectedIndex = 0;
          this.change.markForCheck();
        });
      },
      error: (error) => console.error('Failed to load gyms:', error)
    });
  }

  protected insert() {
    if (this.form.valid) {
      // 2. Create new gym
      const newGym: Gym = {
        name: this.form.value.name
        // TODO: userId should be extracted from user service
      };
      
      this.gymService.apiGymPost({ body: newGym }).subscribe({
        next: (gym) => {
          this.gyms.push(newGym);  // Optimistic update
          this.form.reset();
        },
        error: (error) => console.error('Failed to create gym:', error)
      });
    }
  }
}
```

### Frontend Usage - Assign Equipment

```typescript
// ManageGymComponent
protected openDialog(equipmentIds: string[]) {
  const dialogRef = this.dialog.open(AddGymEquipmentDialog, { 
    data: { equipmentIds } 
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // Call API to assign equipment
      this.gymEquipmentService.apiGymEquipmentGymIdPost({ 
        gymId: this.gym().id as string, 
        body: result 
      }).subscribe((response) => {
        // Refresh equipment list
        this.equipmentService.apiEquipmentIdGet({ 
          id: this.gym().id! 
        }).subscribe((equipment) => {
          this.equipment = equipment;
        });
      });
    }
  });
}
```

### Backend Usage - Repository Pattern

```csharp
// In GymController
public class GymController(Repository repository) : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Gym>> Get()
    {
        // Repository pattern for generic CRUD
        var gyms = _repository.All<Gym>()
            // TODO: Filter by userId from JWT claims
            .ToList();
        return Ok(gyms);
    }

    [HttpPost]
    public bool Post([FromBody] Gym gym)
    {
        var result = _repository.Insert(gym);
        return result != null;
    }
}

// In Repository<T>
public async Task<T> Insert(T entity)
{
    await _dbSet.AddAsync(entity);
    await _context.SaveChangesAsync();
    return entity;
}
```

---

## 8. Related Files & References

### Frontend Implementation

- **Main Component**: [gym.component.ts](../src/app/modules/inventory/pages/gym.component.ts)
- **Manage Component**: [manage-gym.component.ts](../src/app/features/rpg/component/manage-gym.component.ts)
- **Table Component**: [gym-equipment-table.component.ts](../src/app/features/rpg/component/gym-equipment-table.component.ts)
- **Add Equipment Dialog**: [add-gym-equipment.ts](../src/app/modules/inventory/dialogs/add-gym-equipment.ts)
- **Auto-Generated Services**: [src/app/api/services/](../src/app/api/services/) - GymService, EquipmentService, GymEquipmentService

### Backend Implementation

- **Gym Controller**: [Api/Controllers/GymController.cs](../api/Api/Controllers/GymController.cs)
- **Equipment Controller**: [Api/Controllers/EquipmentController.cs](../api/Api/Controllers/EquipmentController.cs)
- **GymEquipment Controller**: [Api/Controllers/GymEquipmentController.cs](../api/Api/Controllers/GymEquipmentController.cs)
- **Gym Model**: [Core/Models/Gym.cs](../api/Core/Models/Gym.cs)
- **Equipment Model**: [Core/Models/Equipment.cs](../api/Core/Models/Equipment.cs)
- **GymEquipment Model**: [Core/Models/GymEquipment.cs](../api/Core/Models/GymEquipment.cs)
- **Repository**: [Database/Services/Repository.cs](../api/Database/Services/Repository.cs)
- **DbContext**: [Database/EntityFramework/EfDbContext.cs](../api/Database/EntityFramework/EfDbContext.cs)

### Tests

- Frontend: [tests/gym.component.spec.ts](../tests/gym.component.spec.ts)
- Backend: [Tests/GymControllerTests.cs](../api/Tests/GymControllerTests.cs)

---

## 9. Known Issues & TODOs

| Issue | Priority | Status | Description | Workaround | Epic |
|-------|----------|--------|---|---|---|
| **userId not extracted from JWT** | High | Open | Gym creation doesn't associate with current user; currently commented out in controller | Manually specify userId | Auth Integration |
| **No user filtering on GET /api/gym** | High | Open | Returns all gyms in system, not just user's gyms | Filter by userId in controller | Auth Integration |
| **Delete passes null gymId** | High | Open | GymEquipmentService.delete() sometimes receives null/undefined gymId, causing delete to fail | Check path parameter passing | Bug Fix |
| **Duplicate equipment assignments** | Medium | Open | Can assign same equipment to gym multiple times | Add database unique constraint | Data Validation |
| **Inefficient equipment refresh** | Medium | Open | After adding equipment, fetches full list instead of updating local array | Update local array on success | Performance |
| **No async/await improvements** | Medium | Open | Some operations block UI; could use better loading indicators | Use ngx-ui-loader spinner | UX |
| **No error handling UI** | Medium | Open | Errors logged to console but not shown to user | Add error toast messages | UX |
| **No duplicate gym name prevention** | Low | Open | User can create multiple gyms with same name | Add unique constraint per user | Data Validation |
| **"Select All Equipment" button missing** | Low | Planned | Quick way to add all equipment to gym | Add button to component | Feature |
| **Rename gym not implemented** | Low | Planned | Form shows name but can't update it | Form is ready, just needs API call | Feature |
| **No soft delete** | Low | Planned | Deleting gym is permanent; might want to archive instead | Implement soft delete | Feature |
| **No equipment filtering** | Low | Planned | Can't filter gym-specific equipment from library | Add filter in component | Feature |

---

## 10. Future Enhancements

- [ ] Gym templates (pre-configured equipment sets for common gym types)
- [ ] Gym capacity tracking (square footage, number of stations)
- [ ] Equipment condition tracking (broken, maintenance needed)
- [ ] Gym cost tracking (monthly fees, equipment purchases)
- [ ] Gym transfer between users (if user changes ownership)
- [ ] Gym photos for visual identification
- [ ] Equipment inventory tracking (quantity per gym)
- [ ] Smart equipment recommendations based on exercises
- [ ] Gym ratings/reviews for commercial gyms

---

## 11. Appendix: Code Generation Notes

### For AI Code Generators

When generating code based on this spec, follow these principles:

**Component Generation**:
1. Use standalone components with explicit imports
2. Use Material components (Button, FormField, Input, Dialog, Grid, Table)
3. Use Reactive Forms (FormGroup, FormControl) for validation
4. Subscribe to services with `subscribe({ next, error, complete })`
5. Use async pipe for Observable subscriptions in templates where possible
6. Handle loading and error states
7. Implement ChangeDetectorRef.markForCheck() for manual change detection

**Service Generation**:
1. Use HttpClient from @angular/common/http
2. Map API responses to TypeScript interfaces
3. Add error handling with catchError operator
4. Use proper type annotations (Observable<T>, not Observable<any>)

**Controller Generation** (Backend):
1. Use [ApiController] and [Route] attributes
2. Inject Repository through constructor
3. Call repository.All<T>() for queries, repository.Insert() for creates
4. Return ActionResult<T> for type safety
5. Add XML documentation comments

**Database Operations**:
1. Inherit from BaseEntity for all domain models
2. Use [ForeignKey] attribute for relationships
3. Use [JsonIgnore] for navigation properties to prevent circular references
4. Use generic Repository<T> pattern for CRUD operations

---

## 12. Performance Considerations

- **Current N+1 Problem**: After adding equipment, refetches all equipment instead of appending. Consider optimizing to reduce API calls.
- **No Caching**: Every page load fetches all gyms fresh. Consider caching strategy.
- **No Pagination**: Returns all gyms. Consider pagination for users with many gyms.
- **Load Time**: Tab initialization waits for all gyms to load before rendering. Consider lazy-loading tabs.

---

*Last reviewed: January 15, 2024 | Spec version: 1.0.0 | Status: Complete (core features)*
