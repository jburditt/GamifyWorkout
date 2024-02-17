using AutoMapper;
using Core;
using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

namespace Api
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextFactory<EfDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            services.AddSingleton<IStorageService>(provider => new AzureBlobStorageService(configuration, "workouts"));

            services.AddSingleton<IMappingService, AutoMapperService>();
            services.AddSingleton(new MapperConfiguration(cfg => { })
                .CreateMapper()
            );
        }

        public static void AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(swaggerGenOptions =>
            {
                swaggerGenOptions.SwaggerDoc("v1", new OpenApiInfo { Title = "Api", Version = "v1" });
            });
        }

        public static void AddCorsPolicy(this IServiceCollection services, string corsPolicyName)
        {
            services.AddCors(options =>
            {
                options.AddPolicy(
                    corsPolicyName,
                    policy =>
                    {
                        policy
                            .WithOrigins("http://localhost:4200")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });
        }

        public static void ConfigureAuthentication(this IServiceCollection services, IConfiguration configuration)
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
}
