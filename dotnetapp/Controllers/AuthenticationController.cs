using dotnetapp.Models;
using dotnetapp.Data;
using dotnetapp.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using log4net;
using System.Reflection;

namespace dotnetapp.Controllers{
    [ApiController]
    [Route("api")]
    public class AuthenticationController : ControllerBase{
        private readonly IAuthService _authService;
        private readonly ApplicationDbContext _context;
        private readonly ILogService logger;

        public AuthenticationController(ApplicationDbContext context, IAuthService authService, ILogService logger)
        {
            _authService = authService;
            _context = context;
            this.logger = logger;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginModel model){
        logger.LogUserAction(200, model.Email, "Login attempt initiated");

        try{
        var result = await _authService.Login(model);
        if (result.Item1 == 0)
        {
            logger.LogUserAction(401, model.Email, "Login failed", "fail");
            return BadRequest(new { Message = result.Item2 });
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
        
        if (user == null){
            logger.LogUserAction(404, model.Email, "User record not found post-login");
            return BadRequest(new { Message = "User details not found." });
        }

        logger.LogUserAction(200, model.Email, "Login successful");

        return Ok(new{
            token = result.Item2,
            User = new{
                UserId = user.UserId,
                Email = user.Email,
                Username = user.Username,
                MobileNumber = user.MobileNumber,
                UserRole = user.UserRole
                }
            });
        }
        catch (Exception ex){
            logger.LogUserAction(500, model.Email, "Login failed due to server error", "fail");
            return StatusCode(500, new { Message = "An unexpected error occurred. Please try again later." });
        }   
    }



        [HttpPost("register")]
        public async Task<IActionResult> Register(User model)
        {
            logger.LogUserAction(200, model.Email, "Registration attempt initiated");

            try{
                if (!ModelState.IsValid)
                {
                    logger.LogUserAction(400, model.Email, "Registration failed due to invalid input", "fail");
                    return BadRequest(ModelState);
                }

                if (await _context.Users.AnyAsync(u => u.Email == model.Email))
                {
                    logger.LogUserAction(409, model.Email, "Registration failed - email already exists", "fail");
                    return BadRequest(new { Message = "Email already exists. Please use a different email." });
                }

                if (await _context.Users.AnyAsync(u => u.MobileNumber == model.MobileNumber))
                {
                    logger.LogUserAction(409, model.Email, "Registration failed - mobile number already exists", "fail");
                    return BadRequest(new { Message = "Mobile number already exists. Please use a different number." });
                }

                if (await _context.Users.AnyAsync(u => u.Username == model.Username))
                {
                    logger.LogUserAction(409, model.Email, "Registration failed - username already exists", "fail");
                    return BadRequest(new { Message = "Username already exists. Please choose a different username." });
                }

                var result = await _authService.Registration(model, model.UserRole);
                if (result.Item1 != 1)
                {
                    logger.LogUserAction(result.Item1, model.Email, "Registration failed - service returned error", "fail");
                    return StatusCode(result.Item1, new { Message = result.Item2 });
                }

                logger.LogUserAction(201, model.Email, "Registration successful");
                return Ok(new { Message = result.Item2 });
            }

            catch (Exception ex)
            {
                logger.LogUserAction(500, model.Email, "Registration failed due to server error", "fail");
                return StatusCode(500, new { Message = "An unexpected error occurred. Please try again later." });
            }
        }
    }
}