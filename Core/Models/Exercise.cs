using System.Text.Json.Serialization;

namespace Core;

public class Exercise : BaseEntity
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required string Icon { get; set; }
    public MuscleGroup PrimaryMuscleGroup { get; set; }
    public Muscle PrimaryMuscle { get; set; }
    public MuscleGroup? SecondaryMuscleGroup { get; set; }
    public Muscle? SecondaryMuscle { get; set; }
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum MuscleGroup
{
    Any,
    Arms,
    Back,
    Cardio,
    Chest,
    Core,
    Legs,
    Shoulders
}

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum Muscle
{
    Abs,
    Abductors,
    Adductors,
    Biceps,
    Calves,
    Chest,
    Forearms,
    Glutes,
    Hamstrings,
    Lats,
    LowerBack,
    MiddleBack,
    Neck,
    Quadriceps,
    Shoulders,
    Traps,
    Triceps
}