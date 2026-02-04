using System.ComponentModel.DataAnnotations.Schema;

namespace Core;

public class GymEquipment : BaseEntity
{
    [ForeignKey("Gym.Id")]
    public Guid GymId { get; set; }

    [ForeignKey("Equipment.Id")]
    public Guid EquipmentId { get; set; }
}
