# GamifyWorkout Specification Guide

> **Quick Start**: Read this guide to understand how to use specs for code generation and feature development.

## Table of Contents

1. [What Are Specs?](#what-are-specs)
2. [How to Read a Spec](#how-to-read-a-spec)
3. [Project Structure & Naming Conventions](#project-structure--naming-conventions)
4. [Common Patterns in GamifyWorkout](#common-patterns-in-gamifyworkout)
5. [Using Specs for Code Generation](#using-specs-for-code-generation)
6. [Spec Dependencies & Integration](#spec-dependencies--integration)
7. [Creating New Specs](#creating-new-specs)
8. [Extending Existing Specs](#extending-existing-specs)
9. [Troubleshooting & FAQ](#troubleshooting--faq)

---

## What Are Specs?

Specs are **machine-readable and human-readable specifications** that document:

- **What** the feature does (purpose, responsibilities)
- **How** it integrates with other parts of the system (dependencies, data flow)
- **What** data structures it uses (TypeScript types, C# entities)
- **What** API contracts it exposes (endpoints, request/response formats)
- **How** components and services behave (methods, lifecycle, error handling)
- **What** business logic rules apply (validation, workflows, error scenarios)

**Key Benefit**: Specs enable AI systems (GitHub Copilot, Code Generators) to understand the codebase patterns and reliably generate code that fits the existing architecture.

---

## How to Read a Spec

Each spec follows the [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md) structure:

| Section | What to Look For | When to Use |
|---------|---|---|
| **Metadata** | Status, dependencies, file locations | Understanding what's been implemented |
| **Overview** | Feature purpose, responsibilities, integration points | Getting oriented on the feature |
| **Data Models** | TypeScript interfaces, C# entities, relationships | Building new components/services |
| **API Contracts** | Endpoints, request/response format, status codes | Calling APIs from components or extending backend |
| **Components & Services** | Class methods, inputs/outputs, error handling | Implementing frontend features |
| **Business Logic** | Workflows, data flow, error scenarios | Understanding complex feature behavior |
| **Examples** | Real code showing how to use the feature | Copy-paste templates for common patterns |
| **Related Files** | Link to actual implementation | Reference when uncertain about patterns |
| **Known Issues** | TODOs and bugs | Avoiding known pitfalls |

**Example Reading Path**:
- Need to create a new component for Gym management?
  1. Read Overview → Understand what gyms are
  2. Read Data Models → Learn the Gym structure
  3. Read Component Specs → See existing components
  4. Read Examples → Copy-paste Angular patterns
  5. Read Related Files → Reference actual component code

---

## Project Structure & Naming Conventions

### Frontend File Organization

```
projects/gamifyworkout/src/app/
├── api/                          # Auto-generated from OpenAPI
│   ├── models/                   # *-models.ts or single type file
│   │   └── *.ts                  # Naming: PascalCase (e.g., Gym.ts, Equipment.ts)
│   └── services/                 # *-service.ts
│       └── *.service.ts          # Naming: kebab-case in filename, PascalCase class
│
├── core/                         # Core infrastructure
│   ├── auth/                     # Authentication-related
│   │   ├── api-auth.service.ts
│   │   └── auth.guard.ts
│   └── collections/
│
├── features/                     # Feature-specific logic
│   └── rpg/                      # Feature folder (kebab-case)
│       ├── model/
│       ├── store/                # NgRx state
│       │   ├── *-actions.ts
│       │   └── *-reducer.ts
│       └── component/
│
├── modules/                      # Lazy-loaded route modules
│   ├── inventory/                # Module folder (kebab-case)
│   │   ├── pages/                # Full-page components
│   │   │   └── gym.component.ts  # Naming: feature.component.ts
│   │   ├── components/           # Reusable child components
│   │   └── dialogs/              # Material dialogs
│   └── schedule/
│
├── shared/                       # Shared across modules
│   ├── components/
│   └── services/
│
└── app.routes.ts                 # Main routing configuration
```

### Backend File Organization

```
api/
├── Api/                          # ASP.NET Core Web API
│   ├── Controllers/              # *Controller.cs
│   │   └── GymController.cs      # Naming: PascalCase, plural resource names
│   ├── Services/                 # I*Service.cs, *Service.cs
│   │   └── GymService.cs
│   ├── Extensions/
│   └── Module/                   # Service registration modules
│
├── Core/                         # Domain models & business logic
│   ├── Models/                   # *.cs (entity classes)
│   │   └── Gym.cs
│   └── Services/                 # I*Service.cs, *Service.cs
│
└── Database/                     # Data persistence
    ├── EntityFramework/
    │   └── EfDbContext.cs
    └── Services/
        └── Repository.cs         # Generic CRUD repository
```

### TypeScript Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Interfaces | PascalCase | `Gym`, `CreateGymRequest`, `GymResponse` |
| Types | PascalCase | `GymStatus`, `Equipment` |
| Enums | PascalCase, singular | `MuscleGroup`, `EquipmentType` |
| Functions | camelCase | `loadGyms()`, `createGym()` |
| Variables | camelCase | `selectedGym`, `isLoading` |
| Classes | PascalCase | `GymService`, `ManageGymComponent` |
| Selectors | camelCase, prefix with `select` | `selectGyms`, `selectLoading` |
| Actions | camelCase, prefix with verb + module | `loadGyms`, `createGymSuccess` |
| Files | kebab-case | `gym.service.ts`, `manage-gym.component.ts` |

### C# Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Classes | PascalCase | `Gym`, `GymService`, `GymController` |
| Interfaces | PascalCase, prefix with I | `IGymService`, `IMapper` |
| Properties | PascalCase | `Name`, `UserId`, `CreatedAt` |
| Methods | PascalCase | `GetGym()`, `CreateGym()` |
| DTOs | PascalCase, suffix with Dto | `GymDto`, `CreateGymDto` |
| Enums | PascalCase, singular | `MuscleGroup`, `EquipmentType` |
| Private fields | camelCase, prefix with underscore | `_gymService`, `_dbContext` |
| Constants | UPPER_SNAKE_CASE | `DEFAULT_PAGE_SIZE`, `MAX_GYM_NAME_LENGTH` |
| Files | PascalCase | `Gym.cs`, `GymController.cs` |

---

## Common Patterns in GamifyWorkout

### 1. API Service Pattern (Frontend)

Auto-generated from OpenAPI spec. Example:

```typescript
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GymService extends BaseService {
  constructor(http: HttpClient, config: ApiConfiguration) {
    super(http, config);
  }

  /**
   * Get all gyms (supports OData queries)
   */
  getGyms(params?: any): Observable<{ value: Gym[]; 'odata.count': number }> {
    return this.http.get<any>('/api/gym', { params });
  }

  /**
   * Create a new gym
   */
  createGym(request: CreateGymRequest): Observable<Gym> {
    return this.http.post<Gym>('/api/gym', request);
  }
}
```

**Key Points**:
- Inherit from `BaseService` for shared configuration
- Use `@Injectable({ providedIn: 'root' })` for tree-shakable services
- Return `Observable` types (not Promises)
- Document with JSDoc comments
- Use typed responses (`Observable<Gym[]>` not `Observable<any>`)

### 2. NgRx Store Pattern

Example structure for feature state:

```typescript
// actions.ts
export const loadGyms = createAction('[Gym] Load Gyms');
export const loadGymsSuccess = createAction(
  '[Gym] Load Gyms Success',
  props<{ gyms: Gym[] }>()
);

// reducer.ts
export interface GymState {
  gyms: Gym[];
  loading: boolean;
  error: string | null;
}

// effects.ts
@Injectable()
export class GymEffects {
  loadGyms$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GymActions.loadGyms),
      switchMap(() =>
        this.gymService.getGyms().pipe(
          map(response => GymActions.loadGymsSuccess({ gyms: response.value })),
          catchError(error => of(GymActions.loadGymsError({ error: error.message })))
        )
      )
    )
  );
}
```

**Key Points**:
- Actions are namespaced by feature: `[Feature] Action Name`
- Use `props<{ data }>()` for action payloads
- Effects transform actions to side effects (API calls)
- Use `switchMap` for sequential operations, `mergeMap` for parallel
- Always provide error handlers with `catchError`

### 3. Angular Component Pattern

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-manage-gym',
  standalone: true,
  imports: [CommonModule, MatTableModule],
  templateUrl: './manage-gym.component.html',
  styleUrls: ['./manage-gym.component.scss']
})
export class ManageGymComponent implements OnInit, OnDestroy {
  gyms$: Observable<Gym[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  constructor(private store: Store) {
    this.gyms$ = this.store.select(selectGyms);
    this.loading$ = this.store.select(selectLoading);
    this.error$ = this.store.select(selectError);
  }

  ngOnInit() {
    this.store.dispatch(loadGyms());
  }

  ngOnDestroy() {
    // RxJS subscriptions via async pipe auto-unsubscribe
  }

  onDeleteGym(gymId: string) {
    this.store.dispatch(deleteGym({ gymId }));
  }
}
```

**Key Points**:
- Use standalone components (`standalone: true`)
- Use `async` pipe in template to auto-subscribe/unsubscribe
- Dispatch actions in lifecycle hooks (ngOnInit)
- Avoid manual subscriptions (use async pipe instead)
- Define outputs as `Observable<T>` not `Subject<T>` (one-way data flow)

### 4. ASP.NET Core Controller Pattern

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class GymController : ControllerBase
{
    private readonly IGymService _gymService;
    private readonly ILogger<GymController> _logger;

    public GymController(IGymService gymService, ILogger<GymController> logger)
    {
        _gymService = gymService;
        _logger = logger;
    }

    [HttpGet]
    [EnableQuery]  // For OData support
    public async Task<ActionResult<IEnumerable<GymDto>>> GetGyms()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var gyms = await _gymService.GetGymsByUserIdAsync(userId);
            return Ok(gyms);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting gyms");
            return StatusCode(500, new { error = "Internal server error" });
        }
    }

    [HttpPost]
    public async Task<ActionResult<GymDto>> CreateGym([FromBody] CreateGymDto request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var gym = await _gymService.CreateGymAsync(userId, request);
            return CreatedAtAction(nameof(GetGyms), new { id = gym.Id }, gym);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }
}
```

**Key Points**:
- Use `[Authorize]` attribute for JWT protection
- Extract userId from JWT claims using `User.FindFirst(ClaimTypes.NameIdentifier)`
- Use `async/await` for database operations
- Return appropriate HTTP status codes (200, 201, 400, 404, 500)
- Use `[EnableQuery]` for OData support on GET endpoints
- Log errors with ILogger
- Map domain models to DTOs before returning
- Use `ActionResult<T>` for better type safety

### 5. EntityFramework DbContext Pattern

```csharp
public class EfDbContext : DbContext
{
    public DbSet<Gym> Gyms { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<User> Users { get; set; }

    public EfDbContext(DbContextOptions<EfDbContext> options) 
        : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure relationships
        modelBuilder.Entity<Gym>()
            .HasOne(g => g.User)
            .WithMany(u => u.Gyms)
            .HasForeignKey(g => g.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Seed data
        modelBuilder.Entity<Equipment>().HasData(
            new Equipment { Id = Guid.NewGuid(), Name = "Dumbbells" },
            new Equipment { Id = Guid.NewGuid(), Name = "Bench" }
        );
    }
}
```

**Key Points**:
- Define `DbSet<T>` properties for each entity
- Configure relationships in `OnModelCreating`
- Use `HasOne().WithMany()` for 1:N relationships
- Set cascade delete behavior for dependent entities
- Seed data in `OnModelCreating` for development/testing

### 6. Repository Pattern (Generic CRUD)

```csharp
public interface IRepository<T> where T : BaseEntity
{
    Task<T> GetByIdAsync(Guid id);
    Task<IEnumerable<T>> GetAllAsync();
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(Guid id);
}

public class Repository<T> : IRepository<T> where T : BaseEntity
{
    private readonly EfDbContext _context;
    private readonly DbSet<T> _dbSet;

    public Repository(EfDbContext context)
    {
        _context = context;
        _dbSet = context.Set<T>();
    }

    public async Task<T> GetByIdAsync(Guid id) 
        => await _dbSet.FindAsync(id);

    public async Task<IEnumerable<T>> GetAllAsync() 
        => await _dbSet.ToListAsync();

    public async Task<T> AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
        await _context.SaveChangesAsync();
        return entity;
    }
}
```

**Key Points**:
- Use generic `Repository<T>` for DRY CRUD operations
- Inject `DbContext` to access any entity type
- Implement `IRepository<T>` interface for testability
- Use `async/await` for database operations
- Return entities with `await _context.SaveChangesAsync()`

---

## Using Specs for Code Generation

### Step 1: Select the Relevant Spec

Find the spec that covers the feature you're building:
- [gym-management.spec.md](./gym-management.spec.md) — For gym/equipment features
- [weekly-schedule.spec.md](./weekly-schedule.spec.md) — For workout scheduling
- [rpg-gamification.spec.md](./rpg-gamification.spec.md) — For player/experience features
- [authentication.spec.md](./authentication.spec.md) — For OAuth/JWT setup
- [shared-services.spec.md](./shared-services.spec.md) — For shared utilities

### Step 2: Extract Relevant Sections

From the spec, copy:
1. **Data Models** section (TypeScript or C# code)
2. **API Contract** or **Component Spec** (depending on what you're building)
3. **Examples** section (shows usage patterns)

### Step 3: Prompt AI to Generate Code

**Example Prompt to Copilot**:

> I want to create a new Angular component for managing workouts. Here's the spec:
> 
> [Paste the "WorkoutLog Component Spec" section from weekly-schedule.spec.md]
> 
> Please generate the component code following these patterns from the GamifyWorkout project:
> - Use standalone components
> - Use NgRx store for state management
> - Follow the naming conventions in SPEC_GUIDE.md
> - Include error handling for API failures

### Step 4: Review & Adapt

The generated code should:
- [ ] Match the data models from the spec exactly
- [ ] Follow project naming conventions (file names, class names, selectors)
- [ ] Use RxJS Observables (not Promises)
- [ ] Include error handling similar to examples
- [ ] Reference the correct import paths
- [ ] Use Material components for UI

If any section doesn't match the spec, provide feedback to the AI with:
> "The selectWorkouts selector doesn't exist. Based on the spec, it should return Observable<WorkoutLog[]> from the store."

---

## Spec Dependencies & Integration

### Dependency Tree

```
Authentication
    ↓
(protects all endpoints)
    ↓
├── Gym Management
├── Weekly Schedule
│   └── Depends on: Gym (to associate with user)
└── RPG Gamification
    └── Depends on: Weekly Schedule (triggered by workout completion)
```

### Integration Points

| Feature A | Feature B | How They Connect |
|-----------|-----------|---|
| Gym Management | Weekly Schedule | Schedules belong to user gyms |
| Weekly Schedule | RPG Gamification | Workout completion → XP reward |
| Authentication | All Features | JWT token validates user identity |
| API Services | NgRx Store | Services fetch data, store persists state |

### When to Create New Specs

Create a new spec when:
- Adding a major new feature (e.g., "Workout History", "Social Features")
- A feature is complex enough to warrant documentation (multiple components/services)
- Multiple developers need to understand the feature
- The feature will be extended in the future

**Don't** create specs for:
- Simple utility functions (use code comments instead)
- One-off components unlikely to be reused
- Trivial CRUD operations (just follow the existing pattern)

---

## Creating New Specs

### Template for New Specs

1. Copy [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md)
2. Name it `feature-name.spec.md` (kebab-case)
3. Fill in each section using the template guidance
4. Link it in [SPECS_INDEX.md](./SPECS_INDEX.md)
5. Update [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md) if needed

### Spec Checklist

- [ ] Metadata section completed (status, related specs, file locations)
- [ ] Overview clearly explains what the feature does
- [ ] Data models include both TypeScript and C# versions
- [ ] All relationships documented in relationship table
- [ ] Validation rules specified for each field
- [ ] All endpoints documented with examples
- [ ] Error responses included for each error scenario
- [ ] Components/Services section includes all methods
- [ ] NgRx state structure defined (if applicable)
- [ ] Business logic workflows documented
- [ ] At least 2-3 code examples provided
- [ ] Related files linked to actual implementation
- [ ] Known issues and TODOs documented
- [ ] Code generation notes provided in Appendix

---

## Extending Existing Specs

### Adding a New Endpoint to a Spec

1. Open the relevant spec file
2. Go to the "API Contracts" section → "Endpoints" subsection
3. Add a new endpoint following the pattern:
   ```
   #### X.Y Endpoint Name
   
   GET /api/resource/{id}
   
   ... (follow template format)
   ```
4. Update the "Validation Rules" table if new fields were added
5. Add error scenarios to the "Error Scenarios" table if applicable

### Adding a New Component to a Spec

1. Go to the "Components & Services" section
2. Add subsection for new component:
   ```
   #### NewComponentName
   
   **Purpose**: ...
   **Selector**: `app-new-component`
   **Inputs**: ...
   ```
3. Link to the related files where component is implemented

### Marking a TODO as Complete

1. Find the "Known Issues & TODOs" table
2. Change Status from "Open" to "Complete"
3. Add brief note about what was done (e.g., "Fixed in commit abc123")
4. Update the "Last Updated" date in Metadata section

---

## 10. Spec Authoring Workflow

### Creating a New Spec

1. **Start with the Template**: Copy `SPEC_TEMPLATE.md` to create your new spec file (e.g., `new-feature.spec.md`).

2. **Fill Metadata**: Update the Metadata table with:
   - Unique spec ID (kebab-case, e.g., `user-profile`)
   - Title and status
   - Current date and version 1.0.0
   - Related specs (dependencies)
   - Implementation paths

3. **Analyze Codebase**: Read the actual implementation files to extract:
   - Data models (TypeScript interfaces, C# entities)
   - API endpoints and contracts
   - Component/service methods and patterns
   - Business logic workflows
   - Error handling and edge cases

4. **Document Sections**: Follow the template structure:
   - Overview: Purpose and responsibilities
   - Data Models: Frontend and backend types
   - API Contracts: Endpoints, requests, responses
   - Components & Services: Integration points
   - Business Logic: Workflows and validation
   - Examples: Code snippets for common patterns
   - Related Files: Links to implementation
   - Known Issues: TODOs and bugs

5. **Update Index**: Add the new spec to `SPECS_INDEX.md`:
   - Update the spec catalog table
   - Add dependency relationships
   - Include quick navigation link

6. **Update Architecture Decisions**: If the new feature introduces new patterns or decisions, document them in `ARCHITECTURE_DECISIONS.md`.

### Extending Existing Specs

When modifying an existing feature:

1. Update the spec file with new sections or changes
2. Increment the version number in Metadata
3. Update the Last Updated date
4. If dependencies change, update `SPECS_INDEX.md`
5. Add new known issues or remove resolved ones

### Validation Checklist

Before committing a new spec:
- [ ] Metadata is complete and accurate
- [ ] All code examples compile and match actual implementation
- [ ] File paths in Related Files section exist and are correct
- [ ] Dependencies in SPECS_INDEX.md are accurate
- [ ] No sensitive information (keys, secrets) is included
- [ ] Spec follows the naming and structure conventions

---

## Troubleshooting & FAQ

### Q: I'm generating code but it doesn't match the existing architecture. What should I do?

**A**: 
1. Check the spec's "Related Files & References" section
2. Open the referenced actual implementation
3. Provide the AI with the actual code as an example:
   > "Here's how GymService is currently implemented in gym.service.ts. Please generate the new EquipmentService following the same pattern."

### Q: The spec has a TODO marked "In Progress". Can I start building it?

**A**: 
1. Check if the core data model/endpoint is complete (backend usually needed first)
2. If the spec Status is "Completed", proceed normally
3. If Status is "In Progress", coordinate with the team or the person who started the feature

### Q: How do I know if I need to update a spec after making code changes?

**A**: Update the spec if you:
- Add a new endpoint or component
- Change an existing endpoint's request/response format
- Modify data model structure (add/remove fields)
- Discover a new error scenario
- Complete a TODO

**Don't** update the spec for:
- Internal refactoring (same external contract)
- Bug fixes (same functionality)
- Performance improvements (same behavior)

### Q: Can I have my own local copy of a spec while developing?

**A**: 
1. Yes, create a branch-specific copy: `feature-name-wip.spec.md`
2. Document your changes in the WIP spec
3. Once feature is ready, merge back to main spec
4. Delete the WIP spec

### Q: The spec mentions a feature not yet implemented. Should I build it?

**A**: 
1. If it's marked "Completed" → It should exist in code (check related files)
2. If marked "In Progress" → Ask the team before starting
3. If marked "Planned" → OK to start, but update status to "In Progress" in spec

### Q: How do I contribute improvements to specs?

**A**: 
1. Create a new branch: `docs/improve-spec-name`
2. Update the spec in `SPECS/` folder
3. Submit a PR with clear description of changes
4. Other developers can review and suggest improvements

### Q: Should error responses be consistent across all specs?

**A**: 
**Yes.** All error responses should follow this pattern:

```json
{
  "error": "Human-readable error message"
}
```

Or for validation errors:

```json
{
  "errors": {
    "fieldName": ["Error message for this field"]
  }
}
```

Reference [authentication.spec.md](./authentication.spec.md) for more examples.

---

## Next Steps

1. **Read** the feature spec you need to build
2. **Reference** the "Related Files" to see actual implementation patterns
3. **Follow** the code generation guidelines in section "Using Specs for Code Generation"
4. **Check** the "Common Patterns" section if you're unsure about a pattern
5. **Update** the spec if you discover missing information

---

*For questions or improvements to this guide, please create an issue or PR in the repository.*
