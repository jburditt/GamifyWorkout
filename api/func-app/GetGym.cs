using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;

namespace GamifyWorkout.Api;

public class GetGym
{
    private readonly ILogger<GetGym> _logger;

    public GetGym(ILogger<GetGym> logger)
    {
        _logger = logger;
    }

    [Function("Gym")]
    public IActionResult Run([HttpTrigger(AuthorizationLevel.Function, "get")] HttpRequest req)
    {
        _logger.LogInformation("C# HTTP trigger function processed a request.");
        var jsonData = new object[2] {
          new {
              userId = "faef4826-9a4d-46c9-dc4d-08de6355c315",
              name = "Home",
              id = "6c2b6a60-1ff2-477c-e50a-08de6355c31e"
          },
          new {
              userId = "faef4826-9a4d-46c9-dc4d-08de6355c315",
              name = "Globe Fitness",
              id = "3349a116-ad1d-4290-e50b-08de6355c31e"
          }
        };
        return new JsonResult(jsonData);
    }
}