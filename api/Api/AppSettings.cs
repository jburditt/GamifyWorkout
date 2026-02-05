using Core;

namespace Api;

public class AppSettings : Settings
{
    public DatabaseSettings Database { get; private set; }
    //public IConfiguration Configuration { get; private set; }
    //public IHostEnvironment Environment { get; private set; }
    //public bool IsProduction => Environment.IsProduction();
    //public bool IsDevelopment => Environment.IsDevelopment();

    public AppSettings(IConfiguration configuration, IHostEnvironment environment)
    {
        configuration.GetConnectionString("DefaultConnection").ThrowIfNull();

        //Configuration = configuration;
        //Environment = environment;
        Database = new DatabaseSettings(configuration["Database:AccountName"]?.ToString(), configuration.GetConnectionString("DefaultConnection"));
    }
}

public static class AppSettingsExtensions
{
    public static AppSettings AddAppSettings(this IServiceCollection services, IWebHostEnvironment environment)
    {
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.json")
            .AddJsonFile($"appsettings.{environment.EnvironmentName}.json", optional: true)
            .AddUserSecrets<Program>()
            .AddEnvironmentVariables()
            .Build();
        services.AddSingleton<IConfiguration>(configuration);

        var appSettings = new AppSettings(configuration, environment);
        services.AddSingleton<Settings>(appSettings);
        return appSettings;
    }
}