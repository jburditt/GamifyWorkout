using Core;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

[ApiExplorerSettings(IgnoreApi = true)]
public class UsersController : ODataController
{
    private readonly IDbContextFactory<EfDbContext> _contextFactory;

    public UsersController(IDbContextFactory<EfDbContext> contextFactory)
    {
        _contextFactory = contextFactory;
    }

    [EnableQuery]
    [HttpGet]
    public ActionResult<IQueryable<User>> Get()
    {
        var context = _contextFactory.CreateDbContext();
        var users = context.Users.AsQueryable();
        return Ok(users);
    }

    [HttpGet("{id}")]
    public ActionResult<User> Get(Guid id)
    {
        var context = _contextFactory.CreateDbContext();
        var user = context.Users.FirstOrDefault(u => u.Id == id);
        return Ok(user);
    }

    [HttpPost]
    public ActionResult<User> Post([FromBody] User user)
    {
        var context = _contextFactory.CreateDbContext();
        context.Users.Add(user);
        context.SaveChanges();
        return Created(user);
    }
}