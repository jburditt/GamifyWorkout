using Core;
using Microsoft.EntityFrameworkCore;

namespace Database;

public class CosmosDbContext : EfDbContext
{
    private readonly Settings _settings;

    public CosmosDbContext(Settings appSettings, DbContextOptions<EfDbContext> options) : base(options) 
    { 
        _settings = appSettings;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseCosmos(_settings.Database.ConnectionString, _settings.Database.AccountName);

        base.OnConfiguring(optionsBuilder);
    }
}

