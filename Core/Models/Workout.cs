using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core;

public class Workout : BaseEntity
{
    [ForeignKey("Exercise.Id")]
    [JsonIgnore]
    public Guid ExerciseId { get; set; }
    
    public required WorkoutLog WorkoutLog { get; set; }
}
