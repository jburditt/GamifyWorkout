using Core;
using Microsoft.EntityFrameworkCore;

namespace Database
{
    public class EfDbContext : DbContext
    {
        public DbSet<User> Users { get; set; }

        public EfDbContext(DbContextOptions<EfDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {

            modelBuilder.ApplyConfiguration(new UserConfiguration());
        }
    }
}
