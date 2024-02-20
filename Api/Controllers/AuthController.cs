using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Principal;

namespace Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IPrincipal principal;

        public AuthController(IPrincipal principal)
        {
            this.principal = principal;
        }

        [Authorize]
        [Route("whoami")]
        [HttpGet]
        public async Task<UserResponse> GetUser()
        {
            return principal.GetUser();
        }

        [Route("logout")]
        [HttpGet]
        public async Task<IActionResult> Logout()
        {
            principal.Clear();
            return Ok();
        }
    }
}
