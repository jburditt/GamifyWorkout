//using AutoMapper;
//using Core;
//using Core.Interfaces;
using Database;
using Microsoft.EntityFrameworkCore;

namespace Api
{
    public static class ServiceCollectionExtensions
    {
        public static void RegisterServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContextFactory<EfDbContext>(options =>
                options.UseSqlServer(configuration.GetConnectionString("DefaultConnection")));

            //services.AddSingleton<IMappingService, AutoMapperService>();
            //var mapper = new MapperConfiguration(cfg =>
            //{

            //});
            //services.AddSingleton(mapper.CreateMapper());

            //services.AddSingleton<IStorageService>(provider =>
            //{
            //    var configuration = provider.GetRequiredService<IConfiguration>();
            //    var containerName = "uploads"; // Adjust as needed
            //    return new AzureBlobStorageService(configuration, containerName);
            //});
        }
    }
}
