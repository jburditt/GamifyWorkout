using Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace GamifyWorkout.Api;

public class GetEquipment
{
    private readonly ILogger<GetEquipment> _logger;
    private readonly Repository _repository;

    public GetEquipment(Repository repository, ILogger<GetEquipment> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    [Function("Equipment")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Equipment/{id}")] HttpRequest req, string id)
    {
        var test = Environment.GetEnvironmentVariable("APPLICATIONINSIGHTS_CONNECTION_STRING");
        _logger.LogInformation("C# HTTP trigger function processed a request for Equipment Id: {Id}", test);
        var equipment = _repository.All<Equipment>();
        return new JsonResult(equipment);
    }
}