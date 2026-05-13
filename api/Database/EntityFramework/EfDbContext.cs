using Core;
using Microsoft.EntityFrameworkCore;

namespace Database;

public class EfDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Gym> Gyms { get; set; }
    public DbSet<Exercise> Exercises { get; set; }
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

            // Equipment seed code generated from SPECS/exercises.csv
            context.Set<Equipment>().ExecuteDelete();
            var equipment = new Equipment[14];
            equipment[0] = context.Set<Equipment>().Add(new Equipment { Icon = "dumbbells", Name = "Dumbbells" }).Entity;
            equipment[1] = context.Set<Equipment>().Add(new Equipment { Icon = "bench", Name = "Bench" }).Entity;
            equipment[2] = context.Set<Equipment>().Add(new Equipment { Icon = "resistbands", Name = "Resistance Bands" }).Entity;
            equipment[3] = context.Set<Equipment>().Add(new Equipment { Icon = "stabilityball", Name = "Stability Ball" }).Entity;
            equipment[4] = context.Set<Equipment>().Add(new Equipment { Icon = "barbell", Name = "Bar" }).Entity;
            equipment[5] = context.Set<Equipment>().Add(new Equipment { Icon = "cabletower", Name = "Cable Tower" }).Entity;
            equipment[6] = context.Set<Equipment>().Add(new Equipment { Icon = "ezbar", Name = "EZ Bar" }).Entity;
            equipment[7] = context.Set<Equipment>().Add(new Equipment { Icon = "mat", Name = "Mat" }).Entity;
            equipment[8] = context.Set<Equipment>().Add(new Equipment { Icon = "pullupbar", Name = "Pull-up Bar" }).Entity;
            equipment[9] = context.Set<Equipment>().Add(new Equipment { Icon = "shortbar", Name = "Short Bar" }).Entity;
            equipment[10] = context.Set<Equipment>().Add(new Equipment { Icon = "step", Name = "Step" }).Entity;
            equipment[11] = context.Set<Equipment>().Add(new Equipment { Icon = "thandle", Name = "T-Handle" }).Entity;
            equipment[12] = context.Set<Equipment>().Add(new Equipment { Icon = "weightplate", Name = "Weight Plate" }).Entity;
            equipment[13] = context.Set<Equipment>().Add(new Equipment { Icon = "wristroller", Name = "Wrist Roller" }).Entity;

            // Exercise seed code generated from SPECS/exercises.csv
            // Uses equipment[index] references from the seeded equipment array.

            context.Set<Exercise>().ExecuteDelete();

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Plank",
                Description = "Plank",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Partial-Split Squat",
                Description = "Partial-Split Squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Biceps Curl With Straight Bar",
                Description = "Biceps Curl With Straight Bar",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Decline barbell bench press",
                Description = "Decline barbell bench press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell shoulder press",
                Description = "Barbell shoulder press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell Row",
                Description = "Dumbbell Row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Hip extension with bent knee",
                Description = "Hip extension with bent knee",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[7],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Lunge + bicep curl",
                Description = "Lunge + bicep curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                SecondaryMuscleGroup = MuscleGroup.Arms,
                SecondaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Side Plank",
                Description = "Side Plank",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Step-up",
                Description = "Step-up",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Bicep curl dumbbells",
                Description = "Bicep curl dumbbells",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Decline dumbbell bench press",
                Description = "Decline dumbbell bench press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Seated front dumbbell shoulder press",
                Description = "Seated front dumbbell shoulder press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-arm cable row",
                Description = "One-arm cable row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Clean pull",
                Description = "Clean pull",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "High-Thigh Extensions",
                Description = "High-Thigh Extensions",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Squat Press",
                Description = "Squat Press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating seated biceps curl with band",
                Description = "Alternating seated biceps curl with band",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Decline band fly",
                Description = "Decline band fly",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable side deltoid raise",
                Description = "Cable side deltoid raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating grip chin-up",
                Description = "Alternating grip chin-up",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[8],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell duck squat",
                Description = "Barbell duck squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "T-Pushup",
                Description = "T-Pushup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Lunge Front raise",
                Description = "Lunge Front raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Double seated biceps curl with band",
                Description = "Double seated biceps curl with band",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dips",
                Description = "Dips",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell side deltoid raise",
                Description = "Dumbbell side deltoid raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Chin-up",
                Description = "Chin-up",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[8],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Two-hand dumbbell clean",
                Description = "Two-hand dumbbell clean",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Bicycle Manuever",
                Description = "Bicycle Manuever",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "PU jack + Knee jump curl",
                Description = "PU jack + Knee jump curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating standing biceps curl with band",
                Description = "Alternating standing biceps curl with band",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Flat barbell bench press",
                Description = "Flat barbell bench press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Incline side deltoid raise",
                Description = "Incline side deltoid raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-arm dumbbell row",
                Description = "One-arm dumbbell row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-arm dumbbell snatch",
                Description = "One-arm dumbbell snatch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Ab Rotation",
                Description = "Ab Rotation",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell hack squat",
                Description = "Barbell hack squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable curl with straight bar",
                Description = "Cable curl with straight bar",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Flat dumbbell bench press",
                Description = "Flat dumbbell bench press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Band side deltoid raise",
                Description = "Band side deltoid raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-arm tubing row",
                Description = "One-arm tubing row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating lunge",
                Description = "Alternating lunge",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Ball Forward Crunch",
                Description = "Ball Forward Crunch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell squat",
                Description = "Barbell squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable curl with ez bar",
                Description = "Cable curl with ez bar",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[6],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Flat band fly",
                Description = "Flat band fly",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell upright row",
                Description = "Barbell upright row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Pull-up",
                Description = "Pull-up",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[8],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Lateral lunge",
                Description = "Lateral lunge",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable crunch",
                Description = "Cable crunch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Stepup",
                Description = "Stepup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable concentration curl",
                Description = "Cable concentration curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Incline barbell benchpress",
                Description = "Incline barbell benchpress",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable upright row",
                Description = "Cable upright row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[11],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Pulldown",
                Description = "Pulldown",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Stationary lunge/Split squat",
                Description = "Stationary lunge/Split squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable curlup",
                Description = "Cable curlup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Bulgarian split squat",
                Description = "Bulgarian split squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell Concentration Curl",
                Description = "Dumbbell Concentration Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Incline dumbbell bench press",
                Description = "Incline dumbbell bench press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell upright row",
                Description = "Dumbbell upright row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable pullover",
                Description = "Cable pullover",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Walking lunge",
                Description = "Walking lunge",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable side bend",
                Description = "Cable side bend",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell squat",
                Description = "Dumbbell squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Band concentration curl",
                Description = "Band concentration curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Incline band fly",
                Description = "Incline band fly",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Seated dumbbell bent laterals",
                Description = "Seated dumbbell bent laterals",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Seated row",
                Description = "Seated row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Double leg supine hip lift on floor",
                Description = "Double leg supine hip lift on floor",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable side crunch",
                Description = "Cable side crunch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Front squat",
                Description = "Front squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating Seated Dumbbell Curl",
                Description = "Alternating Seated Dumbbell Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Floor pushup",
                Description = "Floor pushup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Standing bent over lateral raise with band",
                Description = "Standing bent over lateral raise with band",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell T-bar row",
                Description = "Barbell T-bar row",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Romanian deadlift",
                Description = "Romanian deadlift",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Curlup",
                Description = "Curlup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Lateral barbell squat",
                Description = "Lateral barbell squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Double Seated Dumbbell Curl",
                Description = "Double Seated Dumbbell Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-hand pushup",
                Description = "One-hand pushup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell shrug",
                Description = "Barbell shrug",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Row with tubing",
                Description = "Row with tubing",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Snatch pull",
                Description = "Snatch pull",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Glutes,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell Side Bend",
                Description = "Dumbbell Side Bend",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Lateral stepup",
                Description = "Lateral stepup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating Standing Dumbbell Curl",
                Description = "Alternating Standing Dumbbell Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Stability ball pushup",
                Description = "Stability ball pushup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable shrug",
                Description = "Cable shrug",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Back hyperextension",
                Description = "Back hyperextension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Elbow Bridge",
                Description = "Elbow Bridge",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Partial-Split Squat",
                Description = "Partial-Split Squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Double Standing Dumbbell Curl",
                Description = "Double Standing Dumbbell Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "T pushup",
                Description = "T pushup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell shrug",
                Description = "Dumbbell shrug",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Deadlift",
                Description = "Deadlift",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Forward ball roll",
                Description = "Forward ball roll",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Single leg squat",
                Description = "Single leg squat",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating Seated Hammer Curl",
                Description = "Alternating Seated Hammer Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Pike to Inc. Pushup",
                Description = "Pike to Inc. Pushup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable neck flexion",
                Description = "Cable neck flexion",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-arm dumbbell deadlift between the legs",
                Description = "One-arm dumbbell deadlift between the legs",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Hanging knee raise",
                Description = "Hanging knee raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[8],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Stiff-leg deadlift",
                Description = "Stiff-leg deadlift",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Double Seated Hammer Curl",
                Description = "Double Seated Hammer Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Ball pushup",
                Description = "Ball pushup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Chest,
                PrimaryMuscle = Muscle.Chest,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Weighted neck lateral flexion",
                Description = "Weighted neck lateral flexion",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Romanian deadlift",
                Description = "Romanian deadlift",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Hanging knee crossover",
                Description = "Hanging knee crossover",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[8],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Supine leg curl on stability ball",
                Description = "Supine leg curl on stability ball",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating Standing Hammer Curl",
                Description = "Alternating Standing Hammer Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Weighted neck extension",
                Description = "Weighted neck extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Shoulders,
                PrimaryMuscle = Muscle.Shoulders,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[12],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Stiff leg deadlift",
                Description = "Stiff leg deadlift",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Hanging leg raise",
                Description = "Hanging leg raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[8],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Tubing leg curl",
                Description = "Tubing leg curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Double Standing Hammer Curl",
                Description = "Double Standing Hammer Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Good morning",
                Description = "Good morning",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Hip Raise",
                Description = "Hip Raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Heel raise",
                Description = "Heel raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[10],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Alternating Incline Dumbbell Curl",
                Description = "Alternating Incline Dumbbell Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Reverse back hyperextension",
                Description = "Reverse back hyperextension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Hip Roll",
                Description = "Hip Roll",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One leg foot balance",
                Description = "One leg foot balance",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Double Incline Dumbbell Curl",
                Description = "Double Incline Dumbbell Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Toe touch",
                Description = "Toe touch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Back,
                PrimaryMuscle = Muscle.Lats,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Jackknife Knee to Chest",
                Description = "Jackknife Knee to Chest",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Single leg heel raise",
                Description = "Single leg heel raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[10],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Band incline curl",
                Description = "Band incline curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Long arm crunch",
                Description = "Long arm crunch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell seated heel raise",
                Description = "Barbell seated heel raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell Reverse-Grip Curl",
                Description = "Barbell Reverse-Grip Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Lying Leg Raise",
                Description = "Lying Leg Raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Ankle flexion with tubing",
                Description = "Ankle flexion with tubing",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable reverse-grip curl",
                Description = "Cable reverse-grip curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Negative situp",
                Description = "Negative situp",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Ankle flexion with weight plate",
                Description = "Ankle flexion with weight plate",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[12],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Close-grip bench press",
                Description = "Close-grip bench press",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-arm rotation",
                Description = "One-arm rotation",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Heel walk",
                Description = "Heel walk",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Legs,
                PrimaryMuscle = Muscle.Quadriceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dips",
                Description = "Dips",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-legged anterior reach",
                Description = "One-legged anterior reach",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable kickback",
                Description = "Cable kickback",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Reverse Crunch",
                Description = "Reverse Crunch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Single-arm dumbbell kickback",
                Description = "Single-arm dumbbell kickback",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Rowing Crunch",
                Description = "Rowing Crunch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Single-Arm Dumbbell Lying Cross-Shoulder Triceps Extension",
                Description = "Single-Arm Dumbbell Lying Cross-Shoulder Triceps Extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Russian Twist",
                Description = "Russian Twist",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell Decline Lying Triceps Extension",
                Description = "Barbell Decline Lying Triceps Extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Russian twist on ball",
                Description = "Russian twist on ball",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell Incline Lying Triceps Extension",
                Description = "Barbell Incline Lying Triceps Extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Side-Lying Hip Lift",
                Description = "Side-Lying Hip Lift",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell Lying Triceps Extension",
                Description = "Barbell Lying Triceps Extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Stability ball crunch",
                Description = "Stability ball crunch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[3],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable lying triceps extension",
                Description = "Cable lying triceps extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Straight-Arm Bar Rollout",
                Description = "Straight-Arm Bar Rollout",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Double Dumbbell Lying Triceps Extension",
                Description = "Double Dumbbell Lying Triceps Extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Trunk Rotation",
                Description = "Trunk Rotation",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Seated One-Arm Dumbbell Triceps Extension",
                Description = "Seated One-Arm Dumbbell Triceps Extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Trunk rotation with cable",
                Description = "Trunk rotation with cable",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Band lying triceps extension",
                Description = "Band lying triceps extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Trunk Twist",
                Description = "Trunk Twist",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "One-arm cable triceps extension",
                Description = "One-arm cable triceps extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Trunk Twist With Dumbbells",
                Description = "Trunk Twist With Dumbbells",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell Seated Overhead Triceps Extension",
                Description = "Barbell Seated Overhead Triceps Extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Vertical Leg Crunch",
                Description = "Vertical Leg Crunch",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell Seated Overhead Triceps Extension",
                Description = "Dumbbell Seated Overhead Triceps Extension",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Weight Curlup",
                Description = "Weight Curlup",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable pushdown",
                Description = "Cable pushdown",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[9],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Wood chop",
                Description = "Wood chop",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Reverse-grip cable pushdown",
                Description = "Reverse-grip cable pushdown",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[9],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Sit-ups",
                Description = "Sit-ups",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Core,
                PrimaryMuscle = Muscle.Abs,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Reverse Dip",
                Description = "Reverse Dip",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell Forearm Curl",
                Description = "Barbell Forearm Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[4],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable forearm curl",
                Description = "Cable forearm curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell Forearm Curl",
                Description = "Dumbbell Forearm Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Band forearm curl",
                Description = "Band forearm curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Barbell Reverse Forearm Curl",
                Description = "Barbell Reverse Forearm Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Cable reverse forearm curl",
                Description = "Cable reverse forearm curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[5],
                    equipment[1],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Dumbbell Reverse Forearm Curl",
                Description = "Dumbbell Reverse Forearm Curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Band reverse forearm curl",
                Description = "Band reverse forearm curl",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[1],
                    equipment[2],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Reverse Wrist Raise",
                Description = "Reverse Wrist Raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Wrist Raise",
                Description = "Wrist Raise",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[0],
                }
            });

            context.Set<Exercise>().Add(new Exercise
            {
                Name = "Wrist roller",
                Description = "Wrist roller",
                Icon = "exercise.png",
                PrimaryMuscleGroup = MuscleGroup.Arms,
                PrimaryMuscle = Muscle.Biceps,
                EquipmentNeeded = new List<Equipment>
                {
                    equipment[13],
                }
            });

            context.Set<Gym>().ExecuteDelete();
            var gymId = context.Set<Gym>().Add(new Gym { Name = "Home", UserId = userId.Value }).Entity.Id;
            context.Set<Gym>().Add(new Gym { Name = "Globe Fitness", UserId = userId.Value });

            context.Set<GymEquipment>().ExecuteDelete();
            context.Set<GymEquipment>().Add(new GymEquipment { EquipmentId = equipment[0].Id, GymId = gymId });
            context.Set<GymEquipment>().Add(new GymEquipment { EquipmentId = equipment[1].Id, GymId = gymId });
            context.Set<GymEquipment>().Add(new GymEquipment { EquipmentId = equipment[2].Id, GymId = gymId });
            context.Set<GymEquipment>().Add(new GymEquipment { EquipmentId = equipment[3].Id, GymId = gymId });

            context.SaveChanges();
        });
    }
}

