using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using dotnetapp.Models;
using dotnetapp.Services;
using Microsoft.AspNetCore.Authorization;

namespace dotnetapp.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoanController : ControllerBase
    {
        private readonly LoanService _loanService;

    public LoanController(LoanService loanService)
        {
            _loanService = loanService;
        }

    [HttpGet]
        public async Task<ActionResult<IEnumerable<Loan>>> GetAllLoans()
        {
            try
            {
                var loans = await _loanService.GetAllLoans();
                return Ok(loans);
            }
            catch
            {
                return StatusCode(500, "An error occurred while retrieving loans.");
            }
        }

    [HttpGet("{loanId}")]
        public async Task<ActionResult<Loan>> GetLoanById(int loanId)
        {
            try
            {
                var loan = await _loanService.GetLoanById(loanId);
                if (loan == null)
                    return NotFound("Cannot find any loan");
                return Ok(loan);
            }
            catch
            {
                return StatusCode(500, "An error occurred while retrieving the loan.");
            }
        }

    [HttpPost]
    [Authorize(Roles = "Admin")]
        public async Task<ActionResult> AddLoan([FromBody] Loan loan)
        {
            try
            {
                var success = await _loanService.AddLoan(loan);
                if (success)
                    return Ok("Loan added successfully");
                return StatusCode(500, "Failed to add loan");
            }
            catch
            {
                return StatusCode(500, "An error occurred while adding the loan.");
            }
        }

    [HttpPut("{loanId}")]
        public async Task<ActionResult> UpdateLoan(int loanId, [FromBody] Loan loan)
        {
            try
            {
                var success = await _loanService.UpdateLoan(loanId, loan);
                if (success)
                    return Ok("Loan updated successfully");
                return NotFound("Cannot find any loan");
            }
            catch
            {
                return StatusCode(500, "An error occurred while updating the loan.");
            }
        }

    [HttpDelete("{loanId}")]
        public async Task<ActionResult> DeleteLoan(int loanId)
        {
            try
            {
                var success = await _loanService.DeleteLoan(loanId);
                if (success)
                    return Ok("Loan deleted successfully");
                return NotFound("Cannot find any loan");
            }
            catch
            {
                return StatusCode(500, "An error occurred while deleting the loan.");
            }
        }
    }
}
