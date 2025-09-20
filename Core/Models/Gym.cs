using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace Core;

public class Gym : BaseEntity
{
    [ForeignKey("User.Id")]
    [JsonIgnore]
    public Guid UserId { get; set; }
    public required string Name { get; set; }
}
