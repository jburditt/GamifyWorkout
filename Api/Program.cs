using Api;
using Core;
using Database;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.ModelBuilder;

var builder = WebApplication.CreateBuilder(args);

Console.WriteLine($"Starting, Environment: {builder.Environment.EnvironmentName}");

// Create the service EDM model for OData
var modelBuilder = new ODataConventionModelBuilder();
modelBuilder.EntitySet<User>("Users");
var edmModel = modelBuilder
    .EnableLowerCamelCase()
    .GetEdmModel();
var odataRootPath = $"api/v1/odata";

builder.Services
    .AddControllers()
    .AddOData(options => options.EnableQueryFeatures(100).AddRouteComponents(odataRootPath, edmModel));

builder.Services.RegisterServices(builder.Configuration);

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

Console.WriteLine("EF Migrations starting");

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<EfDbContext>();
    context.Database.Migrate();
}

Console.WriteLine("EF Migrations complete");

app.Run();
