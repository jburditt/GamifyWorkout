using Microsoft.AspNetCore.Mvc;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class EntityController : ControllerBase
    {
        public EntityController()
        {
        }

        // TODO automate this step with reflection
        [Route("getentity")]
        [HttpGet]
        public async Task<IActionResult> GetEntity(string entityName)
        {
            // TODO complete by returning this from metadata service
            return Ok(@"      ""User"": {
                ""type"": ""object"",
                ""properties"": {
                  ""id"": {
                    ""type"": ""string"",
                    ""format"": ""uuid"",
                    ""display"": ""OAuth Id""
                  },
                  ""firstName"": {
                    ""type"": ""string"",
                    ""nullable"": true
                  },
                  ""lastName"": {
                    ""type"": ""string"",
                    ""nullable"": true
                  },
                  ""username"": {
                    ""type"": ""string"",
                    ""nullable"": true
                  },
                  ""email"": {
                    ""type"": ""string"",
                    ""nullable"": true
                  }
                },
                ""additionalProperties"": false
              }");
        }
    }
}
