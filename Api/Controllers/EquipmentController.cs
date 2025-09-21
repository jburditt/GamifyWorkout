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
    }
}
