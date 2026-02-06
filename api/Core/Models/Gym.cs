using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core;

public class Gym : BaseEntity
{
    [ForeignKey("User.Id")]
    public Guid UserId { get; set; }
    public required string Name { get; set; }

    [JsonIgnore]
    public List<Equipment> Equipment { get; set; } = new();
}
