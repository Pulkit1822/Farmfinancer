using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
 
namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api")]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;
 
        public AuthenticationController(IAuthService authService)
        {
            _authService = authService;
        }
 
        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model)
        {
            try
            {
                var result = await _authService.Login(model);
               
                if (result.Item1 == 0)
                {
                    return BadRequest(new { message = result.Item2 });
                }
 
                return Ok(new {
                    Status = "Success",
                    token = result.Item2
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
 
        [HttpPost("register")]
        public async Task<IActionResult> Register(User model)
        {
            try
            {
                var result = await _authService.Registration(model, model.UserRole);
               
                if (result.Item1 == 0)
                {
                    return BadRequest(new { message = result.Item2 });
                }
 
                return Ok(new { message = result.Item2 });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}