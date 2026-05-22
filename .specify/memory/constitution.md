<!--
SYNC IMPACT REPORT
Version change: (template placeholders) → 1.0.0
Modified principles: N/A — initial fill from SPECS/CONSTITUTION.md
Added sections: Core Principles (I–V), Inviolable Rules, Development Workflow & Testing, Governance
Removed sections: All placeholder bracket tokens replaced
Templates requiring updates:
  ✅ .specify/templates/plan-template.md — Constitution Check section is generic and remains correct
  ✅ .specify/templates/spec-template.md — no changes needed; template is project-agnostic
  ✅ .specify/templates/tasks-template.md — no changes needed; template is project-agnostic
  ✅ No commands/ directory present — skip
Follow-up TODOs: None — all placeholders resolved
-->

# GamifyWorkout Constitution

## Core Principles

### I. OpenAPI Client Immutability

The directory `src/app/api/` is 100% OpenAPI-generated and MUST NOT be manually edited. All
backend API changes MUST be followed by regeneration via `ng-openapi-gen`. Database migrations
are append-only — new migrations are added; existing ones are NEVER modified or deleted.

**Rationale**: Manual edits to generated code are overwritten on the next regeneration and
introduce contract drift. Migration immutability prevents data loss and schema inconsistency.

### II. Modern Angular Signals — No Zone.js

All components MUST use zoneless change detection (`provideZonelessChangeDetection()`). Component
state MUST use `signal()`, `computed()`, and `effect()` — not `BehaviorSubject` or mutable class
fields. Two-way binding uses `model()`. Async data uses `resource()` or `rxResource()`.
`ChangeDetectionStrategy.OnPush`, `ChangeDetectorRef`, `markForCheck()`, and `detectChanges()`
are FORBIDDEN under zoneless.

Additional component rules (non-negotiable):
- `input()` / `output()` signal functions — not `@Input()` / `@Output()` decorators
- `inject()` for dependency injection — not constructor injection
- Native control flow (`@if`, `@for`, `@switch`, `@defer`) — never `*ngIf`, `*ngFor`
- No `ngClass` or `ngStyle` — use `[class.foo]` and `[style.prop]` bindings
- SCSS for all styles; `.html` and `.scss` live adjacent to `.ts` with the same base name

**Rationale**: Zoneless + signals is the Angular 21 correctness baseline. Mixing zone-based
patterns with zoneless detection produces unpredictable update behavior and defeats the model.

### III. Spec-First Development

Every new feature MUST have a spec in `SPECS/` before any code is written. `SPECS/SPECS_INDEX.md`
is the authority on what is in scope. Specs MUST include: Metadata, Overview, Data Models, API
Contracts, Components & Services, Business Logic, Related Files, and Known Issues. Add new entries
to `SPECS_INDEX.md` when adding a new spec.

**Rationale**: Specs prevent scope creep, document intent for AI and human contributors, and
provide a testable contract before implementation begins on this personal learning platform.

### IV. Thin Backend Layer

Controllers MUST be thin — they call `Repository` directly with no intermediate service layer. All
domain models MUST extend `BaseEntity`. All DI registration belongs in
`ServiceCollectionExtensions.cs`. AutoMapper MUST be accessed via `IMappingService`, never
`IMapper` directly. OData MUST be enabled on list endpoints (`$filter`, `$orderby`, `$top`,
`$skip`). The EF repository is synchronous (`SaveChanges()`) — async patterns MUST NOT be
introduced without an explicit spec.

**Rationale**: Consistency across the backend prevents a fragmented codebase. Adding service
layers or async patterns piecemeal makes the codebase harder to reason about and test uniformly.

### V. Auth-Guarded User Scoping

All protected routes MUST use `AuthGuard`. Backend controllers MUST filter data by the current
user's claims — never return all users' data from an authenticated endpoint. Authentication is
provided by Azure AD OAuth + JWT via `AuthenticationService` from `fullswing-angular-library`.

**Rationale**: User data isolation is a non-negotiable security property. Even in a personal
learning app, returning cross-user data creates privacy violations and sets a dangerous precedent.

## Inviolable Rules

The following MUST NEVER be violated without an explicit spec, a documented rationale, and
explicit user approval:

1. **Never edit `src/app/api/`** — regenerate via `ng-openapi-gen` instead.
2. **Never modify or delete database migrations** — append new migrations only.
3. **Never start the backend outside the VS Code task** — use "Run Backend API" / "Stop Backend
   API" to prevent orphaned processes.
4. **Never implement a feature without a spec** — check `SPECS/SPECS_INDEX.md` first.
5. **Always edit files at the main repo path** (`projects/gamifyworkout/`) — never inside a
   `.claude/worktrees/` path (Claude Code only).

Known technical debt MUST NOT be resolved without a spec and explicit user approval:

| Area | Debt | Risk if Changed Carelessly |
|---|---|---|
| Repository | Synchronous EF (`SaveChanges`) — no async methods | Introducing `async` breaks the entire call chain |
| AutoMapper | No explicit mapping profiles registered at startup | New mappings may fail silently at runtime |
| Azure Blob | Uses legacy SDK (`CloudBlobContainer`) | Deprecated API; changing breaks existing storage |
| Controllers | User filtering not enforced on all endpoints | Data leakage if adding new multi-user features |
| OpenAPI client | No automated regeneration in CI | Frontend/backend contract drift after backend changes |
| NgRx Hydration | Meta-reducer commented out | State not persisted across page refreshes |
| CORS | Configured for local dev only | Must be updated before any production deployment |

## Development Workflow & Testing

### Feature Workflow

1. Check `SPECS/SPECS_INDEX.md` for an existing spec.
2. If a spec exists with status "In Progress" or "Design", read it fully before writing code.
3. Implement frontend and backend together — never leave one side incomplete.
4. If backend API contracts changed, regenerate the OpenAPI client before writing frontend code.
5. Write behavioral tests after implementation (see Testing Standards below).

### Backend Changes

When adding or changing an API endpoint:
1. Add/modify the endpoint in the appropriate backend controller.
2. Start or restart the backend via the VS Code "Run Backend API" task.
3. Regenerate the OpenAPI client (`npx ng-openapi-gen --input http://localhost:8080/swagger/v1/swagger.json --output projects/gamifyworkout/src/app/api --exclude-tags Metadata`).
4. Use the generated Angular service — never write manual HTTP calls for backend endpoints.

### State Management Rules

- NgRx MUST only manage RPG player state (`PlayerState` in `src/app/features/rpg/store/`).
- Angular signals MUST be used for local component state — not NgRx.
- The hydration meta-reducer is commented out — do not re-enable without a spec.

### Testing Standards

Tests MUST verify observable behavior: what the component renders, what actions are dispatched,
what outputs are emitted. Tests MUST NOT test private methods, internal state, or implementation
details.

- Import `TestProvider` from `src/app/test-provider.ts` for standard DI in component tests.
- Spec files live adjacent to their source files.
- Run all tests: `ng test gamifyworkout --watch=false`
- Run a single spec: `ng test gamifyworkout --include="**/my.component.spec.ts" --watch=false`

## Governance

This constitution supersedes all other project practices. Amendments require:
1. A documented rationale explaining why the change is necessary.
2. An update to this file with an incremented version number following the policy below.
3. A migration plan for any existing code that would violate the amended rule.

**Versioning Policy**:
- MAJOR: Backward-incompatible removal or redefinition of a principle.
- MINOR: New principle or section added, or materially expanded guidance.
- PATCH: Clarifications, wording fixes, or non-semantic refinements.

All PRs must verify compliance with these principles. Complexity MUST be justified — this is a
personal learning platform and clarity is preferred over cleverness (YAGNI applies).

Refer to `SPECS/CONSTITUTION.md` as the companion human-readable version of these rules.

**Version**: 1.0.0 | **Ratified**: 2026-05-06 | **Last Amended**: 2026-05-21
