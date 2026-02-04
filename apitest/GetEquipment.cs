using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace GamifyWorkout.Api;

public class GetEquipment
{
    private readonly ILogger<GetEquipment> _logger;

    public GetEquipment(ILogger<GetEquipment> logger)
    {
        _logger = logger;
    }

    [Function("Equipment")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Equipment/{id}")] HttpRequest req, string id)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request for equipment ID: {Id}", id);
        var jsonData = new object[4] {
    new {
        name = "Dumbbells",
        icon = "dumbbells",
        id = "4bce2e81-83f1-461a-556a-08de6355c31c"
    },
    new {
        name = "Bench",
        icon = "bench",
        id = "5aa4f62f-13af-4fca-556b-08de6355c31c"
    },
    new {
        name = "Resistance Bands",
        icon = "resistbands",
        id = "b8a3de66-3765-4268-556c-08de6355c31c"
    },
    new {
        name = "Stability Ball",
        icon = "stabilityball",
        id = "912d0cfb-cef1-40a5-556d-08de6355c31c"
    }
        };
        return new JsonResult(jsonData);
    }
}