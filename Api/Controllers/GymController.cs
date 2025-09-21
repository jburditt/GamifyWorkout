using Core;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class GymController : ControllerBase
    {
        private readonly IDbContextFactory<EfDbContext> _contextFactory;

        public GymController(IDbContextFactory<EfDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        [HttpGet]
        [Produces("application/json")]
        public ActionResult<List<Gym>> Get()
        {
            var context = _contextFactory.CreateDbContext();
            var gyms = context.Gyms
                // TODO get userId from Claims
                .Where(g => g.UserId == new Guid("113C9AA8-F4C3-4DE7-2FCE-08DDF89CDBF6"))
                .ToList();
            return Ok(gyms);
        }

        [HttpGet("{id}/equipment")]
        [Produces("application/json")]
        public ActionResult<List<Equipment>> GetEquipment(Guid gymId)
        {
            var context = _contextFactory.CreateDbContext();
            var equipment = (
                from e in context.Equipment
                join ge in context.GymEquipment on e.Id equals ge.EquipmentId
                where ge.GymId == gymId
                select e)
                .ToList();
            return Ok(equipment);
        }

        [HttpPost]
        [Produces("application/json")]
        public bool Post([FromBody] Gym gym)
        {
            var context = _contextFactory.CreateDbContext();
            context.Gyms.Add(gym);
            return context.SaveChanges() > 0;
        }
    }
}
