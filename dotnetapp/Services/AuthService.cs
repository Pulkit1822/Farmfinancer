using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using dotnetapp.Data;
using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _db;
        private readonly IConfiguration _configuration;
        private readonly PasswordHasher<User> _passwordHasher;

        public AuthService(ApplicationDbContext db, IConfiguration configuration)
        {
            _db = db;
            _configuration = configuration;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task<(int, string)> Registration(User model, string role)
        {
            var existingUser = await _db.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
            if (existingUser != null)
            {
                return (0, "User already exists");
            }

            // Hash the password before saving!
            model.Password = _passwordHasher.HashPassword(model, model.Password);
            model.UserRole = role;

            _db.Users.Add(model);
            await _db.SaveChangesAsync();

            return (1, "User registered successfully");
        }

        public async Task<(int, string, User)> Login(LoginModel model)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
        if (user == null)
        {
            return (0, string.Empty, null);
        }

        var result = _passwordHasher.VerifyHashedPassword(user, user.Password, model.Password);
        if (result == PasswordVerificationResult.Failed)
        {
            return (0, string.Empty, null);
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.UserRole),
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim("userId", user.UserId.ToString()),
            new Claim("username", user.Username ?? string.Empty)
        };

        var token = GenerateToken(claims);

        return (1, token, user);
    }

        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var secretKey = _configuration["Jwt:Key"];
            if (string.IsNullOrEmpty(secretKey))
                throw new InvalidOperationException("JWT Key is not configured in appsettings.json");

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddHours(24),
                signingCredentials: credentials
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }

}

