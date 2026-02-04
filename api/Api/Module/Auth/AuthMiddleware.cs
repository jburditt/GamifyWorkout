using Api;
using Microsoft.Net.Http.Headers;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

// intercept api services to add user claims needed for authentication
public class UsersMiddleware
{
    private readonly RequestDelegate _next;

    public UsersMiddleware(RequestDelegate next)
    {
        this._next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        if (context.User.Identity == null || !context.User.Identity.IsAuthenticated || IsBlacklisted(context))
        {
            await _next(context);
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

            string firstName = null;
            string lastName = null;
            var name = jwt.Claims
                .First(c => c.Type == "name")
                .Value;
            string[] names = null;
            if (name.Contains(",")) {
                names = name.Split(',');
                firstName = names[1];
                lastName = names[0];
            } else if (name.Contains(" ")) {
                names = name.Split(' ');
                firstName = names[0];
                lastName = names[1];
            }

            try
            {
                context.User.Clear();
                context.User.Upsert(AzureAdClaimTypes.Id, jwt.Claims.First(c => c.Type == "oid").Value);
                context.User.Upsert(AzureAdClaimTypes.UserName, jwt.Claims.First(c => c.Type == AzureAdClaimTypes.UserName).Value);
                context.User.Upsert(ClaimTypes.GivenName, firstName);
                context.User.Upsert(ClaimTypes.Surname, lastName);
                context.User.Upsert(ClaimTypes.Email, jwt.Claims.First(c => c.Type == "email").Value);
            }
            catch
            {
                throw new Exception($"JWT token is invalid");
            }
        }

        await _next(context);
    }

    // blacklist endpoints that do not need authentication
    private static bool IsBlacklisted(HttpContext context)
    {
        return context.Request.Path.HasValue &&
            // TODO check if StartsWith "/swagger" or "swagger" would work
            context.Request.Path.Value.Contains("swagger", StringComparison.OrdinalIgnoreCase);
    }
}
