using Core;
using Microsoft.EntityFrameworkCore;

namespace Database;

public class EfDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Gym> Gyms { get; set; }
    public DbSet<GymEquipment> GymEquipment { get; set; }
    public DbSet<Equipment> Equipment { get; set; }
    public DbSet<WorkoutLog> WorkoutLog { get; set; }
    public DbSet<Schedule> Schedule { get; set; }

    public EfDbContext(DbContextOptions<EfDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        //modelBuilder.Entity<Schedule>().Property(p => p.MuscleGroupFilter).HasConversion(
        //    v => string.Join(',', v),
        //    v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).Select(s => Enum.Parse<MuscleGroup>(s)).ToList()
        //);

        modelBuilder.Entity<WorkoutLog>().HasKey(wl => new { wl.ScheduleId, wl.ExerciseId, wl.Date });

        modelBuilder.Entity<Gym>().HasMany(g => g.Equipment)
            .WithMany(e => e.Gyms)
            .UsingEntity<GymEquipment>(
                j => j.HasOne<Equipment>().WithMany().HasForeignKey(ge => ge.EquipmentId),
                j => j.HasOne<Gym>().WithMany().HasForeignKey(ge => ge.GymId),
                j => { j.HasKey(t => new { t.GymId, t.EquipmentId }); });
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSeeding((context, _) =>
        {
            context.Set<User>().ExecuteDelete();
            var userId = context.Set<User>().Add(new User { Email = "jburditt@mailinator.com", FirstName = "Jebb", LastName = "Burditt", Username = "jburditt" })
                .Entity.Id;

            context.Set<Equipment>().ExecuteDelete();
            var equipmentId = new Guid[4];
            equipmentId[0] = context.Set<Equipment>().Add(new Equipment { Icon = "dumbbells", Name = "Dumbbells" }).Entity.Id;
            equipmentId[1] = context.Set<Equipment>().Add(new Equipment { Icon = "bench", Name = "Bench" }).Entity.Id;
            equipmentId[2] = context.Set<Equipment>().Add(new Equipment { Icon = "resistbands", Name = "Resistance Bands" }).Entity.Id;
            equipmentId[3] = context.Set<Equipment>().Add(new Equipment { Icon = "stabilityball", Name = "Stability Ball" }).Entity.Id;

            context.Set<Gym>().ExecuteDelete();
            var gymId = context.Set<Gym>().Add(new Gym { Name = "Home", UserId = userId.Value }).Entity.Id;
            context.Set<Gym>().Add(new Gym { Name = "Globe Fitness", UserId = userId.Value });

            context.Set<GymEquipment>().ExecuteDelete();
            context.Set<GymEquipment>().Add(new GymEquipment { EquipmentId = equipmentId[0], GymId = gymId });
            context.Set<GymEquipment>().Add(new GymEquipment { EquipmentId = equipmentId[1], GymId = gymId });
            context.Set<GymEquipment>().Add(new GymEquipment { EquipmentId = equipmentId[2], GymId = gymId });
            context.Set<GymEquipment>().Add(new GymEquipment { EquipmentId = equipmentId[3], GymId = gymId });

            context.SaveChanges();
        });
    }
}

