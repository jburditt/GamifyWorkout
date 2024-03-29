﻿using AutoMapper;
using Core;
using Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Security.Principal;

namespace Api
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterServices(this IServiceCollection services, IConfiguration configuration)
        {
            // database
            services.AddDbContextFactory<EfDbContext>(options => options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            // authentication
            services.AddHttpContextAccessor();
            services.AddTransient<IPrincipal>(provider => provider.GetService<IHttpContextAccessor>()?.HttpContext?.User);

            // blob storage
            services.AddSingleton<IStorageService>(provider => new AzureBlobStorageService(configuration, "workouts"));

            // mapping service
            services.AddSingleton<IMappingService, AutoMapperService>();
            services.AddSingleton(new MapperConfiguration(cfg => { })
                .CreateMapper()
            );
        }

        public static void AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(swaggerGenOptions =>
            {
                // TODO add api versioning to configuration
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
                            // TODO move this to configuration
                            .WithOrigins("https://localhost:4200")
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
            });
        }

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
}
