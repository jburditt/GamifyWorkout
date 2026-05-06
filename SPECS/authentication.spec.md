# Authentication & Authorization Specification

> Full-stack specification for OAuth-based user authentication via Azure Entra ID with JWT token validation.

## Metadata

| Property | Value |
|----------|-------|
| **Spec ID** | `authentication` |
| **Title** | Authentication & Authorization System |
| **Status** | In Progress (backend partially complete, frontend integration pending) |
| **Last Updated** | 2024-01-15 |
| **Version** | 1.0.0 |
| **Related Specs** | [shared-services.spec.md](./shared-services.spec.md) |
| **Implemented In** | Frontend: `src/app/core/auth/`, Backend: `api/Api/Controllers/AuthController.cs` |

---

## 1. Overview

### What This Feature Does

Authentication manages user identity and access control using OAuth 2.0 with Azure Entra ID (Microsoft Entra ID). Users log in through Azure AD, receive a JWT bearer token, and use that token for all authenticated API requests. The system verifies tokens on the backend and protects routes on the frontend.

**Key Capabilities**:
- OAuth login via Azure Entra ID
- JWT bearer token management
- API route protection with [Authorize] attributes
- Frontend route guards for protected pages
- User identity extraction from JWT claims
- Session management (login/logout)
- Auto-token refresh (planned)

### Key Responsibilities

- **User Identity**: Extract and manage user identity from OAuth provider
- **Token Management**: Store, validate, and refresh JWT tokens
- **Access Control**: Enforce authorization on backend APIs and frontend routes
- **Claims Extraction**: Parse JWT claims for user data (email, name, roles)
- **Session Lifecycle**: Handle login, logout, and session expiration

### Integration Points

- **Upstream Dependencies**:
  - Azure Entra ID (OAuth provider)
  - Browser local/session storage (token persistence)

- **Downstream Consumers**:
  - All API endpoints (require JWT token)
  - All protected routes (require auth guard)
  - Gym Management (filter by authenticated user)
  - Weekly Schedule (filter by authenticated user)
  - User Profile (display current user)

- **External Systems**:
  - Azure Entra ID / Microsoft Entra ID (OAuth provider)
  - fullswing-angular-library (shared auth utilities)

---

## 2. Data Models

### OAuth Flow Diagram

```
User
    ↓ (clicks "Login")
Browser
    ↓ (navigates to Azure AD)
Azure Entra ID
    ↓ (login form)
User Enters Credentials
    ↓ (validate credentials)
Azure Entra ID Returns
    ↓ (redirects with authorization code)
Browser + Authorization Code
    ↓
Backend Token Exchange
    ↓ (exchange code for tokens)
Azure Entra ID
    ↓ (returns ID token + access token)
Backend Stores Tokens
    ↓
Browser Gets JWT Token
    ↓
Subsequent API Calls Include Bearer Token
    ↓ (Authorization: Bearer {token})
Backend Validates Token
    ↓ (check signature, claims, expiration)
Request Authorized or Denied
```

### TypeScript Models (Frontend)

**From shared library `fullswing-angular-library`**

```typescript
/**
 * User identity information
 */
export interface User {
  id?: string;              // Guid as string (OAuth ID)
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
}

/**
 * Authentication state
 */
export interface AuthenticationState {
  isLoggedIn: boolean;
  user?: User;
  token?: string;
  tokenExpiresAt?: Date;
}

/**
 * OAuth configuration
 */
export interface OAuthConfig {
  authority: string;         // Azure AD endpoint (e.g., https://login.microsoftonline.com/{tenantId})
  clientId: string;           // Application/client ID registered in Azure AD
  redirectUrl: string;        // Where to redirect after login (e.g., http://localhost:4200/auth/callback)
  scopes: string[];           // Requested scopes (e.g., ['openid', 'profile', 'email'])
  responseType: string;       // "code" for authorization code flow
  grantType: string;          // "authorization_code" or "refresh_token"
}
```

### C# Models (Backend)

**Located in `api/Core/Models/User.cs`**

```csharp
using System.ComponentModel.DataAnnotations;

namespace Core;

/// <summary>
/// Represents an authenticated user
/// ID is the OAuth/Azure AD user ID (Guid)
/// </summary>
public class User : BaseEntity
{
    [Key]
    [Display(Name = "OAuth Id")]
    public Guid? Id { get; set; }

    [Display(Name = "First Name")]
    public required string FirstName { get; set; }

    public required string LastName { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
}

/// <summary>
/// JWT Claims extracted from token
/// </summary>
public class UserClaims
{
    public string? NameIdentifier { get; set; }      // oid or sub claim
    public string? Email { get; set; }
    public string? Name { get; set; }
    public string? GivenName { get; set; }
    public string? FamilyName { get; set; }
    public List<string> Roles { get; set; } = new();
}
```

### JWT Token Structure

```typescript
/**
 * Decoded JWT Token (example)
 */
{
  "oid": "550e8400-e29b-41d4-a716-446655440000",      // Azure AD object ID
  "sub": "550e8400-e29b-41d4-a716-446655440000",      // Subject (user ID)
  "given_name": "John",
  "family_name": "Doe",
  "email": "john.doe@example.com",
  "email_verified": true,
  "name": "John Doe",
  "preferred_username": "john.doe@example.com",
  "iss": "https://login.microsoftonline.com/{tenantId}/v2.0",
  "aud": "your-app-id",
  "exp": 1705331234,                                  // Expiration (Unix timestamp)
  "iat": 1705327634,                                  // Issued at (Unix timestamp)
  "nbf": 1705327634                                   // Not before (Unix timestamp)
}
```

---

## 3. API Contracts

### Endpoints

#### 3.1 GET Current User (whoami)

```
GET /api/auth/whoami
```

**Description**: Get the currently authenticated user's information

**Authentication**: Required (JWT Bearer token)

**Request Headers**:
```
Authorization: Bearer {jwt_token}
```

**Response** (200 OK):
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "firstName": "John",
  "lastName": "Doe",
  "username": "john.doe@example.com",
  "email": "john.doe@example.com"
}
```

**Status Codes**:
- `200 OK`: Success, returns User
- `401 Unauthorized`: Missing or invalid token
- `403 Forbidden`: Token valid but user not in database

**Error Response** (401 Unauthorized):
```json
{
  "error": "Invalid or missing authorization token"
}
```

**Known Issues**:
- Endpoint currently not protected by [Authorize] (TODO: add auth requirement)
- User must exist in database (not auto-created on first login)

---

#### 3.2 Logout

```
GET /api/auth/logout
```

**Description**: Clear user session and revoke token

**Authentication**: Not required (stateless tokens)

**Response** (200 OK):
```json
{
  "message": "Logged out successfully"
}
```

**Status Codes**:
- `200 OK`: Logout successful

**Known Issues**:
- GET endpoint for logout (should be POST)
- No token revocation on backend (tokens remain valid until expiration)
- Stateless tokens can't be revoked without token blacklist

---

#### 3.3 OAuth Callback (Frontend)

```
GET /auth/callback?code={auth_code}&session_state={state}
```

**Description**: Handles OAuth redirect from Azure AD (processed by frontend library)

**Parameters**:
| Name | Type | Description |
|------|------|---|
| `code` | string | Authorization code from Azure AD |
| `session_state` | string | Session state for CSRF protection |

**Flow**:
1. Azure AD redirects with authorization code
2. Frontend library intercepts redirect
3. Code exchanged for JWT token (backend)
4. Token stored in browser storage
5. User redirected to home page

---

## 4. Services & Implementation

### Authentication Service Specifications

#### AuthenticationService (from shared library)

**Purpose**: Manage authentication state and OAuth flow

**Methods**:

```typescript
/**
 * Initialize authentication
 * Loads OAuth configuration and sets up login flow
 */
init(): Promise<void> { }

/**
 * Trigger OAuth login flow
 * Redirects to Azure AD login page
 */
login(): void { }

/**
 * Logout current user
 * Clears tokens and user state
 */
logout(): Promise<void> { }

/**
 * Get current login state
 */
isLoggedIn$: Observable<boolean>;

/**
 * Get currently logged-in user
 */
getUser$(): Observable<User> { }

/**
 * Get current JWT token
 */
getToken(): string { }

/**
 * Refresh expired token
 */
refreshToken(): Observable<string> { }
```

---

#### ApiAuthenticationService (Frontend)

**File**: `src/app/core/auth/api-auth.service.ts`

**Purpose**: API client for backend auth endpoints

**Methods**:

```typescript
/**
 * Get currently authenticated user from backend
 * @param azureUserInfo - User info from Azure AD token
 * @returns Observable of User with strict HTTP response
 */
whoAmI(azureUserInfo: any): Observable<StrictHttpResponse<User>> { }
```

**Implementation**:
```typescript
@Injectable({ providedIn: 'root' })
export class ApiAuthenticationService {
  public isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(
    private authService: AuthService,
    private loggingFactory: LoggingFactory
  ) { }

  whoAmI(azureUserInfo: any): Observable<StrictHttpResponse<User>> {
    return this.authService.apiAuthWhoamiGet$Response().pipe(
      map((response) => {
        // User exists in database
        return response;
      }),
      catchError((error: HttpErrorResponse) => {
        // User doesn't exist, might need to auto-create
        return throwError(() => error);
      })
    );
  }
}
```

---

### Auth Guard Specifications

#### AuthGuard

**File**: `src/app/core/auth/auth.guard.ts`

**Purpose**: Route guard to protect frontend routes

**Type**: Functional Guard

**Implementation**:

```typescript
export const AuthGuard = (): Observable<boolean> => {
  const router = inject(Router);
  const authService = inject(AuthenticationService);
  const configService = inject(ConfigService);

  return authService.isLoggedIn$.pipe(
    tap((isLoggedIn) => {
      if (!isLoggedIn) {
        // TODO: Check if config already loaded
        return firstValueFrom(configService.loadConfig$()).then(() => {
          return authService.init();
        });
        router.navigate(['/admin/denied']);
      }
      return isLoggedIn;
    })
  );
};
```

**Usage in Routes**:
```typescript
const routes: Routes = [
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard]  // Protected route
  },
  {
    path: 'public',
    component: PublicComponent
    // No guard - public route
  }
];
```

**Known Issues**:
- Config loading check not fully implemented (TODO)
- Route may be activated before guard completes (timing issue)
- Error handling for failed auth could be better

---

### Middleware & Claims Extraction

#### UsersMiddleware (Backend)

**Purpose**: Extract user claims from JWT and populate HttpContext

**Implementation** (planned):

```csharp
/// <summary>
/// Middleware to extract and validate JWT claims
/// Runs for every request and populates user context
/// </summary>
public class UsersMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<UsersMiddleware> _logger;

    public UsersMiddleware(RequestDelegate next, ILogger<UsersMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Extract Bearer token
        var authHeader = context.Request.Headers["Authorization"].ToString();
        if (authHeader.StartsWith("Bearer "))
        {
            var token = authHeader.Substring("Bearer ".Length).Trim();
            
            // Validate and extract claims
            try
            {
                var principal = ValidateToken(token);
                context.User = principal;
                
                // Add user to HttpContext for controllers
                var userId = context.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                _logger.LogInformation($"Request from user: {userId}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Token validation failed: {ex.Message}");
            }
        }

        await _next(context);
    }
}

/// <summary>
/// Extension method for IPrincipal to extract user
/// </summary>
public static class PrincipalExtensions
{
    public static User GetUser(this IPrincipal principal)
    {
        var identity = principal.Identity as ClaimsIdentity;
        
        return new User
        {
            Id = Guid.Parse(identity?.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? ""),
            Email = identity?.FindFirst(ClaimTypes.Email)?.Value,
            FirstName = identity?.FindFirst("given_name")?.Value,
            LastName = identity?.FindFirst("family_name")?.Value,
            Username = identity?.FindFirst(ClaimTypes.Upn)?.Value
        };
    }

    public static void Clear(this IPrincipal principal)
    {
        // Logout logic (stateless - mainly frontend operation)
        // Could implement token blacklist here
    }
}
```

---

## 5. Configuration

### Azure Entra ID Setup

```typescript
// AppSettings.json
{
  "AzureAd": {
    "Instance": "https://login.microsoftonline.com/",
    "TenantId": "{your-tenant-id}",
    "ClientId": "{your-app-id}",
    "ClientSecret": "{your-client-secret}",
    "CallbackPath": "/auth/callback",
    "AllowedHosts": "localhost:4200,your-domain.com"
  }
}
```

### OAuth Configuration (Frontend)

```typescript
// Environment configuration
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080',
  auth: {
    authority: 'https://login.microsoftonline.com/{tenantId}',
    clientId: '{app-id}',
    redirectUrl: 'http://localhost:4200/auth/callback',
    postLogoutRedirectUri: 'http://localhost:4200/home',
    scopes: ['openid', 'profile', 'email'],
    responseType: 'code',
    grantType: 'authorization_code'
  }
};
```

---

## 6. Security Considerations

### Token Storage

```typescript
// Current: localStorage (vulnerability if XSS occurs)
localStorage.setItem('id_token', token);

// Better: HttpOnly cookie (set by backend on auth callback)
// Client can't access via JavaScript (prevents XSS theft)
```

### CORS Policy

```csharp
// Backend CORS configuration
services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", builder =>
    {
        builder
            .WithOrigins("http://localhost:4200", "https://your-domain.com")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

### JWT Validation

```csharp
services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://login.microsoftonline.com/{tenantId}/v2.0";
        options.Audience = "{app-id}";
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ClockSkew = TimeSpan.Zero
        };
    });
```

---

## 7. Error Scenarios

| Scenario | Trigger | Current Behavior | Expected Behavior | Status |
|----------|---------|---|---|---|
| No token provided | Unauthenticated request to protected endpoint | 401 Unauthorized | Return 401 with error message | Working |
| Token expired | Token past expiration time | 401 Unauthorized | Return 401, prompt refresh or re-login | Partial |
| Invalid token signature | Token tampered with | 401 Unauthorized | Return 401, reject request | Working |
| User not in database | Valid token but user not found | 403 Forbidden | Auto-create user or return 403 | TODO |
| Token missing claims | Malformed token | 401 Unauthorized | Return 401 with error | Partial |
| CORS failure | Cross-origin request without CORS headers | CORS error | Return 403 CORS error | Working |
| Config not loaded | Auth config missing | Silent failure | Show error message | TODO |
| OAuth callback fails | Azure AD returns error | Blank page | Show error and retry option | TODO |

---

## 8. Usage Examples

### Frontend Usage - Login

```typescript
// In component or main.ts
import { AuthenticationService } from 'fullswing-angular-library';

export class AppComponent {
  constructor(private authService: AuthenticationService) {
    this.authService.init();
  }

  login() {
    this.authService.login();  // Redirects to Azure AD
  }

  logout() {
    this.authService.logout();  // Clears tokens
  }
}
```

### Frontend Usage - Protected Route

```typescript
import { AuthGuard } from '@app/core/auth/auth.guard';

export const routes: Routes = [
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard]
  }
];
```

### Backend Usage - Protected Endpoint

```csharp
[ApiController]
[Route("api/[controller]")]
[Authorize]  // Requires valid JWT
public class GymController : ControllerBase
{
    [HttpGet]
    public ActionResult<List<Gym>> Get()
    {
        // Extract userId from claims
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        
        // Return gyms for this user only
        var gyms = _repository.All<Gym>()
            .Where(g => g.UserId == new Guid(userId))
            .ToList();
        
        return Ok(gyms);
    }
}
```

### API Call with Token

```typescript
// HttpClient automatically adds token from interceptor
this.http.get('/api/gym').subscribe(
  gyms => console.log(gyms),
  error => console.error('Unauthorized', error)
);
```

---

## 9. Related Files & References

### Frontend Implementation

- **Auth Guard**: [src/app/core/auth/auth.guard.ts](../src/app/core/auth/auth.guard.ts)
- **Auth Service**: [src/app/core/auth/api-auth.service.ts](../src/app/core/auth/api-auth.service.ts)
- **Shared Library**: fullswing-angular-library (AuthenticationService, ConfigService)

### Backend Implementation

- **Auth Controller**: [api/Api/Controllers/AuthController.cs](../api/Api/Controllers/AuthController.cs)
- **User Model**: [api/Core/Models/User.cs](../api/Core/Models/User.cs)
- **Middleware**: (planned - not yet implemented)
- **Program.cs**: OAuth and JWT configuration setup

### Configuration

- **Environment**: `projects/gamifyworkout/src/environments/environment.ts`
- **appsettings.json**: Azure AD configuration (backend)

---

## 10. Known Issues & TODOs

| Issue | Priority | Status | Description | Workaround | Epic |
|-------|----------|--------|---|---|---|
| **OAuth not enabled on frontend** | High | Open | OAuth flow commented out, currently unauthenticated | Uncomment and configure | Auth Setup |
| **No user filtering by authenticated user** | High | Open | All endpoints return all data (TODO comments everywhere) | Manually specify userId | Auth Integration |
| **No middleware for claims extraction** | High | Open | Middleware exists but not fully integrated | Extract userId in controllers manually | Auth Setup |
| **Token stored in localStorage** | Medium | Open | XSS vulnerability if site compromised | Move to HttpOnly cookies | Security |
| **No auto-token refresh** | Medium | Open | Tokens expire and user must re-login | Implement refresh token flow | Feature |
| **No token blacklist/revocation** | Medium | Open | Logout doesn't invalidate tokens (stateless) | Implement server-side token blacklist | Security |
| **User auto-creation not implemented** | Low | Planned | User must exist in database before first login | Auto-create on first login | Feature |
| **Config loading timing issue** | Low | Open | Guard may activate before config loaded | Ensure config loads first | Bug |
| **No session timeout handling** | Low | Planned | User stays "logged in" even if token expired | Implement session timeout prompt | UX |
| **No multi-factor authentication** | Low | Planned | MFA not supported (Azure AD can enforce it) | Enable MFA on Azure AD side | Security |

---

## 11. Future Enhancements

- [ ] Auto-token refresh using refresh tokens
- [ ] Session timeout with prompt to refresh
- [ ] Multi-factor authentication (MFA)
- [ ] Role-based access control (RBAC)
- [ ] Token blacklist for instant logout
- [ ] Social login providers (Google, Facebook)
- [ ] Single sign-on (SSO) across apps
- [ ] Two-factor authentication (2FA)
- [ ] API key authentication for third-party integrations
- [ ] Session management (device list, logout all devices)
- [ ] Login history and audit logs
- [ ] IP whitelist/blacklist

---

## 12. Appendix: Code Generation Notes

### For AI Code Generators

When generating code based on this spec:

**Guard Generation**:
1. Use functional guards with inject() pattern
2. Return Observable<boolean>
3. Implement tap() for side effects (navigation)
4. Check isLoggedIn$ before allowing access

**Service Generation**:
1. Inject HttpClient and Authentication service
2. Map responses to User interface
3. Add error handling with catchError
4. Use strict HTTP responses for type safety

**Controller Generation**:
1. Add [Authorize] attribute to protected methods
2. Extract userId from User.FindFirst(ClaimTypes.NameIdentifier)
3. Filter results by extracted userId
4. Return 401 for auth failures, 403 for permission denied

**Middleware Generation**:
1. Extract Bearer token from Authorization header
2. Validate JWT signature using configured secret
3. Parse claims and create ClaimsPrincipal
4. Populate context.User for downstream use

---

*Last reviewed: January 15, 2024 | Spec version: 1.0.0 | Status: In Progress*
