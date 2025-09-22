using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core;

public class Schedule : BaseEntity
{
    [ForeignKey("User.Id")]
    [JsonIgnore]
    public Guid UserId { get; set; }

    [ForeignKey("Gym.Id")]
    public Guid GymId { get; set; }

    public DateOnly Date { get; set; }
    public List<MuscleGroup>? MuscleGroupFilter { get; set; }
    public ICollection<WorkoutLog>? Workouts { get; set; }
}
