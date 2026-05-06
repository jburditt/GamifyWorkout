# Shared Services and Infrastructure Spec

## Metadata

- **Title:** Shared Services, Repository, Mapping, Storage, and OpenAPI Client Generation
- **Scope:** Backend foundation services and frontend auto-generated API client infrastructure
- **Implemented In:**
  - Backend: `projects/gamifyworkout/api/Api/Program.cs`, `projects/gamifyworkout/api/Api/Extensions/ServiceCollectionExtensions.cs`, `projects/gamifyworkout/api/Core/Database/Repository.cs`, `projects/gamifyworkout/api/Database/Services/EfRepository.cs`, `projects/gamifyworkout/api/Api/Services/AutoMapperService.cs`, `projects/gamifyworkout/api/Api/Services/AzureBlobStorageService.cs`, `projects/gamifyworkout/api/Api/AppSettings.cs`
  - Shared domain models: `projects/gamifyworkout/api/Core/Models/`, `projects/gamifyworkout/api/Core/Settings.cs`
  - Frontend OpenAPI client: `projects/gamifyworkout/src/app/api/`, `projects/gamifyworkout/src/README.md`

## Overview

This spec documents the shared backend service layer and frontend API generation pipeline for the GamifyWorkout application.

The shared services provide the following responsibilities:

- Generic database access via a `Repository` abstraction
- Entity Framework implementation of CRUD, query, filter, and pagination operations
- AutoMapper wrapper for object-to-object mapping
- Azure Blob Storage wrapper for file upload/download/delete
- Dependency injection registration and configuration wiring
- OpenAPI/Swagger-driven Angular client generation for frontend API contracts

The goal is to make the foundation layer explicit for future feature development and AI code generation.

## Architecture Summary

- `Api/Program.cs` boots the ASP.NET Core app, configures OData, CORS, authentication, and registers shared services.
- `Api/AppSettings.cs` builds runtime settings from JSON files, user secrets, and environment variables.
- `Api/Extensions/ServiceCollectionExtensions.cs` registers the shared service implementations.
- `Core/Database/Repository.cs` defines the generic repository contract.
- `Database/Services/EfRepository.cs` implements repository behavior using `EfDbContext`.
- `Api/Services/AutoMapperService.cs` provides a thin wrapper around AutoMapper.
- `Api/Services/AzureBlobStorageService.cs` implements `IStorageService` against Azure Blob Storage.
- `src/app/api/` contains Angular services and models generated from the backend OpenAPI spec.

## Service Layer: Repository Pattern

### Contract: `Repository`

The shared repository abstraction is defined in `api/Core/Database/Repository.cs`.

Key features:

- Generic methods for `All`, `Get`, `Find`, `Filter`, `FilterSort`, `Insert`, `Update`, `Delete`, `Count`, and `Contains`
- Supports `Guid`-based `Identifier` objects via `Repository.Get<T>(Guid id, ...)`
- Includes overloads for eager-loading related entities using include paths or expression selectors
- Supports filter/paging with `out int total` and `size/index` parameters

Important method signatures:

- `IQueryable<T> All<T>(string[] includes = null) where T : class`
- `T Get<T>(Guid id, params Expression<Func<T, object>>[] includes) where T : class, Identifier`
- `T Get<T>(Expression<Func<T, bool>> expression, string[] includes = null) where T : class`
- `T Find<T>(Expression<Func<T, bool>> predicate, string[] includes) where T : class`
- `IQueryable<T> Filter<T>(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes) where T : class`
- `IQueryable<T> Filter<T>(Expression<Func<T, bool>> filter, out int total, int index = 0, int size = 50, string[] includes = null) where T : class`
- `T Insert<T>(T t) where T : class`
- `int Delete<T>(T t) where T : class`
- `int Delete<T>(Expression<Func<T, bool>> predicate) where T : class`
- `int Delete<T>(object id) where T : class`
- `int Update<T>(T t) where T : class`
- `T Update<T>(Guid id, Func<T, object>[] properties) where T : class, Identifier`
- `bool Contains<T>(Expression<Func<T, bool>> predicate) where T : class`
- `int Count<T>(Expression<Func<T, bool>> predicate) where T : class`

### Runtime: `EFRepository`

Implementation: `api/Database/Services/EfRepository.cs`

Behavior:

- Uses `EfDbContext` and standard EF Core query APIs
- Automatically applies `Include` for eager loading when `includes` or `includeProperties` are provided
- Calls `SaveChanges()` after each insert, update, or delete operation
- Updates `CreatedOn` and `ModifiedOn` timestamps when objects implement those marker interfaces
- Uses `IQueryable<T>` returns for query composition and deferred execution

Key implementation details:

- `Insert<T>(T obj)`: adds object, sets created/modified timestamps, saves changes, returns entity
- `All<T>(string[] includes = null)`: includes first/next include path values and returns an `IQueryable<T>`
- `Get<T>(Guid id, params Expression<Func<T, object>>[] includes)`: eager-loads selectors and returns first match by `Id`
- `Find<T>(Expression<Func<T, bool>> predicate, string[] includes = null)`: supports both string-based include paths and expression-based include selectors
- `Filter<T>(Expression<Func<T, bool>> predicate, params Expression<Func<T, object>>[] includes)`: returns filtered query set
- `FilterSort<T>(filter, orderBy, includeProperties)`: supports ordering and comma-separated include strings
- `Filter<T>(filter, out int total, index, size, includes)`: implements simple pagination using `Skip`/`Take` and counts the returned page
- `Delete<T>(T TObject)`: removes an entity and saves changes
- `Delete<T>(Expression<Func<T, bool>> predicate)`: removes all matching entities in a loop and saves changes
- `Delete<T>(object id)`: finds by key, then removes it
- `Update<T>(T TObject)`: attaches entity, sets modified timestamp, marks modified, and saves changes
- `Update<T>(Guid id, params Func<T, object>[] properties)`: loads entity, attaches it, invokes action lambdas to mutate object, then saves changes

### Domain and Base Models

- `api/Core/Models/BaseEntity.cs` defines `BaseEntity` with `Guid Id` and inherits `Identifier`
- `api/Core/Database/Identifier.cs` defines `Identifier` with `Guid Id { get; set; }`
- `BaseEntity` is the shared root for most domain models such as `Gym`, `Equipment`, `Schedule`, `User`, and `WorkoutLog`

### Repository Usage Patterns

Common backend usage patterns for repository methods:

- Read all entities:
  - `_repository.All<Gym>(new[] { "Equipment" })`
- Read by identity:
  - `_repository.Get<Gym>(gymId, g => g.Equipment)`
- Query a filtered set:
  - `_repository.Filter<User>(u => u.Email == email)`
- Query with paging:
  - `_repository.Filter<Schedule>(predicate, out var total, index: 1, size: 25)`
- Insert entity:
  - `_repository.Insert(new Exercise { ... })`
- Soft update by object:
  - `_repository.Update(existingExercise)`
- Partial update using action lambdas:
  - `_repository.Update<WorkoutLog>(id, wl => wl.Sets = 5, wl => wl.Reps = 12)`
- Delete by entity or predicate:
  - `_repository.Delete(gym)`
  - `_repository.Delete<Equipment>(e => e.GymId == gymId)`

### Design Intent

- Keep service layer DRY by centralizing data-access patterns in one repository implementation
- Use generic methods so controllers and feature services can reuse the same interface for any entity type
- Allow eager loading when needed without requiring dedicated controller methods for every graph shape
- Use a single repository implementation for both queries and commands

## Mapping Service

### Contract: `IMappingService`

Defined in `api/Core/Services/IMapperService.cs`.

Methods:

- `TDestination Map<TSource, TDestination>(TSource source)`
- `TDestination Map<TSource, TDestination>(TSource source, TDestination destination)`

This abstraction enables feature code to map between domain models, DTOs, and view models without depending directly on AutoMapper.

### Implementation: `AutoMapperService`

Located at `api/Api/Services/AutoMapperService.cs`.

Behavior:

- Wraps an `AutoMapper.IMapper` instance injected through DI
- Uses `_mapper.Map<TDestination>(source)` for compiled mappings
- Uses `_mapper.Map(source, destination)` for existing destination objects
- Provides `NoncompiledMap<TSource, TDestination>(TSource source)` as a static fallback to create a runtime mapper configuration

Important implementation details:

- `Map<TSource, TDestination>(TSource source)` delegates to `_mapper.Map<TDestination>(source)`
- `Map<TSource, TDestination>(TSource source, TDestination destination)` delegates to `_mapper.Map(source, destination)`
- `NoncompiledMap<TSource, TDestination>(TSource source)` builds a new `MapperConfiguration` with `cfg.CreateMap<TSource, TDestination>(MemberList.Source)` and maps immediately

### DI Registration

Configured in `api/Api/Extensions/ServiceCollectionExtensions.cs`:

- `services.AddSingleton<IMappingService, AutoMapperService>();`
- `services.AddSingleton(new MapperConfiguration(cfg => { }).CreateMapper());`

### Notes and Risk Areas

- The current mapper configuration is empty (`cfg => { }`), so runtime mapping may fail unless AutoMapper is configured elsewhere or maps are inferred by convention.
- The static fallback `NoncompiledMap` is less performant and should only be used when runtime mapping is acceptable.
- A safer long-term approach is to register explicit mapping profiles and/or use `cfg.CreateMap<Source, Destination>()` for each domain-to-DTO mapping.

## Blob Storage Service

### Contract: `IStorageService`

Defined in `api/Core/Services/IStorageService.cs`.

Methods:

- `Task<string> UploadFileAsync(string blobName, Stream stream)`
- `Task<Stream> DownloadFileAsync(string blobName)`
- `Task<bool> DeleteFileAsync(string blobName)`

### Implementation: `AzureBlobStorageService`

Located at `api/Api/Services/AzureBlobStorageService.cs`.

Behavior:

- Uses the legacy Azure Storage SDK from `Microsoft.WindowsAzure.Storage`
- Connects using `Settings.FileStore.ConnectionString`
- Opens or creates the blob container named `workouts`
- Sets public access to `Blob`
- Uploads, downloads, and deletes block blobs using `CloudBlockBlob`

Important implementation details:

- The constructor throws `MissingFieldException` if `AzureBlobStorage` connection string is empty
- `UploadFileAsync` returns the blob URI string after upload
- `DownloadFileAsync` returns a `MemoryStream` positioned at the beginning
- `DeleteFileAsync` returns `true` when the blob is deleted or absent

### DI Registration

Configured in `api/Api/Extensions/ServiceCollectionExtensions.cs`:

- `services.AddSingleton<IStorageService>(provider => new AzureBlobStorageService(settings, "workouts"));`

### Notes and Risk Areas

- The constructor calls `.CreateIfNotExistsAsync().Wait()` and does not await `SetPermissionsAsync()`, which may introduce startup blocking or silent failures.
- The implementation uses a hard-coded container name (`workouts`), so all uploads share the same bucket.
- The service exposes only simple upload/download/delete operations and does not support file enumeration, metadata, or container lifecycle operations.
- This wrapper is appropriate for simple blob-backed features, but future work should consider migrating to the newer `Azure.Storage.Blobs` SDK.

## Dependency Injection and Application Configuration

### App Settings

`api/Api/AppSettings.cs` defines application settings and runtime configuration loading.

Behavior:

- Builds configuration from:
  - `appsettings.json`
  - `appsettings.{Environment}.json` (optional)
  - user secrets via `AddUserSecrets<Program>()`
  - environment variables
- Validates that `DefaultConnection` exists
- Creates `DatabaseSettings` and `FileStorageSettings`
- Registers `IConfiguration` and `Settings` as singletons

The `Settings` interface in `api/Core/Settings.cs` exposes:

- `DatabaseSettings Database { get; }`
- `FileStorageSettings FileStore { get; }`

Structures:

- `DatabaseSettings(string connectionString)`
- `FileStorageSettings(string connectionString)`

### Shared Service Registration

`api/Api/Extensions/ServiceCollectionExtensions.cs` wires the shared service implementations.

Registration summary:

- `services.AddDbContextFactory<EfDbContext>(options => options.UseSqlServer(settings.Database.ConnectionString));`
- `services.AddTransient<Repository, EFRepository>();`
- `services.AddHttpContextAccessor();`
- `services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);`
- `services.AddSingleton<IStorageService>(provider => new AzureBlobStorageService(settings, "workouts"));`
- `services.AddSingleton<IMappingService, AutoMapperService>();`
- `services.AddSingleton(new MapperConfiguration(cfg => { }).CreateMapper());`

### Application Startup

In `api/Api/Program.cs`:

- OData and controllers are enabled with `AddControllers().AddOData(...)`
- CORS is configured for `https://localhost:4200`
- Settings are loaded with `builder.Services.AddAppSettings(builder.Environment)`
- Shared services are registered with `builder.Services.RegisterServices(settings)`
- Authentication and authorization middleware are enabled
- Database migrations are applied at startup using `context.Database.Migrate()` inside a created scope

### Design Notes

- The repository is registered as `Transient` so each request receives a new `EFRepository` instance.
- The blob storage and mapper are registered as singletons, since they are safe to reuse across requests.
- `IPrincipal` is registered as a transient scoped helper to read the current HTTP user from `HttpContext`.

## OpenAPI Client Generation

### Purpose

The frontend client is generated from the backend OpenAPI/Swagger spec so Angular service contracts match the ASP.NET API definitions.

### How It Works

- The backend exposes Swagger/OpenAPI at `/swagger/v1/swagger.json`
- The frontend generation command is documented in `projects/gamifyworkout/src/README.md`
- Generated code lives under `projects/gamifyworkout/src/app/api/`
- Services extend the generated `BaseService` and use `HttpClient` to call backend endpoints
- Models are generated into `src/app/api/models/`
- Generated code is marked `DO NOT EDIT`

### Generation Command

From the frontend root: `ng-openapi-gen --input https://localhost:8080/swagger/v1/swagger.json --output src/app/api`

### Example Generated Service Pattern

`src/app/api/services/gym.service.ts` demonstrates the generated service layout:

- `GymService` extends `BaseService`
- It injects `ApiConfiguration` and `HttpClient`
- It defines static path constants such as `ApiGymGetPath`
- It exposes method pairs:
  - `apiGymGet$Response(...)` returns `StrictHttpResponse<Array<Gym>>`
  - `apiGymGet(...)` returns `Observable<Array<Gym>>`
- It uses a generated function from `src/app/api/fn/gym/api-gym-get.ts`
- Response bodies are mapped with `map((r: StrictHttpResponse<T>): T => r.body)`

### Frontend Usage

Generated services are imported from `@app/api/services`.

Example:

- `import { GymService } from '@app/api/services';`
- `import { Gym } from '@app/api/models';`
- `this.gymService.apiGymGet().subscribe(...);`

### Why This Matters

- Keeps backend and frontend contracts synchronized
- Reduces boilerplate service creation for each controller endpoint
- Encourages API-first development for future features
- Supports type-safe Angular code based on generated models

## Shared Models and Configuration

### Shared Model Files

- `api/Core/Models/BaseEntity.cs`
- `api/Core/Database/Identifier.cs`
- `api/Core/Settings.cs`
- `api/Core/Models/User.cs`
- `api/Core/Models/Gym.cs`
- `api/Core/Models/Equipment.cs`
- `api/Core/Models/Schedule.cs`
- `api/Core/Models/WorkoutLog.cs`

### Shared Infrastructure Files

- `api/Api/AppSettings.cs`
- `api/Api/Extensions/ServiceCollectionExtensions.cs`
- `api/Api/Services/AutoMapperService.cs`
- `api/Api/Services/AzureBlobStorageService.cs`
- `api/Core/Services/IMappingService.cs`
- `api/Core/Services/IStorageService.cs`

### Frontend Generated API Files

- `src/app/api/base-service.ts`
- `src/app/api/api-configuration.ts`
- `src/app/api/services/*.ts`
- `src/app/api/models/*.ts`
- `src/app/api/fn/**/*.ts`

## Known Issues and Technical Debt

### Repository Layer

- The repository interface is synchronous only; there are no `async` methods such as `SaveChangesAsync`, `FindAsync`, or `ToListAsync`.
- `EFRepository` uses `SaveChanges()` directly for every command, which can block threads and reduce scalability.
- `Update<T>(Guid id, params Func<T, object>[] properties)` is error-prone because it relies on side-effect lambdas rather than explicit property assignments.
- Partial updates and transactional operations are not clearly separated from full entity updates.
- Pagination uses `Skip`/`Take` but counts the returned page rather than the full filtered set, which can misreport totals.
- `FilterSort` and include behavior are duplicated across overloads with string-based and expression-based parameters.

### Mapping Layer

- The `MapperConfiguration` is registered with an empty configuration block, so no explicit mapping profiles are defined by default.
- `AutoMapperService.NoncompiledMap` can work without startup configuration but is less performant and bypasses the precompiled mapper.
- There is no centralized place in the current codebase for mapping profile registration or type-safe AutoMapper configuration.

### Storage Layer

- Azure Blob initialization is synchronous and can block startup via `Wait()`.
- `SetPermissionsAsync()` is called without awaiting, so container ACL setup may not complete before use.
- The hard-coded container name `workouts` limits future reuse across separate file categories.
- The storage implementation uses the older `Microsoft.WindowsAzure.Storage` library rather than the modern `Azure.Storage.Blobs` SDK.

### OpenAPI / Frontend

- The generated API client is designed to be regenerated wholesale; any manual edits inside `src/app/api/` should be avoided.
- There is no documented process for versioning the OpenAPI client or validating that generated models are up to date with the API schema.

### Configuration

- Bootstrap configuration in `Api/AppSettings.cs` is strongly tied to JSON files and user secrets. If `DefaultConnection` is missing, the app fails immediately.
- CORS is currently limited to `https://localhost:4200`, which is fine for local development but needs expansion for staging/production.
- `IPrincipal` injection uses `HttpContextAccessor` and may be null outside of an active HTTP request.

## Recommendations for Future Work

- Add `async` repository methods and convert controllers/service code to use `await`.
- Introduce explicit mapping profiles and register them in `ServiceCollectionExtensions`.
- Replace the legacy Azure Blob SDK with `Azure.Storage.Blobs` and inject a typed `BlobContainerClient`.
- Add a dedicated interface `IRepository` or preserve `Repository` while clarifying naming for dependency injection.
- Add end-to-end tests for repository queries, `AutoMapperService`, and `IStorageService`.
- Add a regeneration guide to `src/README.md` documenting when to run `ng-openapi-gen`.
- Support OpenAPI versioning and generate a client only when the schema changes.
- Consider adding file upload controllers or DTOs that rely on `IStorageService` instead of direct blob code.

## Usage Guide for AI Code Generation

When generating new backend features, follow this pattern:

1. Add domain model(s) under `api/Core/Models/`.
2. Add database migrations if the model changes the schema.
3. Use the shared `Repository` abstraction for reads, filters, inserts, updates, and deletes.
4. Prefer `EFRepository` when interacting with EF Core, but keep controller logic thin.
5. Add service interfaces or helper classes only when feature behavior is richer than basic CRUD.
6. If mapping is needed, use `IMappingService.Map<TSource,TDestination>(source)` or add a mapping profile.
7. Register any new service in `ServiceCollectionExtensions.RegisterServices()`.
8. Add OpenAPI attributes if needed and regenerate the Angular client.

When generating new frontend API clients or services:

- Do not hand-code the models in `src/app/api/models/` unless the OpenAPI generation tool cannot express a shape.
- Use generated services from `src/app/api/services/` wherever possible.
- Keep `BaseService`-derived generated clients as the contract layer between Angular components and backend controllers.

## Related Files

- `api/Core/Database/Repository.cs`
- `api/Database/Services/EfRepository.cs`
- `api/Api/Services/AutoMapperService.cs`
- `api/Api/Services/AzureBlobStorageService.cs`
- `api/Api/Extensions/ServiceCollectionExtensions.cs`
- `api/Api/AppSettings.cs`
- `api/Core/Settings.cs`
- `api/Core/Services/IMapperService.cs`
- `api/Core/Services/IStorageService.cs`
- `api/Core/Database/Identifier.cs`
- `api/Core/Models/BaseEntity.cs`
- `src/README.md`
- `api/README.md`
- `src/app/api/base-service.ts`
- `src/app/api/services/gym.service.ts`
- `src/app/api/services/schedule.service.ts`
- `src/app/api/services/user.service.ts`

## Inspection Checklist

- [ ] Confirm that `RegisterServices()` is invoked in `Program.cs`
- [ ] Confirm `IStorageService` is available in DI for any file upload controllers
- [ ] Confirm OpenAPI generation command works against local Swagger endpoint
- [ ] Confirm `AutoMapperService` is either configured with profiles or replaced with explicit mapping usage
- [ ] Confirm `EFRepository` has adequate tests for query filtering, updates, and deletes
