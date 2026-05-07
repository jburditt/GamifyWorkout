using Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Functions;

public class ScheduleFunction
{
    private readonly ILogger<ScheduleFunction> _logger;

    public ScheduleFunction(ILogger<ScheduleFunction> logger)
    {
        _logger = logger;
    }

    [Function("TodayMuscleFunction")]
    public IActionResult TodayMuscle([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Schedule/Today/Muscle")] HttpRequest req)
    {
        var result = new List<MuscleGroup>() { MuscleGroup.Arms, MuscleGroup.Back, MuscleGroup.Core };
        return new JsonResult(result, Global.DefaultJsonSerializeSettings);
    }

    [Function("TodayExerciseFunction")]
    public IActionResult TodayExercise([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Schedule/Today/Exercise")] HttpRequest req)
    {
        var exercise1 = new Exercise() { Description = "Bicycle Kick", Icon = "bicycle.png", Name = "Bicycle Kick", PrimaryMuscle = Muscle.Abs, PrimaryMuscleGroup = MuscleGroup.Core };
        var result = new List<Exercise>() { exercise1 };
        return new JsonResult(result, Global.DefaultJsonSerializeSettings);
    }
}