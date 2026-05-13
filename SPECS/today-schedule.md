# Today's Schedule Feature Specification

> Full-stack specification for managing exercises for today

## Metadata

| Property | Value |
|----------|-------|
| **Spec ID** | `today-schedule` |
| **Title** | Today's Schedule |
| **Status** | Design |
| **Last Updated** |  |
| **Version** | 1.0.0 |
| **Related Specs** | [weekly-schedule.spec.md](./weekly-schedule.spec.md), [authentication.spec.md](./authentication.spec.md) |
| **Implemented In** | Frontend: `projects/gamifyworkout/src/app/modules/schedule`, Backend: `projects/gamifyworkout/api/` |

---

## 1. Overview

### What This Feature Does

Exercise Management enables users to add, remove, and maintain exercises for today. The exercises listed are filtered by the muscle groups for today based on the weekly schedule.

**Key Capabilities**:
- Add, remove, or maintain an exercise on the list
- Muscle groups are listed based on weekly schedule

### Key Responsibilities

- **Exercise Lifecycle**: Read, list, and delete exercises for authenticated users
- **Exercise Assignment**: Associate exercises with today's schedule filtered by muscle group
- **Data Persistence**: Save today's exercises to MSSQL database
- **User Scoping**: Schedule exercises are for the authenticated user

### Integration Points

- **Upstream Dependencies**: 
  - Authentication (user identity via JWT claims)
  - Exercise library (available exercises to assign)
  
- **Downstream Consumers**:
  - Weekly Schedule (muscle groups for today)
  - RPG Features (future: XP rewards for gym workouts)

- **External Systems**:
  - MSSQL Database (via EntityFramework Core 9)
  - OpenAPI/Swagger (auto-generates API client)

---

## 2. Data Models

### Domain Model Diagram

```
User
└── Schedule (1:N relationship)
    ├── UserId (Foreign Key)
    ├── Date (DateOnly - one entry per day)
    ├── MuscleGroupFilter[] (array of MuscleGroups)
    └── WorkoutLog (N relationship - individual exercises)
        ├── Sets
        ├── Reps
        ├── Weight
        └── Exercise (N:1)
            ├── PrimaryMuscleGroup
            ├── SecondaryMuscleGroup
            └── Muscle (detailed muscle targeting)
```

### TypeScript Models (Frontend)

**Auto-generated from OpenAPI spec in `src/app/api/models/`**

See schedule.ts, weekly-schedule.ts, and workout-log.ts

### C# Models (Backend)

**Located in `api/Core/Models/`**

See Schedule.cs, User.cs, WorkoutLog.cs, and BaseEntity.cs
```

### Entity Relationships

| From | To | Type | Cardinality | Foreign Key | Delete Behavior | Notes |
|------|----|----|---|---|---|---|
| Schedule | User | Association | N:1 | `UserId` | Cascade | User owns multiple schedules |
| Schedule | WorkoutLog | Composition | 1:N | `ScheduleId` | Cascade | Delete schedule → delete workouts |
| WorkoutLog | Exercise | Association | N:1 | `ExerciseId` | No action | Exercise library persists |
| WorkoutLog | Schedule | Association | N:1 | `ScheduleId` | Cascade | Join via Schedule |

### Validation Rules

| Field | Type | Required | Constraints | Error Message | Backend Enforced |
|-------|------|----------|-------------|---|---|
| `date` | DateOnly | Yes | Valid date, format "YYYY-MM-DD" | "Invalid date format" | DateOnly validation |
| `userId` | Guid | Yes | Must exist in Users | "User not found" | FK constraint |
| `muscleGroupFilter[]` | MuscleGroup[] | No | Valid enum values | "Invalid muscle group" | Enum validation |
| `sets` | int | No | 1-100 | "Sets must be 1-100" | Not yet enforced |
| `reps` | int | No | 1-100 | "Reps must be 1-100" | Not yet enforced |
| `weight` | double | No | > 0 | "Weight must be positive" | Not yet enforced |

---

## 3. API Contracts

### Endpoints

#### 3.1 GET List of muscle groups for today

```
GET /api/schedule/today/muscle
```

**Description**: Retrieve muscle groups assigned to today on the weekly schedule. Load the weekly schedule using today's date. If there is no weekly schedule for this week, load the default template instead. Return the muscle groups in the weekly schedule that match today's date.

**Authentication**: Not enforced (TODO: should require JWT Bearer token)

**Query Parameters**: None currently supported

**Response** (200 OK):
```json
["Arms","Back","Core"]
```

**Status Codes**:
- `200 OK`: Success, returns array (may be empty)
- `500 Internal Server Error`: Database or server error

**Known Issues**:
- Endpoint does not filter by authenticated user (returns all gyms)
- No pagination support

#### 3.2 GET List of exercises for today

```
GET /api/schedule/today/exercise
```

**Description**: Retrieve exercises assigned to today on the weekly schedule. (TODO: filter by current user).

**Authentication**: Not enforced (TODO: should require JWT Bearer token)

**Query Parameters**: None currently supported

**Response** (200 OK):
```json
[{"name":"Bicycle Kick","description":"Bicycle Kick","icon":"bicycle.png","primaryMuscleGroup":"Core","primaryMuscle":"Abs","secondaryMuscleGroup":null,"secondaryMuscle":null,"id":"00000000-0000-0000-0000-000000000000"}]
```

**Status Codes**:
- `200 OK`: Success, returns array (may be empty)
- `500 Internal Server Error`: Database or server error

**Known Issues**:
- Endpoint does not filter by authenticated user (returns all gyms)
- No pagination support

---

## 4. Components & Services (Frontend)

### Service Specifications

#### GymService

**File**: `src/app/api/services/schedule.service.ts` (auto-generated)

**Purpose**: HTTP client for schedule-related API operations

**Dependencies**:
- `HttpClient` (Angular, provided by app bootstrap)
- `Configuration` (OpenAPI configuration with base URL)

**Error Handling**:
- Network errors → propagates to component via Observable error channel
- 5xx errors → propagates as error
- No automatic retry or error transformation

---

### Component Specifications

#### TodaySchedulePageComponent

**File**: `src/app/modules/schedule/pages/today-schedule.component.ts`

**Purpose**: Main page for exercises; displays list of exercises for today filtered by muscle group in the weekly schedule

**Selector**: (used in routing, no selector)

**Inputs**: None

**Outputs**: None

**Template Structure**:
- Material label "Muscle Groups: " with a comma delimited list of muscle groups from api
- Material Table with exercises for today
- Error display area (TODO: add error messaging)
- Loading indicator (TODO: add spinner)

**Business Logic**:

- Display a link to the weekly schedule if no muscle groups exist for today from the weekly schedule

**Known Issues**:

| Issue | Impact | Workaround |
|-------|--------|---|

**Child Components**:
- `AddExerciseComponent` (passed exercise prop for each tab)

---

#### AddExerciseComponent

**Name**: Add Exercise Dialog

**File**: `src/app/modules/schedule/dialogs/add-exercise.component.ts`

**Purpose**: Manage a single exercise (AI do not implement yet)

**Selector**: `add-exercise`

**Inputs**:
```typescript
/**
 * The exercise to manage (required)
 * Passed from parent TodaySchedulePageComponent
 */
exercise = input.required<Exercise>();
```

**Outputs**: None (updates made directly via services)

**Template Structure**:
- Exercise name display field (editable text)
- "Add Exercise" button (opens dialog)

**Business Logic**:

- Exercise display name, description, muscles, and muscle groups
- Add form to edit a WorkoutLog to be saved with the Exercise for today
- Update button saves WorkoutLog
- Update button closes dialog and refreshes today schedule page

**Known Issues**:

| Issue | Priority | Status | Workaround |
|-------|----------|--------|---|

---

## 5. Business Logic & Workflows

### Exercise Add Workflow

```
User Clicks on "Add Exercise" Button to display "Add Exercise Dialog"
    ↓
User Fills out WorkoutLog form on dialog form
    ↓
POST /api/schedule/exercise with WorkoutLog object
    ↓
Backend Creates WorkoutLog in Database
    ↓
Backend Returns Created WorkoutLog
    ↓
Frontend WorkoutLog to WorkoutLogs Array (optimistic update)
    ↓
Change Detection Triggered
    ↓
UI Updated
```

### Data Flow Diagram

```
Frontend Component (TodaySchedulePageComponent)
    ↓
User Input (form)
    ↓
Validation (FormControl validators)
    ↓
Service Call (WorkoutLogService.apiPost())
    ↓
HttpClient.post()
    ↓
Backend API (WorkoutLogController.Post())
    ↓
Service Layer (Repository<WorkoutLog>.Insert())
    ↓
Database (EfDbContext.SaveChangesAsync())
    ↓
Response (created WorkoutLog object)
    ↓
Frontend Store Update (workouts array)
    ↓
UI Re-render (new tab created)
```

---

## 6. Error Scenarios

| Scenario | Trigger | Current Behavior | Expected Behavior | Status |
|----------|---------|---|---|---|

---

## 8. Related Files & References

### Frontend Implementation

- **Main Component**: [today-schedule.component.ts](../src/app/modules/schedule/pages/today-schedule.component.ts)
- **Add Exercise Dialog**: [add-exercise.component.ts](../src/app/modules/schedule/dialogs/add-exercise.component.ts)
- **Auto-Generated Services**: [src/app/api/services/](../src/app/api/services/) - WorkoutLogService, ExerciseService, ScheduleService

### Backend Implementation

- **Schedule Controller**: [Api/Controllers/ScheduleController.cs](../api/Api/Controllers/ScheduleController.cs)
- **WorkoutLog Model**: [Core/Models/WorkoutLog.cs](../api/Core/Models/WorkoutLog.cs)
- **Schedule Model**: [Core/Models/Schedule.cs](../api/Core/Models/Schedule.cs)
- **Exercise Model**: [Core/Models/Exercise.cs](../api/Core/Models/Exercise.cs)
- **Repository**: [Database/Services/Repository.cs](../api/Database/Services/Repository.cs)
- **DbContext**: [Database/EntityFramework/EfDbContext.cs](../api/Database/EntityFramework/EfDbContext.cs)

### Tests

- Frontend: [tests/today-schedule.component.spec.ts](../tests/today-schedule.component.spec.ts)
- Backend: [Tests/ScheduleControllerTests.cs](../api/Tests/ScheduleControllerTests.cs)

---

## 9. Known Issues & TODOs

| Issue | Priority | Status | Description | Workaround | Epic |
|-------|----------|--------|---|---|---|

---

## 10. Future Enhancements

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

---
