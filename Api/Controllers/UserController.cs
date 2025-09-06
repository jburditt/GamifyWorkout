using Core;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
public class UserController : ODataController
{
    private readonly IDbContextFactory<EfDbContext> _contextFactory;

    public UserController(IDbContextFactory<EfDbContext> contextFactory)
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
    [Produces("application/json")]
    public ActionResult<User> Get(Guid id)
    {
        var context = _contextFactory.CreateDbContext();
        var user = context.Users.FirstOrDefault(u => u.Id == id);
        return Ok(user);
    }

    [HttpPost]
    [Produces("application/json")]
    public bool Post([FromBody] User user)
    {
        var context = _contextFactory.CreateDbContext();
        context.Users.Add(user);
        context.SaveChanges();
        return true;
    }
}