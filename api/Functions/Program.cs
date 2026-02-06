using Core;
using Database;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

var connectionString = Environment.GetEnvironmentVariable("SqlDbConnectionString");

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights()
    // TODO figure out why this doesn't work and remove static Global.DefaultJsonSerializeSettings
    .Configure<JsonSerializerOptions>(options =>
    {
        options.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    })
    .AddDbContextFactory<EfDbContext>(options => options.UseSqlServer(connectionString))
    .AddTransient<Repository, EFRepository>();
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    var context = services.GetRequiredService<EfDbContext>();
//    context.Database.Migrate();
//}

builder.Build().Run();

public static class Global
{
    public static JsonSerializerOptions DefaultJsonSerializeSettings = new JsonSerializerOptions 
    { 
        ReferenceHandler = ReferenceHandler.IgnoreCycles, 
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
    };
}