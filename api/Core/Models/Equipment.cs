using System.Text.Json.Serialization;

namespace Core;

public class Equipment : BaseEntity
{
    public required string Name { get; set; }
    public required string Icon { get; set; }

    [JsonIgnore]
    public List<Gym> Gyms { get; set; } = new();
}
