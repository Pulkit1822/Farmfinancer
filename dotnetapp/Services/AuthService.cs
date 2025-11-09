using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using dotnetapp.Data;
using dotnetapp.Models;
 
namespace dotnetapp.Services
{
    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;
 
        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
 
        public async Task<(int, string)> Registration(User model, string role)
        {
            var userExists = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
           
            if (userExists != null)
            {
                return (0, "User already exists");
            }
 
            model.UserRole = role;
            _context.Users.Add(model);
            await _context.SaveChangesAsync();
 
            return (1, "User registered successfully");
        }
 
        public async Task<(int, string)> Login(LoginModel model)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == model.Email);
           
            if (user == null)
            {
                return (0, "Invalid email");
            }
 
            if (user.Password != model.Password)
            {
                return (0, "Invalid password");
            }
 
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.UserRole),
                new Claim("UserId", user.UserId.ToString())
            };
 
            var token = GenerateToken(claims);
            return (1, token);
        }
 
        private string GenerateToken(IEnumerable<Claim> claims)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
 
            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddHours(24),
                signingCredentials: credentials
            );
 
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
 