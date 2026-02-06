using Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Functions;

public class EquipmentFunction(Repository repository, ILogger<EquipmentFunction> logger)
{
    private readonly ILogger<EquipmentFunction> _logger = logger;
    private readonly Repository _repository = repository;


    [Function("Equipment-GetAll")]
    public IActionResult GetAll([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Equipment")] HttpRequest req)
    {
        try 
        { 
            _logger.LogInformation("C# HTTP trigger function processed a request for EquipmentFunction.GetAll");
            var equipment = _repository.All<Equipment>();
            return new JsonResult(equipment, Global.DefaultJsonSerializeSettings);
        } 
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gym-GetAll C# HTTP trigger function encoutered an error.");
            return new BadRequestObjectResult(new { error = ex.Message });
        }
    }

    [Function("Equipment-GetByGym")]
    public IActionResult GetByGym([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Equipment/{id}")] HttpRequest req, Guid id)
    {
        try
        {
            _logger.LogInformation("C# HTTP trigger function processed a request for EquipmentFunction.GetByGym Id: {Id}", id);
            var equipment = _repository.Get<Core.Gym>(id, g => g.Equipment)?
                .Equipment;
            return new JsonResult(equipment, Global.DefaultJsonSerializeSettings);
        } 
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gym-GetAll C# HTTP trigger function encoutered an error.");
            return new BadRequestObjectResult(new { error = ex.Message });
        }
    }
}