Can you parse this file and create a SQL script file with insert statements for each exercise. Row 1 has the headers and can be ignored. Column A, F, K, P, U, Z, AD, AH contain the exercise name, each different column is a different muscle group.
Column B, G, L, Q, V, AA, AE, AI contain the exercise equipment needed.

Create C# code to seed Entity Framework for the Api backend project. An example of the Equipment seed code:

```csharp
context.Set<Equipment>().ExecuteDelete();
var equipment = new Guid[4];
equipment[0] = context.Set<Equipment>().Add(new Equipment { Icon = "dumbbells", Name = "Dumbbells" }).Entity;
equipment[1] = context.Set<Equipment>().Add(new Equipment { Icon = "bench", Name = "Bench" }).Entity;
equipment[2] = context.Set<Equipment>().Add(new Equipment { Icon = "resistbands", Name = "Resistance Bands" }).Entity;
equipment[3] = context.Set<Equipment>().Add(new Equipment { Icon = "stabilityball", Name = "Stability Ball" }).Entity;
equipment[4] = context.Set<Equipment>().Add(new Equipment { Icon = "barbell", Name = "Bar" }).Entity;
```

First create the seeded equipment needed that is not in the above example.

Then create the seeded exercises, the 'EquipmentNeeded' property should use the saved entity variables from seeded the equipment e.g.

```csharp
context.Set<Exercise>().Add(new Exercise
{
    Name = "Biceps Curl With Straight Bar",
    Description = "Biceps Curl With Straight Bar",
    Icon = "exercise.png",
    PrimaryMuscleGroup = MuscleGroup.Arms,
    PrimaryMuscle = Muscle.Biceps,
    EquipmentNeeded = new List<Equipment>
    {
        equipment[4],
    }
});
```
