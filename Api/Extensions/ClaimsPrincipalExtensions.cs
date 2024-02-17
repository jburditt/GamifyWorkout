using System.Security.Claims;

namespace Api
{
    public static class ClaimsPrincipalExtension
    {
        public static void Upsert(this ClaimsPrincipal claimsPrincipal, string key, string value)
        {
            var identity = claimsPrincipal.Identity as ClaimsIdentity;
            if (identity == null)
                return;

            var existingClaim = identity.FindFirst(key);
            if (existingClaim != null)
                identity.RemoveClaim(existingClaim);

            identity.AddClaim(new Claim(key, value));
        }

        public static string? Get(this ClaimsPrincipal claimsPrincipal, string key)
        {
            var identity = claimsPrincipal.Identity as ClaimsIdentity;
            if (identity == null)
                return null;

            var claim = identity.Claims.FirstOrDefault(c => c.Type == key);
            return claim?.Value;
        }

        public static void Clear(this ClaimsPrincipal claimsPrincipal)
        {
            var identity = claimsPrincipal.Identity as ClaimsIdentity;
            if (identity == null)
                return;

            var claims = identity.Claims.ToList();
            if (claims != null)
                foreach (var claim in claims)
                    identity.RemoveClaim(claim);
        }

        public static bool HasPortalScope(this ClaimsPrincipal principal, string portalScope)
        {
            var scopeList = principal.Claims.FirstOrDefault(c => c.Type == AzureAdClaimTypes.Scope);
            var result = scopeList != null && scopeList.ToString().Split(' ')
                .Any(s => s.Equals(portalScope, StringComparison.OrdinalIgnoreCase));
            return result;
        }
    }
}