using Core;
using Microsoft.EntityFrameworkCore;

namespace Database
{
    public class EfDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Gym> Gyms { get; set; }

        public EfDbContext(DbContextOptions<EfDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSeeding((context, _) =>
            {
                if (!context.Set<User>().Any(u => u.Username == "jburditt"))
                {
                    context
                        .Set<User>()
                        .Add(new User { Email = "jburditt@mailinator.com", FirstName = "Jebb", LastName = "Burditt", Username = "jburditt" });
                }
                context.SaveChanges();
            });
        }
    }
}
