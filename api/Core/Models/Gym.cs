using System.ComponentModel.DataAnnotations.Schema;

namespace Core;

public class Gym : BaseEntity
{
    [ForeignKey("User.Id")]
    public Guid UserId { get; set; }
    public required string Name { get; set; }

    public List<Equipment> Equipment { get; set; } = new();
}
