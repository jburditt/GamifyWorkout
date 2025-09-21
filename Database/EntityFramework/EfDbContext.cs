using Core;
using Microsoft.EntityFrameworkCore;

namespace Database
{
    public class EfDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Gym> Gyms { get; set; }
        public DbSet<GymEquipment> GymEquipment { get; set; }
        public DbSet<Equipment> Equipment { get; set; }

        public EfDbContext(DbContextOptions<EfDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSeeding((context, _) =>
            {
                context.Set<User>().ExecuteDelete();
                context.Set<User>().Add(new User { Email = "jburditt@mailinator.com", FirstName = "Jebb", LastName = "Burditt", Username = "jburditt" });

                context.Set<Equipment>().ExecuteDelete();
                context.Set<Equipment>().Add(new Equipment { Icon = "dumbbells", Name = "Dumbbells" });
                context.Set<Equipment>().Add(new Equipment { Icon = "bench", Name = "Bench" });
                context.Set<Equipment>().Add(new Equipment { Icon = "resistbands", Name = "Resistance Bands" });
                context.Set<Equipment>().Add(new Equipment { Icon = "stabilityball", Name = "Stability Ball" });

                context.SaveChanges();
            });
        }
    }
}
