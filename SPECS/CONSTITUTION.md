# GamifyWorkout Constitution

## Vision

GamifyWorkout transforms workout tracking into an RPG experience. Users log workouts, earn XP, and level up characters. This is a personal learning platform for Angular and .NET — prioritize clarity and correctness over clever abstractions.

---

## Inviolable Rules

### 1. Never edit `src/app/api/`
This directory is fully OpenAPI-generated. To update it, regenerate from the running backend:
```bash
npx ng-openapi-gen --input http://localhost:8080/swagger/v1/swagger.json --output projects/gamifyworkout/src/app/api --exclude-tags Metadata
```

### 2. Never delete or edit existing database migrations
Migrations are append-only. To change the schema, add a new migration — never modify or remove an existing one.

### 3. Never run the backend outside the VS Code task
Use the **"Run Backend API"** VS Code task to start it and **"Stop Backend API"** to shut it down. Do not start the API in a hidden or shared terminal to avoid orphaned processes.

### 4. Every feature needs a spec
Before implementing anything new, check `SPECS/SPECS_INDEX.md`. If no spec exists, create one using `SPECS/SPEC_TEMPLATE.md` before writing any code.

### 5. Always edit files in the main repo path (For Claude only)
Edit at `projects/gamifyworkout/` in the main checkout — never inside a `.claude/worktrees/` path. Changes in worktrees are not visible in the running dev server.

---

## Architecture Principles

### Frontend (Angular 21)

**Change detection**
- Zoneless change detection via `provideZonelessChangeDetection()` — do not use `zone.js` or `provideExperimentalZonelessChangeDetection()`
- Do not set `ChangeDetectionStrategy.OnPush` — it is redundant and misleading under zoneless; signal writes and async pipe drive updates automatically
- Do not call `markForCheck()`, `detectChanges()`, or inject `ChangeDetectorRef` — these are incompatible with zoneless

**Signals (primary reactivity primitive)**
- Component state: `signal()`, `computed()`, `effect()` — not `BehaviorSubject` or class fields mutated directly
- Two-way binding: `model()` — not `[(ngModel)]` backed by a plain property
- Template queries: `viewChild()`, `viewChildren()`, `contentChild()`, `contentChildren()` — not `@ViewChild` / `@ContentChild` decorators
- Async data: `resource()` or `rxResource()` for HTTP/async — not manual subscribe/unsubscribe in components

**Component conventions**
- Standalone components only — `standalone: true` is the default, do not set it explicitly
- `input()` / `output()` signal functions — not `@Input()` / `@Output()` decorators
- `inject()` for dependency injection — not constructor injection
- Native control flow (`@if`, `@for`, `@switch`, `@defer`) — never `*ngIf`, `*ngFor`, or `NgIf`/`NgFor` imports
- No `ngClass` or `ngStyle` — use `[class.foo]` and `[style.prop]` bindings
- SCSS for all styles, `.html` and `.scss` files adjacent to `.ts` with the same base name

**UI and routing**
- Angular Material for all UI (dialogs, tables, forms, drag/drop)
- New routes must be lazy-loaded; use `withComponentInputBinding()` to bind route params to signal inputs
- Path aliases: `@app/*` → `src/app/*`, `@features/*` → `src/app/features/*`

### Backend (.NET 9)

- Thin controllers that call `Repository` directly — no intermediate service layer
- All domain models extend `BaseEntity` (in `api/Core/Models/`)
- All DI registration belongs in `api/Api/Extensions/ServiceCollectionExtensions.cs`
- EF Core repository is synchronous (`SaveChanges()`) — this is known tech debt; do not introduce async patterns without a spec
- AutoMapper is wrapped via `IMappingService` — do not use `IMapper` directly
- OData is enabled on list endpoints — support `$filter`, `$orderby`, `$top`, `$skip`
- Guid IDs for all entities (cross-system compatibility)

### State Management

- NgRx manages RPG player state in `src/app/features/rpg/store/` (`PlayerState`: hp, maxHp, mp, maxMp, experience, level)
- Do not add NgRx for local component state — use Angular signals instead
- The hydration meta-reducer is currently commented out; do not re-enable it without a spec

### Authentication

- Azure AD OAuth + JWT via `AuthenticationService` from `fullswing-angular-library`
- All protected routes must use `AuthGuard`
- Backend controllers must filter data by the current user's claims — never return all users' data

---

## Development Workflow

### Implementing a Feature

1. Check `SPECS/SPECS_INDEX.md` for an existing spec
2. If the spec status is "In Progress" or "Design", read it fully before writing any code
3. Implement frontend and backend together — don't leave one side incomplete
4. If backend API contracts changed, regenerate the OpenAPI client before writing frontend code
5. Write behavioral tests after implementation (see Testing below)

### Adding a New API Endpoint

1. Add the endpoint to the appropriate backend controller
2. Start or restart the backend via the VS Code task
3. Regenerate the OpenAPI client (`ng-openapi-gen`)
4. Use the generated Angular service — never write manual HTTP calls for backend endpoints

### Adding a New Angular Component

- Place `.html`, `.scss`, and `.ts` with the same base name in the same folder
- Add the component to the relevant module under `src/app/modules/` or feature under `src/app/features/`
- New routes must be lazy-loaded

### Adding a New Spec

Follow `SPECS/SPEC_GUIDE.md`. Include: Metadata, Overview, Data Models, API Contracts, Components & Services, Business Logic, Related Files, Known Issues. Update `SPECS_INDEX.md`.

---

## Testing

- Tests verify observable behavior: what the component renders, what actions are dispatched, what outputs are emitted
- Do not test private methods, internal state, or implementation details
- Import `TestProvider` from `src/app/test-provider.ts` for standard DI setup in component tests
- Spec files live adjacent to their source files
- Run all tests: `ng test gamifyworkout --watch=false`
- Run a single spec: `ng test gamifyworkout --include="**/my.component.spec.ts" --watch=false`

---

## Known Technical Debt

Do not attempt to fix these without an explicit spec and explicit user approval:

| Area | Debt | Risk if Changed Carelessly |
|---|---|---|
| Repository | Synchronous EF (`SaveChanges`) — no async methods | Introducing `async` breaks the entire call chain |
| AutoMapper | No explicit mapping profiles registered at startup | New mappings may fail silently at runtime |
| Azure Blob | Uses legacy SDK (`CloudBlobContainer`) | Deprecated API, but changing breaks existing storage |
| Controllers | User filtering not enforced on all endpoints | Data leakage if adding new multi-user features |
| OpenAPI client | No automated regeneration in CI | Frontend/backend contract drift after backend changes |
| NgRx Hydration | Meta-reducer commented out | State is not persisted across page refreshes |
| CORS | Configured for local dev only | Must be updated before any production deployment |

---

## Deployment

| Target | Command | Notes |
|---|---|---|
| Frontend (Azure Static Web Apps) | `npm run deploy` from workspace root | Requires Azure CLI login |
| Local frontend | `ng serve gamifyworkout` | SSL via prestart script — https://localhost:4200 |
| Local backend | VS Code "Run Backend API" task | Swagger at https://localhost:8080 |

---

## Key File Reference

| What | Path |
|---|---|
| This constitution | `SPECS/CONSTITUTION.md` |
| Spec index | `SPECS/SPECS_INDEX.md` |
| Architecture decisions | `SPECS/ARCHITECTURE_DECISIONS.md` |
| Spec template | `SPECS/SPEC_TEMPLATE.md` |
| Angular components | `src/app/modules/`, `src/app/features/` |
| OpenAPI client (**DO NOT EDIT**) | `src/app/api/` |
| Domain models | `api/Core/Models/` |
| Repository contract | `api/Core/Database/Repository.cs` |
| EF implementation | `api/Database/Services/EfRepository.cs` |
| DI registration | `api/Api/Extensions/ServiceCollectionExtensions.cs` |
| NgRx store | `src/app/features/rpg/store/` |
| Test provider | `src/app/test-provider.ts` |
| Angular path aliases | `tsconfig.app.json` |
