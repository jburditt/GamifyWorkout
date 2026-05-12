using Core;
using Database;
using Microsoft.AspNetCore.Mvc;

namespace Api;

[Route("api/[controller]")]
[ApiController]
public class ExerciseController : ControllerBase
{
    private readonly Repository _repository;

    public ExerciseController(Repository repository)
    {
        _repository = repository;
    }

    [HttpGet]
    [Produces("application/json")]
    public ActionResult<List<Exercise>> GetAll()
    {
        var exercises = _repository.All<Exercise>();
        return Ok(exercises);
    }
}