// using dotnetapp.Models;
// using dotnetapp.Data;
// using dotnetapp.Services;
// using Microsoft.EntityFrameworkCore;
// using Microsoft.AspNetCore.Mvc;
// using log4net;
// using System.Reflection;

// namespace dotnetapp.Controllers{
//     [ApiController]
//     [Route("api")]
//     public class AuthenticationController : ControllerBase{
//         private readonly IAuthService _authService;
//         private readonly ApplicationDbContext _context;
//         private readonly ILogService logger;

//         public AuthenticationController(ApplicationDbContext context, IAuthService authService, ILogService logger)
//         {
//             _authService = authService;
//             _context = context;
//             this.logger = logger;
//         }

//         [HttpPost("login")]
//         public async Task<IActionResult> Login(LoginModel model){
//         logger.LogUserAction(200, model.Email, "Login attempt initiated");

//         try{
//         var result = await _authService.Login(model);
//         if (result.Item1 == 0)
//         {
//             logger.LogUserAction(401, model.Email, "Login failed", "fail");
//             return BadRequest(new { Message = result.Item2 });
//         }
//         var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
        
//         if (user == null){
//             logger.LogUserAction(404, model.Email, "User record not found post-login");
//             return BadRequest(new { Message = "User details not found." });
//         }

//         logger.LogUserAction(200, model.Email, "Login successful");

//         return Ok(new{
//             token = result.Item2,
//             User = new{
//                 UserId = user.UserId,
//                 Email = user.Email,
//                 Username = user.Username,
//                 MobileNumber = user.MobileNumber,
//                 UserRole = user.UserRole
//                 }
//             });
//         }
//         catch (Exception ex){
//             logger.LogUserAction(500, model.Email, "Login failed due to server error", "fail");
//             return StatusCode(500, new { Message = "An unexpected error occurred. Please try again later." });
//         }   
//     }



//         [HttpPost("register")]
//         public async Task<IActionResult> Register(User model)
//         {
//             logger.LogUserAction(200, model.Email, "Registration attempt initiated");

//             try{
//                 if (!ModelState.IsValid)
//                 {
//                     logger.LogUserAction(400, model.Email, "Registration failed due to invalid input", "fail");
//                     return BadRequest(ModelState);
//                 }

//                 if (await _context.Users.AnyAsync(u => u.Email == model.Email))
//                 {
//                     logger.LogUserAction(409, model.Email, "Registration failed - email already exists", "fail");
//                     return BadRequest(new { Message = "Email already exists. Please use a different email." });
//                 }

//                 if (await _context.Users.AnyAsync(u => u.MobileNumber == model.MobileNumber))
//                 {
//                     logger.LogUserAction(409, model.Email, "Registration failed - mobile number already exists", "fail");
//                     return BadRequest(new { Message = "Mobile number already exists. Please use a different number." });
//                 }

//                 if (await _context.Users.AnyAsync(u => u.Username == model.Username))
//                 {
//                     logger.LogUserAction(409, model.Email, "Registration failed - username already exists", "fail");
//                     return BadRequest(new { Message = "Username already exists. Please choose a different username." });
//                 }

//                 var result = await _authService.Registration(model, model.UserRole);
//                 if (result.Item1 != 1)
//                 {
//                     logger.LogUserAction(result.Item1, model.Email, "Registration failed - service returned error", "fail");
//                     return StatusCode(result.Item1, new { Message = result.Item2 });
//                 }

//                 logger.LogUserAction(201, model.Email, "Registration successful");
//                 return Ok(new { Message = result.Item2 });
//             }

//             catch (Exception ex)
//             {
//                 logger.LogUserAction(500, model.Email, "Registration failed due to server error", "fail");
//                 return StatusCode(500, new { Message = "An unexpected error occurred. Please try again later." });
//             }
//         }
//     }
// }

 
// using Microsoft.AspNetCore.Mvc;
// using dotnetapp.Models;
// using dotnetapp.Services;
// using System.Text;
// using System.Text.Json;
// namespace dotnetapp.Controllers
// {
//     [Route("api")]
//     [ApiController]
//     public class AuthenticationController : ControllerBase
//     {
//         private readonly IAuthService _authService;
//         private readonly ILogger<AuthenticationController> _logger;
//         public AuthenticationController(IAuthService authService, ILogger<AuthenticationController> logger)
//         {
//             _authService = authService;
//             _logger = logger;
//         }
//         [HttpPost("login")]
//         public async Task<IActionResult> Login()
//         {
//             try
//             {
//                 using var reader = new StreamReader(Request.Body);
//                 var body = await reader.ReadToEndAsync();
//                 var jsonDoc = JsonDocument.Parse(body);
//                 if (!jsonDoc.RootElement.TryGetProperty("data", out var dataElement))
//                 {
//                     return BadRequest(new { message = "Missing 'data' field in request" });
//                 }
//                 string encodedData = dataElement.GetString();
//                 string decodedJson = Encoding.UTF8.GetString(Convert.FromBase64String(encodedData));
//                 var loginModel = JsonSerializer.Deserialize<LoginModel>(decodedJson);
//                 if (loginModel == null || !TryValidateModel(loginModel))
//                 {
//                     return BadRequest(new { message = "Invalid login data" });
//                 }
//                 var (status, message) = await _authService.Login(loginModel);
//                 if (status == 0)
//                 {
//                     return BadRequest(new { message });
//                 }
//                 _logger.LogInformation("User logged in successfully: {Email}", loginModel.Email);
//                 return Ok(new { token = message });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error occurred during login");
//                 return StatusCode(500, new { message = ex.Message });
//             }
//         }
//         [HttpPost("register")]
//         public async Task<IActionResult> Register()
//         {
//             try
//             {
//                 using var reader = new StreamReader(Request.Body);
//                 var body = await reader.ReadToEndAsync();
//                 var jsonDoc = JsonDocument.Parse(body);
//                 if (!jsonDoc.RootElement.TryGetProperty("data", out var dataElement))
//                 {
//                     return BadRequest(new { message = "Missing 'data' field in request" });
//                 }
//                 string encodedData = dataElement.GetString();
//                 string decodedJson = Encoding.UTF8.GetString(Convert.FromBase64String(encodedData));
//                 var userModel = JsonSerializer.Deserialize<User>(decodedJson);
//                 if (userModel == null || !TryValidateModel(userModel))
//                 {
//                     return BadRequest(new { message = "Invalid registration data" });
//                 }
//                 var (status, message) = await _authService.Registration(userModel, userModel.UserRole);
//                 if (status == 0)
//                 {
//                     return BadRequest(new { message });
//                 }
//                 _logger.LogInformation("User registered successfully: {Email}", userModel.Email);
//                 return Ok(new { message });
//             }
//             catch (Exception ex)
//             {
//                 _logger.LogError(ex, "Error occurred during registration");
//                 return StatusCode(500, new { message = ex.Message });
//             }
//         }
//     }
// }

using Microsoft.AspNetCore.Mvc;
using dotnetapp.Models;
using dotnetapp.Services;
using System.Text;
using System.Text.Json;

namespace dotnetapp.Controllers
{
    [Route("api")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly IAuthService _authService;
        private readonly ILogger<AuthenticationController> _logger;

        public AuthenticationController(IAuthService authService, ILogger<AuthenticationController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("login")]
public async Task<IActionResult> Login()
{
    try
    {
        using var reader = new StreamReader(Request.Body);
        var body = await reader.ReadToEndAsync();
        var jsonDoc = JsonDocument.Parse(body);

        if (!jsonDoc.RootElement.TryGetProperty("data", out var dataElement))
        {
            return BadRequest(new { message = "Missing 'data' field in request" });
        }

        string encodedData = dataElement.GetString();
        string decodedJson = Encoding.UTF8.GetString(Convert.FromBase64String(encodedData));
        var loginModel = JsonSerializer.Deserialize<LoginModel>(decodedJson);

        if (loginModel == null || !TryValidateModel(loginModel))
        {
            return BadRequest(new { message = "Invalid login data" });
        }

        var (status, token, user) = await _authService.Login(loginModel);

        if (status == 0 || string.IsNullOrEmpty(token) || user == null)
        {
            return BadRequest(new { message = "Login failed" });
        }

        _logger.LogInformation("User logged in successfully: {Email}", loginModel.Email);

        return Ok(new { token, User = user });
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error occurred during login");
        return StatusCode(500, new { message = ex.Message });
    }
}


        [HttpPost("register")]
        public async Task<IActionResult> Register()
        {
            try
            {
                using var reader = new StreamReader(Request.Body);
                var body = await reader.ReadToEndAsync();
                var jsonDoc = JsonDocument.Parse(body);

                if (!jsonDoc.RootElement.TryGetProperty("data", out var dataElement))
                {
                    return BadRequest(new { message = "Missing 'data' field in request" });
                }

                string encodedData = dataElement.GetString();
                string decodedJson = Encoding.UTF8.GetString(Convert.FromBase64String(encodedData));
                var userModel = JsonSerializer.Deserialize<User>(decodedJson);

                if (userModel == null || !TryValidateModel(userModel))
                {
                    return BadRequest(new { message = "Invalid registration data" });
                }

                var (status, message) = await _authService.Registration(userModel, userModel.UserRole);

                if (status == 0)
                {
                    return BadRequest(new { message });
                }

                _logger.LogInformation("User registered successfully: {Email}", userModel.Email);
                return Ok(new { message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during registration");
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}