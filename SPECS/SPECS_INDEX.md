# GamifyWorkout Spec Index

> This index maps the current GamifyWorkout feature specs, shared infrastructure docs, and architecture decisions. Use it to navigate the spec library and understand feature dependencies.

## Spec Catalog

| Spec File | Title | Status | Coverage | Primary Dependencies |
|---|---|---|---|---|
| `CONSTITUTION.md` | Project Constitution | Completed | Vision, inviolable rules, architecture principles, workflow, known tech debt | All specs |
| `SPEC_TEMPLATE.md` | Specification Template | Completed | Defines spec structure and content expectations | None |
| `SPEC_GUIDE.md` | Specification Guide | Completed | How to read, write, and extend specs | `SPEC_TEMPLATE.md` |
| `gym-management.spec.md` | Gym Management | Completed | Gyms, equipment assignment, gym/equipment APIs | `shared-services.spec.md`, `authentication.spec.md` |
| `weekly-schedule.spec.md` | Weekly Schedule | Completed | Workout calendar, drag/drop scheduling, schedule APIs | `shared-services.spec.md`, `authentication.spec.md` |
| `rpg-gamification.spec.md` | RPG Gamification | Completed | Player XP, leveling, NgRx state | `authentication.spec.md`, `weekly-schedule.spec.md` |
| `authentication.spec.md` | Authentication | Completed | Azure OAuth, JWT claims, route protection | `shared-services.spec.md` |
| `shared-services.spec.md` | Shared Services | Completed | Repository, AutoMapper, storage, OpenAPI client | `SPEC_TEMPLATE.md`, `SPEC_GUIDE.md` |
| `ARCHITECTURE_DECISIONS.md` | Architecture Decisions | Completed | Rationale for major architecture and design choices | `SPEC_GUIDE.md`, `shared-services.spec.md` |
| `today-schedule.spec.md` | Today's Schedule | In Progress | Exercises listed for today, navigation menu item | `shared-services.spec.md`, `authentication.spec.md`, `weekly-schedule.spec.md` |

## How to Use This Index

1. Start with `SPEC_GUIDE.md` to understand the spec conventions.
2. Use `SPECS_INDEX.md` to find the spec most relevant to the feature you are working on.
3. Open the feature spec and follow the structured sections: Overview, Models, API Contracts, Components, Business Logic, Examples, Known Issues.
4. When adding a new feature, also update this index with the new spec file and dependency links.

## Spec Status Summary

- Completed specs: `SPEC_TEMPLATE.md`, `SPEC_GUIDE.md`, `gym-management.spec.md`, `weekly-schedule.spec.md`, `rpg-gamification.spec.md`, `authentication.spec.md`, `shared-services.spec.md`, `ARCHITECTURE_DECISIONS.md`
- Remaining work: keep this index synchronized when new specs are added.

## Dependency Map

- `SPEC_TEMPLATE.md` → foundational format used by all specs
- `SPEC_GUIDE.md` → uses the template and explains how to read/write specs
- `shared-services.spec.md` → foundation for backend data access, mapping, storage, and frontend API generation
- `authentication.spec.md` → foundational security pattern for feature APIs and route protection
- `gym-management.spec.md` → depends on shared infrastructure and auth for user-specific gym data
- `weekly-schedule.spec.md` → depends on shared infrastructure and auth for schedule persistence
- `rpg-gamification.spec.md` → depends on auth for player identity and schedule data for experience logic
- `today-schedule.spec.md` → depends on shared infrastructure and auth for exercise data

## New Spec Guidance

When adding a new spec, include:

- A `Metadata` section with ID, title, status, links, and last updated date
- An `Overview` section that explains why the feature exists and what it does
- A `Data Models` section for both frontend and backend models
- An `API Contracts` section that documents all endpoints and payloads
- A `Components & Services` section listing the main integration points
- A `Business Logic` section with workflow, validation, and edge cases
- A `Related Files` section with the actual implementation references
- A `Known Issues` section for TODOs and bugs

## Navigation Quick Links

- [CONSTITUTION.md](./CONSTITUTION.md)
- [SPEC_TEMPLATE.md](./SPEC_TEMPLATE.md)
- [SPEC_GUIDE.md](./SPEC_GUIDE.md)
- [gym-management.spec.md](./gym-management.spec.md)
- [weekly-schedule.spec.md](./weekly-schedule.spec.md)
- [rpg-gamification.spec.md](./rpg-gamification.spec.md)
- [authentication.spec.md](./authentication.spec.md)
- [shared-services.spec.md](./shared-services.spec.md)
- [ARCHITECTURE_DECISIONS.md](./ARCHITECTURE_DECISIONS.md)
- [today-schedule.spec.md](./today-schedule.spec.md)
