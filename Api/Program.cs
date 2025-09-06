using Api;
using Core;
using Database;
using Microsoft.AspNetCore.OData;
using Microsoft.AspNetCore.OData.Routing.Conventions;
using Microsoft.EntityFrameworkCore;
using Microsoft.OData.Edm;
using Microsoft.OData.Edm.Vocabularies;
using Microsoft.OData.ModelBuilder;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// odata
var odataRootPath = $"api/v1/odata";
builder.Services
    .AddControllers()
    .AddOData(options =>
    {
        options.Conventions.Remove(options.Conventions.OfType<MetadataRoutingConvention>().First());
        options.EnableQueryFeatures(100).AddRouteComponents(odataRootPath, GetEdmModel());
    });

var corsPolicyName = "MyAllowedCorsOrigins";
builder.Services.AddCorsPolicy(corsPolicyName);
builder.Services.RegisterServices(builder.Configuration);
builder.Services.ConfigureAuth(builder.Configuration);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.DocumentFilter<ODataDocumentFilter>();
});

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

static IEdmModel GetEdmModel()
{
    var modelBuilder = new ODataConventionModelBuilder();
    modelBuilder.EntitySet<User>("Users");
    var edmModel = modelBuilder
        .EnableLowerCamelCase()
        .GetEdmModel();

    // Add DisplayName annotations to the EDM
    //foreach (var edmType in edmModel.SchemaElements.OfType<EdmEntityType>())
    //{
    //    //var clrType = edmType.GetClrType();
    //    var clrType = Type.GetType($"{edmType.Namespace}.{edmType.Name}, Core");
    //    if (clrType != null)
    //    {
    //        foreach (var edmProperty in edmType.StructuralProperties())
    //        {
    //            var clrProperty = clrType.GetProperty(edmProperty.Name, BindingFlags.IgnoreCase | BindingFlags.Public | BindingFlags.Instance);
    //            if (clrProperty != null)
    //            {
    //                var displayAttribute = clrProperty.GetCustomAttribute<DisplayAttribute>();
    //                if (displayAttribute?.Name != null)
    //                {
    //                    var term = new EdmTerm("Display", "DisplayName", EdmCoreModel.Instance.GetString(true));
    //                    var annotation = new EdmVocabularyAnnotation(edmProperty, term, new EdmStringConstant(displayAttribute.Name));
    //                    if (edmModel is EdmModel mutableModel)
    //                    {
    //                        mutableModel.AddVocabularyAnnotation(annotation);
    //                    }
    //                }
    //            }
    //        }
    //    }
    //}

    return edmModel;
}