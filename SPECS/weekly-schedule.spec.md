# Weekly Schedule Feature Specification

> Full-stack specification for weekly workout schedule management with drag-and-drop muscle group assignment.

## Metadata

| Property | Value |
|----------|-------|
| **Spec ID** | `weekly-schedule` |
| **Title** | Weekly Schedule Management |
| **Status** | In Progress (core UI complete, API integration partial) |
| **Last Updated** | 2024-01-15 |
| **Version** | 1.0.0 |
| **Related Specs** | [gym-management.spec.md](./gym-management.spec.md), [shared-services.spec.md](./shared-services.spec.md) |
| **Implemented In** | Frontend: `projects/gamifyworkout/src/app/modules/schedule/`, Backend: `projects/gamifyworkout/api/Api/Controllers/ScheduleController.cs` |

---

## 1. Overview

### What This Feature Does

Weekly Schedule allows users to plan weekly workouts by dragging and dropping muscle groups (or exercise types) into each day of the week. Users can create a customized weekly schedule, save it with a name and optional "default" flag, and retrieve saved schedules for specific weeks.

**Key Capabilities**:
- Drag-and-drop muscle groups into weekday columns
- Visual week-at-a-glance workout planning (Monday-Sunday)
- Save weekly schedules with optional template naming
- Load existing schedules for any given week
- Filter exercises by primary muscle group
- Reusable schedule templates (planned)

### Key Responsibilities

- **Schedule Persistence**: Save and retrieve weekly exercise plans from database
- **Muscle Group Filtering**: Filter available exercises by selected muscle groups
- **Weekly Aggregation**: Group individual daily schedules into a WeeklySchedule DTO
- **Date Management**: Calculate week boundaries (Monday-Sunday) and handle date logic
- **Template Support**: Save schedules as named templates for reuse

### Integration Points

- **Upstream Dependencies**:
  - Authentication (user identity from JWT)
  - Gym Management (future: associate schedules with specific gyms)
  - Exercise Library (auto-suggest exercises based on muscle groups)

- **Downstream Consumers**:
  - RPG Gamification (future: award XP when workout completed)
  - Workout Logging (future: create entries from schedules)

- **External Systems**:
  - MSSQL Database (persist schedules)
  - DateOnly type (.NET 6+ DateOnly for date precision)

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

WeeklySchedule DTO (aggregates 7 Schedule records)
├── Monday (Schedule)
├── Tuesday (Schedule)
├── ... (through Sunday)
└── Each day contains MuscleGroupFilter and Workouts
```

### TypeScript Models (Frontend)

**Auto-generated from OpenAPI spec in `src/app/api/models/`**

```typescript
/**
 * Represents muscle group categories for workout planning
 * Used for schedule filtering and exercise selection
 */
export enum MuscleGroup {
  Any = 'Any',
  Arms = 'Arms',
  Back = 'Back',
  Cardio = 'Cardio',
  Chest = 'Chest',
  Core = 'Core',
  Legs = 'Legs',
  Shoulders = 'Shoulders'
}

/**
 * Represents a single day's workout schedule
 */
export interface Schedule {
  id?: string;  // Guid
  userId?: string;  // Guid of schedule owner
  date?: string;  // DateOnly as ISO date string "YYYY-MM-DD"
  muscleGroupFilter?: MuscleGroup[];  // Array of selected muscle groups for the day
  workouts?: WorkoutLog[];  // Associated workout exercises for the day
}

/**
 * Represents a recorded workout session entry
 * Tracks sets, reps, and weight for a specific exercise
 */
export interface WorkoutLog {
  scheduleId?: string;  // Foreign key to Schedule
  exerciseId?: string;  // Foreign key to Exercise
  date?: string;  // Date of workout (ISO format)
  sets?: number;  // Number of sets performed
  reps?: number;  // Reps per set
  weight?: number;  // Weight in pounds/kg
}

/**
 * Represents an exercise (pre-defined exercises library)
 */
export interface Exercise {
  id?: string;  // Guid
  name?: string;  // Exercise name (e.g., "Bench Press")
  description?: string;  // How to perform the exercise
  icon?: string;  // Icon identifier
  primaryMuscleGroup?: MuscleGroup;  // Main muscle group targeted
  primaryMuscle?: Muscle;  // Specific primary muscle
  secondaryMuscleGroup?: MuscleGroup;  // Secondary muscle group
  secondaryMuscle?: Muscle;  // Specific secondary muscle
}

/**
 * Detailed muscle targeting (17 total)
 */
export enum Muscle {
  Abs = 'Abs',
  Abductors = 'Abductors',
  Adductors = 'Adductors',
  Biceps = 'Biceps',
  Calves = 'Calves',
  Chest = 'Chest',
  Forearms = 'Forearms',
  Glutes = 'Glutes',
  Hamstrings = 'Hamstrings',
  Lats = 'Lats',
  LowerBack = 'LowerBack',
  MiddleBack = 'MiddleBack',
  Neck = 'Neck',
  Quadriceps = 'Quadriceps',
  Shoulders = 'Shoulders',
  Traps = 'Traps',
  Triceps = 'Triceps'
}

/**
 * Aggregated weekly schedule (7 days)
 * Frontend uses this for saving, backend returns for loading
 */
export interface WeeklySchedule {
  monday?: Schedule;
  tuesday?: Schedule;
  wednesday?: Schedule;
  thursday?: Schedule;
  friday?: Schedule;
  saturday?: Schedule;
  sunday?: Schedule;
}
```

### C# Models (Backend)

**Located in `api/Core/Models/`**

```csharp
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core;

/// <summary>
/// Represents a single day's workout schedule
/// One record per day per user
/// </summary>
public class Schedule : BaseEntity
{
    /// <summary>
    /// Owner of the schedule (Foreign Key to User)
    /// </summary>
    [ForeignKey("User.Id")]
    [JsonIgnore]
    public Guid UserId { get; set; }

    /// <summary>
    /// Date of the schedule (DateOnly - date only, no time)
    /// Format: YYYY-MM-DD
    /// </summary>
    public DateOnly Date { get; set; }

    /// <summary>
    /// Array of muscle groups planned for this day
    /// TODO: Currently stored as JSON string '[2,3]' - normalize to separate table
    /// Should be: ICollection<ScheduleMuscleGroup> for normalization
    /// </summary>
    public List<MuscleGroup>? MuscleGroupFilter { get; set; }

    /// <summary>
    /// Navigation property: Workouts performed on this schedule
    /// </summary>
    public ICollection<WorkoutLog>? Workouts { get; set; }
}

/// <summary>
/// Represents a recorded workout entry (sets, reps, weight)
/// Tracks actual performance of an exercise on a specific day
/// </summary>
public class WorkoutLog
{
    /// <summary>
    /// Foreign Key to Schedule
    /// </summary>
    [ForeignKey("Schedule.Id")]
    public Guid ScheduleId { get; set; }

    /// <summary>
    /// Foreign Key to Exercise (template/definition)
    /// </summary>
    [ForeignKey("Exercise.Id")]
    public Guid ExerciseId { get; set; }

    /// <summary>
    /// Date the workout was performed (redundant with Schedule.Date, but included for flexibility)
    /// </summary>
    public DateOnly Date { get; set; }

    /// <summary>
    /// Number of sets performed (e.g., 3)
    /// </summary>
    public int Sets { get; set; }

    /// <summary>
    /// Reps per set (e.g., 10)
    /// </summary>
    public int Reps { get; set; }

    /// <summary>
    /// Weight used in pounds or kg (e.g., 225.5)
    /// </summary>
    public double Weight { get; set; }
}

/// <summary>
/// Pre-defined exercise template (library entry)
/// </summary>
public class Exercise : BaseEntity
{
    /// <summary>
    /// Exercise name (e.g., "Bench Press", "Squats")
    /// </summary>
    public required string Name { get; set; }

    /// <summary>
    /// How to perform the exercise
    /// </summary>
    public required string Description { get; set; }

    /// <summary>
    /// Icon identifier for UI display
    /// </summary>
    public required string Icon { get; set; }

    /// <summary>
    /// Primary muscle group (e.g., Chest, Legs)
    /// </summary>
    public MuscleGroup PrimaryMuscleGroup { get; set; }

    /// <summary>
    /// Primary specific muscle (e.g., Pectoralis for Chest)
    /// </summary>
    public Muscle PrimaryMuscle { get; set; }

    /// <summary>
    /// Secondary muscle group (if exercise works multiple groups)
    /// </summary>
    public MuscleGroup? SecondaryMuscleGroup { get; set; }

    /// <summary>
    /// Secondary specific muscle
    /// </summary>
    public Muscle? SecondaryMuscle { get; set; }
}

/// <summary>
/// Muscle group categories for filtering exercises
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum MuscleGroup
{
    Any,
    Arms,
    Back,
    Cardio,
    Chest,
    Core,
    Legs,
    Shoulders
}

/// <summary>
/// 17 detailed muscle groups for precise targeting
/// </summary>
[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Muscle
{
    Abs,
    Abductors,
    Adductors,
    Biceps,
    Calves,
    Chest,
    Forearms,
    Glutes,
    Hamstrings,
    Lats,
    LowerBack,
    MiddleBack,
    Neck,
    Quadriceps,
    Shoulders,
    Traps,
    Triceps
}

/// <summary>
/// Aggregated weekly schedule (7 Schedule records)
/// Used for API responses and requests
/// </summary>
public class WeeklySchedule
{
    public Schedule? Monday { get; set; }
    public Schedule? Tuesday { get; set; }
    public Schedule? Wednesday { get; set; }
    public Schedule? Thursday { get; set; }
    public Schedule? Friday { get; set; }
    public Schedule? Saturday { get; set; }
    public Schedule? Sunday { get; set; }

    public WeeklySchedule() { }

    /// <summary>
    /// Constructor to aggregate 7 Schedule records into WeeklySchedule
    /// </summary>
    /// <param name="schedules">Exactly 7 Schedule records (Mon-Sun)</param>
    /// <exception cref="ArgumentException">Thrown if not exactly 7 schedules</exception>
    public WeeklySchedule(List<Schedule> schedules)
    {
        if (schedules == null || schedules.Count != 7)
            throw new ArgumentException("There should be exactly 7 schedules.");

        Monday = schedules[0];
        Tuesday = schedules[1];
        Wednesday = schedules[2];
        Thursday = schedules[3];
        Friday = schedules[4];
        Saturday = schedules[5];
        Sunday = schedules[6];
    }
}
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

#### 3.1 GET Weekly Schedule

```
GET /api/schedule/{monday}
```

**Description**: Retrieve weekly schedule for a given week (identified by Monday date)

**Authentication**: Not enforced (TODO: should require JWT)

**Path Parameters**:
| Name | Type | Required | Format | Description |
|------|------|----------|--------|---|
| `monday` | DateOnly | Yes | YYYY-MM-DD | Monday date of the week to retrieve |

**Query Parameters**: None

**Response** (200 OK):
```json
{
  "monday": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "date": "2024-01-15",
    "muscleGroupFilter": ["Chest", "Triceps"],
    "workouts": [
      {
        "scheduleId": "550e8400-e29b-41d4-a716-446655440000",
        "exerciseId": "550e8400-e29b-41d4-a716-446655440002",
        "date": "2024-01-15",
        "sets": 4,
        "reps": 8,
        "weight": 225.5
      }
    ]
  },
  "tuesday": { ... },
  "wednesday": { ... },
  "thursday": { ... },
  "friday": { ... },
  "saturday": { ... },
  "sunday": { ... }
}
```

**Status Codes**:
- `200 OK`: Success, returns WeeklySchedule (may have null days)
- `400 Bad Request`: Invalid date format
- `500 Internal Server Error`: Server error

**Known Issues**:
- Endpoint returns all schedules in database (no user filtering, TODO)
- If no schedules exist for week, throws ArgumentException instead of returning empty

---

#### 3.2 POST Save Weekly Schedule

```
POST /api/schedule
```

**Description**: Create or update schedules for a full week

**Authentication**: Not enforced (TODO: extract userId from JWT)

**Request Body**:
```json
{
  "monday": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "550e8400-e29b-41d4-a716-446655440001",
    "date": "2024-01-15",
    "muscleGroupFilter": ["Chest", "Triceps"],
    "workouts": []
  },
  "tuesday": { "date": "2024-01-16", "muscleGroupFilter": ["Back"], "workouts": [] },
  "wednesday": { "date": "2024-01-17", "muscleGroupFilter": ["Legs"], "workouts": [] },
  "thursday": { "date": "2024-01-18", "muscleGroupFilter": ["Shoulders"], "workouts": [] },
  "friday": { "date": "2024-01-19", "muscleGroupFilter": ["Arms"], "workouts": [] },
  "saturday": { "date": "2024-01-20", "muscleGroupFilter": ["Core"], "workouts": [] },
  "sunday": { "date": "2024-01-21", "muscleGroupFilter": null, "workouts": [] }
}
```

**Response** (200 OK):
```json
true
```

**Status Codes**:
- `200 OK`: Schedules saved successfully
- `400 Bad Request`: Validation error
- `500 Internal Server Error`: Database error

**Behavior**:
- Adds all non-null Schedule objects to DbContext
- Calls SaveChangesAsync() once for the batch
- Returns boolean (true if any changes saved, false otherwise)

**Known Issues**:
- Returns boolean instead of CreatedAtAction
- No validation of date format before save
- Frontend must construct all 7 days even if some are empty
- userId must be hardcoded in frontend (not extracted from auth)

---

## 4. Components & Services (Frontend)

### Service Specifications

#### ScheduleService

**File**: `src/app/api/services/schedule.service.ts` (auto-generated)

**Purpose**: HTTP client for schedule operations

**Methods**:

```typescript
/**
 * Get weekly schedule starting from given Monday
 * @param request - Request with Monday date
 * @param request.monday - DateOnly as "YYYY-MM-DD"
 * @returns Observable of WeeklySchedule
 */
apiScheduleGet(request: { monday: string }): Observable<WeeklySchedule> { }

/**
 * Save weekly schedule (all 7 days at once)
 * @param request - Request with WeeklySchedule payload
 * @param request.body - WeeklySchedule with days to save
 * @returns Observable of boolean success
 */
apiSchedulePost(request: { body: WeeklySchedule }): Observable<boolean> { }
```

**Dependencies**:
- HttpClient (Angular)
- Configuration (OpenAPI base URL)

---

### Component Specifications

#### WeekPageComponent

**File**: `src/app/modules/schedule/pages/week/week-page.component.ts`

**Purpose**: Main weekly schedule view with drag-and-drop interface

**Selector**: (used in routing, no standalone selector)

**Inputs**: None

**Outputs**: None

**Class Properties**:

```typescript
/**
 * Available muscle groups to drag from pool
 */
activity: Array<MuscleGroup> = [
  MuscleGroup.Any,
  MuscleGroup.Cardio,
  MuscleGroup.Core,
  MuscleGroup.Chest,
  MuscleGroup.Back,
  MuscleGroup.Shoulders,
  MuscleGroup.Arms,
  MuscleGroup.Legs
];

/**
 * Muscle groups scheduled for each day (arrays for drag-drop zones)
 */
monday: Array<MuscleGroup> = [];
tuesday: Array<MuscleGroup> = [];
wednesday: Array<MuscleGroup> = [];
thursday: Array<MuscleGroup> = [];
friday: Array<MuscleGroup> = [];
saturday: Array<MuscleGroup> = [];
sunday: Array<MuscleGroup> = [];

/**
 * Material Dialog reference
 */
readonly dialog = inject(MatDialog);
```

**Lifecycle**:

```typescript
constructor(private scheduleService: ScheduleService) { }

protected openDialog(action: DialogAction): void {
  // 1. Open AddWeeklyScheduleDialog
  // 2. Get dialog result (name and default flag)
  // 3. If action == 'Save':
  //    - Calculate dates for each day of current week
  //    - Create WeeklySchedule DTO with current monday-sunday arrays
  //    - Call scheduleService.apiSchedulePost()
  //    - On success: log success
  //    - On error: log error
  // 4. If cancelled: do nothing
}
```

**Template Structure**:
- Activity pool (draggable muscle group items)
- Weekday columns (Mon-Sun, drop zones for muscle groups)
- "Save" and "Save Template" buttons
- Dialog for naming template

**Business Logic**:

```typescript
// Calculate current week Monday
let today = new Date();
let dayOfWeek = today.getDay();  // 0=Sunday, 1=Monday, etc.
let monday = new Date();
monday.setDate(today.getDate() + dayOfWeek - 1);  // Adjust to get Monday

// Format as YYYY-MM-DD for API
date: monday.toLocaleDateString('en-CA')  // 'en-CA' locale returns YYYY-MM-DD

// Save weekly schedule
const weeklySchedule: WeeklySchedule = {
  monday: { date: monDate, muscleGroupFilter: this.monday },
  tuesday: { date: tueDate, muscleGroupFilter: this.tuesday },
  // ... etc for all 7 days
};

this.scheduleService.apiSchedulePost({ body: weeklySchedule }).subscribe(...);
```

**Drag-and-Drop Behavior**:
- Muscle groups can be dragged from activity pool to any weekday
- Dropped items stay in the weekday array
- Can drag items between days
- Items can be removed by dragging outside zones (TODO: implement)
- "Any" can appear in any day

**Known Issues**:

| Issue | Priority | Status | Workaround |
|-------|----------|--------|---|
| Date calculation uses toLocaleDateString() | Medium | Open | Could use toISOString() for consistency |
| No error handling for save failures | High | Open | Silent failure - user doesn't know if save succeeded |
| Dialog result type not fully typed | Low | Open | Returns { name: string, default: boolean } |
| Can drag duplicate muscle groups to same day | Low | Open | Allow duplicates (not prevented by CDK) |
| No ability to remove items from schedule | Medium | Planned | Implement swipe or drag-to-trash |

**Child Components**:
- `WeekdayDropContainer` (drop zone for each day)
- `AddWeeklyScheduleDialog` (modal for naming)

---

#### WeekdayDropContainer

**File**: `src/app/modules/schedule/pages/week/week-page.component.ts` (inline component)

**Purpose**: Drop zone for muscle groups for a specific weekday

**Selector**: `app-weekday-drop-container`

**Inputs**:
```typescript
@Input() id!: string;  // Unique identifier for drop list
@Input() data!: Array<MuscleGroup>;  // Array reference for items in this day
@Input() label!: string;  // Day name (Monday, Tuesday, etc.)
```

**Outputs**: None

**Methods**:

```typescript
/**
 * Handle drop event from CDK drag-drop
 * @param event - CdkDropListDropped event
 */
drop(event: CdkDropListDropped<MuscleGroup[]>): void {
  if (event.previousContainer === event.container) {
    // Reorder within same day
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    // Copy from activity pool or move from another day
    copyArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
```

**Template**:
```html
<div class="weekdayColumn" 
     cdkDropList 
     [id]="id()" 
     [cdkDropListData]="data()"
     (cdkDropListDropped)="drop($event)">
  
  <h3>{{ label() }}</h3>
  
  @for (item of data(); track item) {
    <div cdkDrag class="muscle-group-item">
      {{ item }}
    </div>
  }
</div>
```

---

#### AddWeeklyScheduleDialog

**File**: `src/app/modules/schedule/dialogs/add-weekly-schedule.ts`

**Purpose**: Dialog for naming weekly schedule templates

**Component**:
```typescript
@Component({
  templateUrl: 'add-weekly-schedule.html',
  imports: [ReactiveFormsModule, MatButtonModule, MatDialogModule, MatInputModule, TextboxComponent, MatSlideToggleModule]
})
export class AddWeeklyScheduleDialog {
  form: FormGroup = new FormGroup({
    name: new FormControl('', {
      validators: [Validators.required, Validators.minLength(3), Validators.maxLength(50)]
    }),
    default: new FormControl()
  });

  protected dialogClose(): { name: string, default: boolean } {
    return { 
      name: this.form.get('name')?.value, 
      default: this.form.get('default')?.value || false 
    };
  }

  public isFormValid(): boolean {
    return this.form.valid;
  }
}
```

**Inputs**:
- None

**Outputs**:
- Closes dialog with `{ name: string, default: boolean }`

**Fields**:
- `name` (text, required, 3-50 chars) - Template name
- `default` (checkbox) - Mark as default weekly schedule

---

## 5. Business Logic & Workflows

### Weekly Schedule Save Workflow

```
User Creates Week Plan
    ↓ (drag-drop muscle groups)
User Clicks "Save" Button
    ↓
AddWeeklyScheduleDialog Opens
    ↓ (optional: get template name)
User Submits Dialog
    ↓
Frontend Builds WeeklySchedule DTO
    ├── Calculate dates for Mon-Sun
    ├── Populate each day with muscleGroupFilter from arrays
    └── Set workouts to []
    ↓
POST /api/schedule with WeeklySchedule
    ↓
Backend Creates 7 Schedule Records
    ├── One per day (Mon-Sun)
    ├── Each with userId, date, muscleGroupFilter
    └── Add all to DbContext
    ↓
Backend Calls SaveChangesAsync()
    ↓
Database Persists Schedules
    ↓
Backend Returns true
    ↓
Frontend Logs Success (TODO: show toast)
    ↓
UI Updated
```

### Weekly Schedule Load Workflow

```
App Initializes or User Navigates to Schedule
    ↓
Frontend Calculates Current Week Monday
    ↓
GET /api/schedule/{monday}
    ↓
Backend Queries Schedules for That Week
    ├── Filter by date >= monday && date <= sunday
    ├── Order by date
    └── Aggregate into WeeklySchedule DTO
    ↓
Backend Validates Exactly 7 Records
    ├── If not 7: throws ArgumentException (TODO: return empty)
    └── Constructs WeeklySchedule object
    ↓
Backend Returns WeeklySchedule
    ↓
Frontend Populates Arrays
    ├── this.monday = response.monday.muscleGroupFilter
    ├── this.tuesday = response.tuesday.muscleGroupFilter
    └── ... (through Sunday)
    ↓
UI Renders Drag-Drop Interface
    ↓
User Can Now See/Modify Schedule
```

### Drag-and-Drop Workflow

```
User Clicks and Holds Muscle Group
    ↓
CDK Drag Starts
    ↓ (drag over weekday)
Preview Follows Cursor
    ↓
User Releases Over Weekday Zone
    ↓
CDK Drop Event Fires
    ↓
drop() Method Evaluates
    ├── If from activity: copyArrayItem (can add multiple)
    ├── If from another day: copyArrayItem or moveItemInArray
    └── Update array reference
    ↓
Angular Change Detection
    ↓
UI Re-renders Weekday Column
    ↓
Item Now Shows in New Day
```

---

## 6. Error Scenarios

| Scenario | Trigger | Current Behavior | Expected Behavior | Status |
|----------|---------|---|---|---|
| No schedules for week | User visits schedule for new week | Throws ArgumentException | Return empty WeeklySchedule | Bug |
| Invalid date format | Frontend passes bad date | API validation fails | Return 400 with error | Partial |
| Network error saving | Connection lost during POST | Error logged to console | Show error toast to user | TODO |
| Zero schedules returned | Query returns empty array | ArgumentException thrown | Return empty, allow user to create | Bug |
| Duplicate schedules for day | Bug saves same date twice | Database allows (no constraint) | Enforce unique per user per date | TODO |
| userId mismatch | User accesses another user's schedule | API allows (no auth) | Validate userId from JWT | TODO |
| Invalid MuscleGroup value | Bad enum value in JSON | JSON parsing fails | Return 400 error | Partial |
| Workouts array ignored | User includes WorkoutLog in save | Backend ignores (TODO) | Save or reject | TODO |

---

## 7. Usage Examples

### Frontend Usage - Load and Save Schedule

```typescript
// WeekPageComponent
export class WeekPageComponent {
  constructor(private scheduleService: ScheduleService) { }

  protected openDialog(action: DialogAction) {
    if (action == 'Save') {
      // Calculate current week
      let today = new Date();
      let dayOfWeek = today.getDay();
      let monday = new Date();
      monday.setDate(today.getDate() + dayOfWeek - 1);

      // Build WeeklySchedule DTO
      const weeklySchedule: WeeklySchedule = {
        monday: { date: monday.toLocaleDateString('en-CA'), muscleGroupFilter: this.monday },
        tuesday: { date: tueDate, muscleGroupFilter: this.tuesday },
        // ... through Sunday
      };

      // Save via API
      this.scheduleService.apiSchedulePost({ body: weeklySchedule }).subscribe((isSuccess) => {
        console.log("Schedule saved:", isSuccess);
      });
    }
  }
}
```

### Backend Usage - Query and Aggregate

```csharp
// ScheduleController
[HttpGet("{monday}")]
public ActionResult<WeeklySchedule> Get(DateOnly monday)
{
    var context = _contextFactory.CreateDbContext();
    
    // Query schedules for the week
    var schedules = context.Schedule
        // TODO: Filter by userId from JWT claims
        .Where(s => s.Date >= monday && s.Date <= monday.AddDays(6))
        .OrderBy(s => s.Date)
        .ToList();

    // Aggregate into WeeklySchedule (throws if not exactly 7)
    var weeklySchedule = new WeeklySchedule(schedules);
    return Ok(weeklySchedule);
}
```

### CDK Drag-Drop Usage

```typescript
// In WeekdayDropContainer
drop(event: CdkDropListDropped<MuscleGroup[]>): void {
  if (event.previousContainer === event.container) {
    // Reorder items in same day
    moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  } else {
    // Copy from activity pool to day
    copyArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
  }
}
```

---

## 8. Related Files & References

### Frontend Implementation

- **Week Page Component**: [week-page.component.ts](../src/app/modules/schedule/pages/week/week-page.component.ts)
- **Week Page Template**: [week-page.component.html](../src/app/modules/schedule/pages/week/week-page.component.html)
- **Schedule Dialog**: [add-weekly-schedule.ts](../src/app/modules/schedule/dialogs/add-weekly-schedule.ts)
- **Schedule Service**: [src/app/api/services/schedule.service.ts](../src/app/api/services/schedule.service.ts) (auto-generated)
- **Routes**: [schedule.routes.ts](../src/app/modules/schedule/schedule.routes.ts)

### Backend Implementation

- **Schedule Controller**: [Api/Controllers/ScheduleController.cs](../api/Api/Controllers/ScheduleController.cs)
- **Schedule Model**: [Core/Models/Schedule.cs](../api/Core/Models/Schedule.cs)
- **Exercise Model**: [Core/Models/Exercise.cs](../api/Core/Models/Exercise.cs)
- **WorkoutLog Model**: [Core/Models/WorkoutLog.cs](../api/Core/Models/WorkoutLog.cs)
- **DbContext**: [Database/EntityFramework/EfDbContext.cs](../api/Database/EntityFramework/EfDbContext.cs)

### Dependencies

- **CDK Drag-Drop**: `@angular/cdk/drag-drop` - Drag-and-drop functionality
- **Material**: `@angular/material` - Buttons, dialogs, inputs
- **RxJS**: Observable-based HTTP calls

---

## 9. Known Issues & TODOs

| Issue | Priority | Status | Description | Workaround | Epic |
|-------|----------|--------|---|---|---|
| **No user filtering on GET** | High | Open | Returns all schedules, not filtered by authenticated user | Hardcode userId in frontend | Auth Integration |
| **No error handling on save** | High | Open | Save failures logged to console, not shown to user | Check browser console | UX |
| **WeeklySchedule requires exactly 7 records** | High | Open | If week has <7 schedules, throws ArgumentException | Create all 7 days even if empty | Bug |
| **MuscleGroupFilter stored as JSON string** | Medium | Open | Currently stored as nvarchar "[2,3]" instead of normalized table | Create ScheduleMuscleGroup junction table | Schema |
| **No validation for duplicate dates** | Medium | Open | Can save multiple schedules for same date | Add unique constraint (user, date) | Data |
| **userId hardcoded/not from JWT** | Medium | Open | Frontend must manually specify userId | Extract from auth service | Auth |
| **No workout logging integration** | Medium | Planned | WorkoutLog structure exists but not connected to UI | Add workout tracking UI | Feature |
| **No template reusability** | Low | Planned | Can name schedules but can't load as templates | Add template management UI | Feature |
| **Date format inconsistency** | Low | Open | Uses toLocaleDateString('en-CA') instead of ISO | Use consistent ISO format | Tech Debt |
| **No exercise filtering** | Low | Planned | Can't filter exercises by selected muscle group | Add exercise library component | Feature |
| **No schedule sharing** | Low | Planned | Schedules are per-user only | Add sharing/collaboration | Feature |

---

## 10. Future Enhancements

- [ ] Workout logging UI (track sets, reps, weight performed vs. planned)
- [ ] Schedule templates (save and reuse named schedules)
- [ ] Exercise auto-suggestions based on muscle group
- [ ] Rest day indicators and recommendations
- [ ] Schedule sharing and collaboration
- [ ] Mobile-friendly touch-friendly drag-drop
- [ ] AI-suggested workouts based on fitness level
- [ ] Progressive overload tracking (increase weight over time)
- [ ] Schedule versioning and history
- [ ] Export schedules (PDF, CSV, calendar integration)

---

## 11. Appendix: Code Generation Notes

### For AI Code Generators

When generating code based on this spec:

**Component Generation**:
1. Use CDK drag-drop for drag functionality
2. Implement drop() handler with moveItemInArray/copyArrayItem
3. Track arrays by MuscleGroup enum value
4. Subscribe to ScheduleService and handle date formatting
5. Add Material components for buttons and inputs
6. Use async pipe for observables in template

**Date Handling**:
1. Use DateOnly for backend (not DateTime)
2. Format dates as "YYYY-MM-DD" using `toLocaleDateString('en-CA')`
3. Calculate Monday by adjusting current date's day-of-week
4. Pass date strings to API (not Date objects)

**Service Generation**:
1. Accept DateOnly string parameter (YYYY-MM-DD format)
2. Return WeeklySchedule DTO with 7 day properties
3. POST endpoint accepts full WeeklySchedule
4. Handle 7-day aggregation/disaggregation

---

*Last reviewed: January 15, 2024 | Spec version: 1.0.0 | Status: In Progress*
