using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using dotnetapp.Models;
 
namespace dotnetapp.Services
{
    public interface IAuthService
    {
        Task<(int, string)>Registration(User model, string role);
        Task<(int status, string token, User user)> Login(LoginModel loginModel);
        // string GenerateToken(IEnumerable<Claim> claims);
    }
}
 