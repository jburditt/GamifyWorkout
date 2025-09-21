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
        public ActionResult<bool> Insert(Guid gymId, [FromBody] Guid[] equipmentIds)
        {
            var context = _contextFactory.CreateDbContext();
            foreach (var equipmentId in equipmentIds)
            {
                context.GymEquipment.Add(new GymEquipment { EquipmentId = equipmentId, GymId = gymId });
            }
            return context.SaveChanges() > 0;
        }
    }
}
