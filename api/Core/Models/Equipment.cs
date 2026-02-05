namespace Core;

public class Equipment : BaseEntity
{
    public required string Name { get; set; }
    public required string Icon { get; set; }

    public List<Gym> Gyms { get; set; } = new();
}
