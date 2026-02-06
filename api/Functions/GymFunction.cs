using Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace Functions;

public class GymFunction(Repository repository, ILogger<GymFunction> logger)
{
    private readonly ILogger<GymFunction> _logger = logger;
    private readonly Repository _repository = repository;

    [Function("Gym-GetAll")]
    public IActionResult GetAll([HttpTrigger(AuthorizationLevel.Function, "get", Route = "Gym")] HttpRequest req)
    {
        try
        {
            var gyms = _repository.All<Gym>();
            return new JsonResult(gyms, Global.DefaultJsonSerializeSettings);
        } 
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gym-GetAll C# HTTP trigger function encoutered an error.");
            return new BadRequestObjectResult(new { error = ex.Message });
        }
    }


    [Function("Gym-Insert")]
    public IActionResult Insert([HttpTrigger(AuthorizationLevel.Function, "post", Route = "Gym")] HttpRequest req, Gym gym)
    {
        try
        {
            var result = _repository.Insert(gym);
            return new JsonResult(result != null, Global.DefaultJsonSerializeSettings);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Gym-Insert C# HTTP trigger function encoutered an error.");
            return new BadRequestObjectResult(new { error = ex.Message });
        }
    }

}