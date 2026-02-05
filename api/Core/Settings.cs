
//using Microsoft.Extensions.Configuration;

using System.Xml.Linq;

namespace Core;

public interface Settings
{
    public DatabaseSettings Database { get; }
    //public IConfiguration Configuration { get; }
    //public IHostEnvironment Environment { get; }
    //public bool IsProduction { get; }
    //public bool IsDevelopment { get; }
}

public struct DatabaseSettings(string? accountName, string connectionString)
{
    public string? AccountName { get; } = accountName;
    public string ConnectionString { get; } = connectionString;
}

