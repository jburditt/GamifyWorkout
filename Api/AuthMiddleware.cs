using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Api
{
    /// <summary>
    /// intercept api services to add user claims needed for authentication
    /// </summary>
    public class UsersMiddleware
    {
        private readonly RequestDelegate next;

        public UsersMiddleware(RequestDelegate next)
        {
            this.next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            if (context.User.Identity == null || !context.User.Identity.IsAuthenticated || IsBlacklisted(context))
            {
                await next(context);
                return;
            }

            var token = context.Request.Headers[HeaderNames.Authorization]
                .ToString()["Bearer ".Length..]
                .Trim();

            // decode JWT
            var jwtHandler = new JwtSecurityTokenHandler();
            if (jwtHandler.CanReadToken(token))
            {
                var jwt = jwtHandler.ReadJwtToken(token);
                var names = jwt.Claims
                    .First(c => c.Type == "name")
                    .Value
                    .Split(',');

                try
                {
                    context.User.Clear();
                    context.User.Upsert(AzureAdClaimTypes.Id, jwt.Claims.First(c => c.Type == "oid").Value);
                    context.User.Upsert(AzureAdClaimTypes.UserName, jwt.Claims.First(c => c.Type == AzureAdClaimTypes.UserName).Value);
                    context.User.Upsert(ClaimTypes.GivenName, names[1]);
                    context.User.Upsert(ClaimTypes.Surname, names[0]);
                    context.User.Upsert(ClaimTypes.Email, jwt.Claims.First(c => c.Type == "email").Value);
                }
                catch
                {
                    throw new Exception($"JWT token is invalid");
                }
            }

            await next(context);
        }

        // blacklist endpoints that do not need authentication
        private static bool IsBlacklisted(HttpContext context)
        {
            return context.Request.Path.HasValue &&
                // TODO check if StartsWith "/swagger" or "swagger" would work
                context.Request.Path.Value.Contains("swagger", StringComparison.OrdinalIgnoreCase);
        }
    }
}
