using Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Functions;

public class GymEquipmentFunction(Repository repository, ILogger<GymEquipment> logger)
{
    private readonly ILogger<GymEquipment> _logger = logger;
    private readonly Repository _repository = repository;

    [Function("GymEquipment-Insert")]
    public async Task<IActionResult> GetAll([HttpTrigger(AuthorizationLevel.Function, "post", Route = "GymEquipment/{gymId}")] HttpRequest req, [FromBody] Guid[] equipmentIds, Guid gymId)
    {
        try
        {
            // [FromBody] parameter doesn't work, so load the parameter by force
            if (equipmentIds == null)
                equipmentIds = await req.ReadFromJsonAsync<Guid[]>();
            foreach (var equipmentId in equipmentIds)
            {
                _repository.Insert(new GymEquipment { EquipmentId = equipmentId, GymId = gymId });
            }
            return new JsonResult(true, Global.DefaultJsonSerializeSettings);
        } 
        catch (Exception ex)
        {
            _logger.LogError(ex, "GymEquipment-Insert C# HTTP trigger function encoutered an error.");
            return new BadRequestObjectResult(new { error = ex.Message });
        }
    }


    [Function("GymEquipment-Delete")]
    public IActionResult Delete([HttpTrigger(AuthorizationLevel.Function, "delete", Route = "GymEquipment/{gymId}/{equipmentId}")] HttpRequest req, Guid gymId, Guid equipmentId)
    {
        try
        {
            var result = _repository.Delete<GymEquipment>(p => p.GymId == gymId && p.EquipmentId == equipmentId);
            return new JsonResult(result != null, Global.DefaultJsonSerializeSettings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "GymEquipment-Delete C# HTTP trigger function encoutered an error.");
            return new BadRequestObjectResult(new { error = ex.Message });
        }
    }
}