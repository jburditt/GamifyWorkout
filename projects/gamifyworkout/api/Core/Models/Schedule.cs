using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core;

public class Schedule : BaseEntity
{
    [ForeignKey("User.Id")]
    [JsonIgnore]
    public Guid UserId { get; set; }

    // TODO this should be ICollection
    //[ForeignKey("Gym.Id")]
    //public Guid GymId { get; set; }

    public DateOnly Date { get; set; }
    // TODO normalize this for database, currently this maps to nvarchar e.q. '[2,3]'
    public List<MuscleGroup>? MuscleGroupFilter { get; set; }
    public ICollection<WorkoutLog>? Workouts { get; set; }
}
