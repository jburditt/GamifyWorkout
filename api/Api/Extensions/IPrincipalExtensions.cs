using Core;
using System.Security.Claims;
using System.Security.Principal;

namespace Api
{
    public static class IPrincipalExtensions
    {
        public static void Clear(this IPrincipal principal)
        {
            if (principal == null)
                return;

            var currentPrincipal = principal as ClaimsPrincipal;

            foreach (var claim in currentPrincipal.Claims)
            {
                if (claim.Type == ClaimTypes.NameIdentifier)
                {
                    continue;
                }

                (currentPrincipal.Identity as ClaimsIdentity).RemoveClaim(claim);
            }
        }

        public static User GetUser(this IPrincipal principal)
        {
            var currentPrincipal = principal as ClaimsPrincipal;

            return new User
            {
                Id = new Guid(currentPrincipal.Get(AzureAdClaimTypes.Id)),
                FirstName = currentPrincipal.Get(ClaimTypes.GivenName),
                LastName = currentPrincipal.Get(ClaimTypes.Surname),
                Email = currentPrincipal.Get(ClaimTypes.Email),
                Username = currentPrincipal.Get("preferred_username"),
            };
        }
    }
}
