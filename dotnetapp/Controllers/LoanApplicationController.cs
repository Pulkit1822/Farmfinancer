using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using dotnetapp.Exceptions;

using dotnetapp.Models;
using dotnetapp.Services;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanApplicationController : ControllerBase
    {
        private readonly LoanApplicationService _loanApplicationService;

        public LoanApplicationController(LoanApplicationService loanApplicationService)
        {
            _loanApplicationService = loanApplicationService;
        }

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult<IEnumerable<LoanApplication>>> GetAllLoanApplications()
        {
            try
            {
                var applications = await _loanApplicationService.GetAllLoanApplications();
                return Ok(applications); // 200 OK with all loan applications
            }
            catch (Exception ex)
            {
                // Log error for diagnostics
                return StatusCode(500, ex.Message); // Internal Server Error
            }
        }

        [HttpGet("user/{userId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<LoanApplication>>> GetLoanApplicationsByUserId(int userId)
        {
            try
            {
                var applications = await _loanApplicationService.GetLoanApplicationsByUserId(userId);

                if (applications == null || !applications.Any())
                    return NotFound("Cannot find any loan application"); // 404 Not Found

                return Ok(applications); // 200 OK
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost]
        [Authorize]
        public async Task<ActionResult> AddLoanApplication([FromBody] LoanApplication loanApplication)
        {
            try
            {
                var result = await _loanApplicationService.AddLoanApplication(loanApplication);

                if (result)
                    return Ok("Loan application added successfully"); // 200 OK
                // Should not reach here - AddLoanApplication always throws exception on duplicate
                return BadRequest("Failed to add loan application");
            }
            catch (LoanException lex)
            {
                return BadRequest(lex.Message); // Business logic failure (duplicate)
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message); // Internal Server Error
            }
        }

        [HttpPut("{loanApplicationId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> UpdateLoanApplication(int loanApplicationId, [FromBody] LoanApplication loanApplication)
        {
            try
            {
                var result = await _loanApplicationService.UpdateLoanApplication(loanApplicationId, loanApplication);

                if (result)
                    return Ok("Loan application updated successfully"); // 200 OK
                return NotFound("Cannot find any loan application"); // 404 Not Found
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpDelete("{loanApplicationId}")]
        [Authorize(Roles = "Admin")]
        public async Task<ActionResult> DeleteLoanApplication(int loanApplicationId)
        {
            try
            {
                var result = await _loanApplicationService.DeleteLoanApplication(loanApplicationId);

                if (result)
                    return Ok("Loan application deleted successfully"); // 200 OK
                return NotFound("Cannot find any loan application"); // 404 Not Found
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
    }
}
