# Architecture Decisions

## Metadata

| Property | Value |
|---|---|
| **Title** | GamifyWorkout Architecture Decisions |
| **Status** | Completed |
| **Last Updated** | 2026-05-06 |
| **Version** | 1.0.0 |
| **Related Specs** | `SPEC_GUIDE.md`, `shared-services.spec.md`, `authentication.spec.md` |

## Overview

This document records the core architectural decisions that shape GamifyWorkout.
It explains why the current frontend/backend patterns were chosen, their intended benefits, and where technical debt exists.

## 1. High-Level Architecture

### Frontend

- **Angular 21** as the single-page application framework.
- **Standalone components** for modular, tree-shakable UI and easier future migration.
- **NgRx Store** for global feature state, especially RPG progression and app-wide data hydration.
- **Angular Material** for consistent UI patterns across dialogs, tables, forms, and drag/drop.
- **OpenAPI-generated client** under `src/app/api/` to keep frontend service contracts synchronized with the backend.

### Backend

- **ASP.NET Core Web API** with **.NET 9** for a modern cloud-ready server.
- **Entity Framework Core** for data persistence and migrations.
- **OData** for rich query support on backend endpoints.
- **JWT / OAuth** authentication with Azure Entra ID for stateless security.
- **Azure Blob Storage** for file storage abstraction.

### Deployment & Infrastructure

- Local development uses `https://localhost:4200` for frontend and `https://localhost:8080` for backend Swagger.
- CORS is configured to allow the Angular dev origin.
- Database migrations are applied at startup via `context.Database.Migrate()`.
- Configuration is built from JSON files, user secrets, and environment variables.

## 2. Choice Rationale

### 2.1 Why Angular + Standalone Components?

- Supports modern Angular best practices.
- Simplifies feature module composition without the older NgModule boilerplate.
- Makes it easier for AI and developers to reason about component boundaries.
- Enables faster onboarding for new feature authors and code generators.

### 2.2 Why NgRx?

- Provides centralized state management for RPG experience, hydration, and shared UI state.
- Encourages predictable state transitions with actions, reducers, and selectors.
- Supports debugging and time-travel style reasoning when state changes are complex.
- Aligns with the existing pattern in the codebase for game progression and UI state.

### 2.3 Why a Generic Repository Pattern?

- Reduces duplication across controllers by centralizing query and command logic.
- Allows controllers and services to focus on feature rules rather than EF plumbing.
- Makes future backend features easier to implement with the same generic API.
- Provides a single place to improve data access performance and add async support later.

### 2.4 Why AutoMapper?

- Abstracts mapping between domain entities, DTOs, and view models.
- Keeps controllers thin and reduces manual property assignment.
- Allows future replacement with explicit mapping profiles without changing feature code.
- The wrapper (`IMappingService`) decouples feature code from concrete AutoMapper usage.

### 2.5 Why OpenAPI-generated Angular client?

- Prevents contract drift between frontend and backend APIs.
- Reduces boilerplate service code for every new endpoint.
- Produces strongly typed TypeScript models and services.
- Supports an API-first workflow for future feature generation.

### 2.6 Why OData?

- Enables powerful query composition for list endpoints.
- Supports filter, order, paging, and select patterns without custom endpoint logic.
- Matches the existing backend setup and reduces the need for custom query endpoints.

### 2.7 Why Azure AD / OAuth + JWT?

- Provides industry-standard identity and access control.
- Allows secure user-specific data access using claims-based authorization.
- Supports future enterprise integration with Microsoft Entra.
- Keeps the backend stateless and scalable.

## 3. Implementation Decisions

### 3.1 Service Registration

- `Api/Extensions/ServiceCollectionExtensions.cs` is the central registration point.
- `EfDbContext` is registered as a factory via `AddDbContextFactory`.
- `Repository` is registered as transient to keep each request isolated.
- `IStorageService` and `IMappingService` are singletons because they are stateless wrappers.
- `IPrincipal` is resolved from `IHttpContextAccessor` to allow current user resolution in services.

### 3.2 Configuration Loading

- `Api/AppSettings.cs` builds settings from `appsettings.json`, `appsettings.{environment}.json`, user secrets, and env vars.
- `Settings` is exposed through a lightweight interface for DI.
- Database and blob storage connection strings are validated early.

### 3.3 Database and Entity Modeling

- `BaseEntity` and `Identifier` define a shared identity contract across entities.
- Most entities use `Guid` IDs for cross-system compatibility.
- Domain models are kept in `api/Core/Models` with minimal EF annotations.
- Relationship navigation properties are used for eager loading when needed.

### 3.4 Blob Storage Compatibility

- The current blob service uses the legacy Azure Storage SDK for `CloudBlobContainer`.
- This was chosen for minimal implementation effort and compatibility with existing storage concepts.
- Future work should migrate to `Azure.Storage.Blobs` for better SDK support.

## 4. Tradeoffs and Technical Debt

### Current Tradeoffs

- `EFRepository` is synchronous and uses `SaveChanges()` in command methods, which limits scalability.
- The mapper configuration is currently empty at startup, so explicit mapping profiles are not yet registered.
- Blob storage initialization is blocking in the constructor and may hide startup errors.
- OpenAPI generated code is not validated by a strict regeneration pipeline; it relies on manual `ng-openapi-gen` execution.
- CORS is limited to local development and needs expansion for production deployments.

### Known Technical Debt

- No async repository methods (`SaveChangesAsync`, `ToListAsync`).
- No explicit AutoMapper profiles or convention-based mapping registry.
- No centralized file upload controller that consumes `IStorageService`.
- User filtering is not enforced in many controllers yet, even though authentication is present.
- `IPrincipal` resolution is fragile outside of HTTP request scope.

## 5. Future Architecture Improvements

- Add async repository methods and migrate controllers to `await` patterns.
- Introduce explicit AutoMapper profiles and validate mappings at startup.
- Replace legacy Azure Blob SDK with `Azure.Storage.Blobs` and typed blob clients.
- Add an automated OpenAPI generation step to the frontend build or CI pipeline.
- Add a shared `FeatureRegistry` spec and automation for new spec creation.
- Improve service boundaries by adding feature-specific service classes rather than placing logic directly in controllers.
- Implement database multi-tenancy or user scoping via claims-based filtering at the repository layer.

## 6. References

- `api/Api/Program.cs`
- `api/Api/Extensions/ServiceCollectionExtensions.cs`
- `api/Api/AppSettings.cs`
- `api/Core/Database/Repository.cs`
- `api/Database/Services/EfRepository.cs`
- `api/Api/Services/AutoMapperService.cs`
- `api/Api/Services/AzureBlobStorageService.cs`
- `src/app/api/base-service.ts`
- `src/README.md`
- `api/README.md`
