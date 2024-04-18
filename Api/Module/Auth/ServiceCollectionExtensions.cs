public static class ServiceCollectionExtensions
{
    public static void ConfigureAuth(this IServiceCollection services, IConfiguration configuration)
    {
        var authConfig = configuration
            .GetSection(AuthConfig.Name)
            .Get<AuthConfig>();

        var defaultScheme = "defaultScheme";

        var authBuilder = services.AddAuthentication(options =>
        {
            options.DefaultScheme = defaultScheme;
            options.DefaultChallengeScheme = defaultScheme;
        });

        authBuilder.AddJwtBearer(AuthConfig.AuthSchemeName, options =>
        {
            // TODO move url to configuration
            options.MetadataAddress = $"{authConfig.Authority}/.well-known/openid-configuration";
            options.Authority = authConfig.Authority;
            options.RequireHttpsMetadata = true;
            options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters()
            {
                ValidateAudience = true,
                ValidAudiences = authConfig.Audiences,
                ValidateIssuer = true,
                ValidIssuers = new[] { authConfig.Issuer },
                ValidateIssuerSigningKey = true,
                RequireExpirationTime = true,
                ValidateLifetime = true,
                RequireSignedTokens = true,
            };
        });

        authBuilder.AddPolicyScheme(defaultScheme, defaultScheme, options =>
        {
            options.ForwardDefaultSelector = context =>
            {
                return AuthConfig.AuthSchemeName;
            };
        });
    }
}
