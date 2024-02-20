using Api;
using Core;
using Database;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.ModelBuilder;

var builder = WebApplication.CreateBuilder(args);

// odata
var odataRootPath = $"api/v1/odata";
var modelBuilder = new ODataConventionModelBuilder();
modelBuilder.EntitySet<User>("Users");
var edmModel = modelBuilder
    .EnableLowerCamelCase()
    .GetEdmModel();
builder.Services
    .AddControllers()
    .AddOData(options => options.EnableQueryFeatures(100).AddRouteComponents(odataRootPath, edmModel));

var corsPolicyName = "MyAllowedCorsOrigins";
builder.Services.AddCorsPolicy(corsPolicyName);
builder.Services.RegisterServices(builder.Configuration);
builder.Services.ConfigureAuth(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwagger();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors(corsPolicyName);
app.UseAuthentication();
app.UseMiddleware<UsersMiddleware>();
app.UseAuthorization();

app.MapControllers();
app.MapFallbackToFile("/index.html");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<EfDbContext>();
    context.Database.Migrate();
}

app.Run();
