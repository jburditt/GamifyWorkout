using Core;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api;

[Route("api/[controller]")]
[ApiController]
public class GymController(Repository repository) : ControllerBase
{
    private readonly Repository _repository = repository;


    [HttpGet]
    [Produces("application/json")]
    public ActionResult<List<Gym>> Get()
    {
        var gyms = _repository.All<Gym>()
            // TODO get userId from Claims
            //.Where(g => g.UserId == new Guid("113C9AA8-F4C3-4DE7-2FCE-08DDF89CDBF6"))
            .ToList();
        return Ok(gyms);
    }

    [HttpPost]
    [Produces("application/json")]
    public bool Post([FromBody] Gym gym)
    {
        //var result = _repository.Insert(gym);
        //return result;
        return false;
    }
}

