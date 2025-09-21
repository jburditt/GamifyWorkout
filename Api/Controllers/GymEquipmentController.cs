using Core;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class GymEquipmentController : ControllerBase
    {
        private readonly IDbContextFactory<EfDbContext> _contextFactory;

        public GymEquipmentController(IDbContextFactory<EfDbContext> contextFactory)
        {
            _contextFactory = contextFactory;
        }

        [HttpPost("{gymId}")]
        [Produces("application/json")]
        public ActionResult Insert(Guid gymId, [FromBody] Guid[] equipment)
        {
            return Ok();
        }
    }
}
