using System.Security.Claims;
using System.Security.Principal;

namespace Api
{
    public static class IPrincipalExtensions
    {
        public static UserResponse GetUser(this IPrincipal principal)
        {
            var currentPrincipal = principal as ClaimsPrincipal;

            return new UserResponse
            {
                OAuthId = currentPrincipal.Get(AzureAdClaimTypes.Id),
                FirstName = currentPrincipal.Get(ClaimTypes.GivenName),
                LastName = currentPrincipal.Get(ClaimTypes.Surname),
                Email = currentPrincipal.Get(ClaimTypes.Email),
            };
        }
    }
}
