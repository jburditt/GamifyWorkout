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

        [HttpDelete("{gymId}/{equipmentId}")]
        [Produces("application/json")]
        public ActionResult<bool> Delete(Guid gymId, Guid equipmentId)
        {
            var context = _contextFactory.CreateDbContext();
            context.GymEquipment
                .Where(ge => ge.GymId == gymId && ge.EquipmentId == equipmentId)
                .ExecuteDelete();
            return context.SaveChanges() > 0;
        }
    }
}
