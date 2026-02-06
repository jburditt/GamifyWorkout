using Core;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class EquipmentController(Repository repository) : ControllerBase
    {
        private readonly Repository _repository = repository;

        [HttpGet]
        [Produces("application/json")]
        public ActionResult<List<Equipment>> GetAll()
        {
            var equipment = _repository.All<Equipment>();
            return Ok(equipment);
        }

        [HttpGet("{id}")]
        [Produces("application/json")]
        public ActionResult<List<Equipment>> GetByGym(Guid id)
        {
            var equipment = _repository.Get<Gym>(id, g => g.Equipment)
                .Equipment;
            return Ok(equipment);
        }
    }
}
