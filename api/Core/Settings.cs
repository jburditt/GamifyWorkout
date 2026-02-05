
//using Microsoft.Extensions.Configuration;

using System.Xml.Linq;

namespace Core;

public interface Settings
{
    public DatabaseSettings Database { get; }
    public FileStorageSettings FileStore { get; }
    //public IConfiguration Configuration { get; }
    //public IHostEnvironment Environment { get; }
    //public bool IsProduction { get; }
    //public bool IsDevelopment { get; }
}

public struct DatabaseSettings(string connectionString)
{
    public string ConnectionString { get; } = connectionString;
}

public struct FileStorageSettings(string connectionString)
{
    public string ConnectionString { get; } = connectionString;
}