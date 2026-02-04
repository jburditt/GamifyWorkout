using System.ComponentModel.DataAnnotations.Schema;

namespace Core;

public class WorkoutLog
{
    [ForeignKey("Schedule.Id")]
    public Guid ScheduleId { get; set; }

    [ForeignKey("Exercise.Id")]
    public Guid ExerciseId { get; set; }

    public DateOnly Date { get; set; }

    public int Sets { get; set; }
    public int Reps { get; set; }
    public double Weight { get; set; }
}
