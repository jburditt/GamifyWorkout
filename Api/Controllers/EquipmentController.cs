using Core;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController : ControllerBase
    {
        private readonly IDbContextFactory<EfDbContext> _contextFactory;

        public EquipmentController(IDbContextFactory<EfDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        [HttpGet]
        [Produces("application/json")]
        public ActionResult<List<Equipment>> Get()
        {
            var context = _contextFactory.CreateDbContext();
            var equipment = context.Equipment.ToList();
            return Ok(equipment);
        }


        [HttpGet("{id}")]
        [Produces("application/json")]
        public ActionResult<List<Equipment>> GetByGym(Guid id)
        {
            var context = _contextFactory.CreateDbContext();
            var equipment = (
                from e in context.Equipment
                join ge in context.GymEquipment on e.Id equals ge.EquipmentId
                where ge.GymId == id
                select e)
                .ToList();
            return Ok(equipment);
        }
    }
}
