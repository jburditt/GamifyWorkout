using Core;
using Microsoft.AspNetCore.Mvc;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class GymEquipmentController(Repository repository) : ControllerBase
    {
        private readonly Repository _repository = repository;

        [HttpPost("{gymId}")]
        [Produces("application/json")]
        public ActionResult<bool> Insert(Guid gymId, [FromBody] Guid[] equipmentIds)
        {
            foreach (var equipmentId in equipmentIds)
            {
                _repository.Insert(new GymEquipment { EquipmentId = equipmentId, GymId = gymId });
            }
            return true;
        }

        [HttpDelete("{gymId}/{equipmentId}")]
        [Produces("application/json")]
        public ActionResult<bool> Delete(Guid gymId, Guid equipmentId)
        {
            var result = _repository.Delete<GymEquipment>(p => p.GymId == gymId && p.EquipmentId == equipmentId);
            return result > 0;
        }
    }
}
