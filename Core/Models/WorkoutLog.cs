using System.ComponentModel.DataAnnotations.Schema;

namespace Core;

public class WorkoutLog : BaseEntity
{
    [ForeignKey("Schedule.Id")]
    public Guid ScheduleId { get; set; }

    [ForeignKey("Exercise.Id")]
    public Guid ExerciseId { get; set; }

    [ForeignKey("Workout.Id")]
    public Guid WorkoutId { get; set; }

    public required WorkoutLogEntry WorkoutLogEntry { get; set; }
}
