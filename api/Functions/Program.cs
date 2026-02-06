using Core;
using Database;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

var builder = FunctionsApplication.CreateBuilder(args);

builder.ConfigureFunctionsWebApplication();

builder.Services
    .AddApplicationInsightsTelemetryWorkerService()
    .ConfigureFunctionsApplicationInsights();

builder.Services.AddDbContextFactory<EfDbContext>(options => options.UseSqlServer("Server=tcp:sql-gamifyworkout.database.windows.net,1433;Initial Catalog=sqldb-gamifyworkout;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;Authentication='Active Directory Default';"));
builder.Services.AddTransient<Repository, EFRepository>();
//using (var scope = app.Services.CreateScope())
//{
//    var services = scope.ServiceProvider;
//    var context = services.GetRequiredService<EfDbContext>();
//    context.Database.Migrate();
//}

builder.Build().Run();
