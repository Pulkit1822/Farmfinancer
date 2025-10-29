using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Models;
using dotnetapp.Exceptions;
using dotnetapp.Data;



namespace dotnetapp.Services
{
    // public class LoanException : Exception
    // {
    //     public LoanException(string message) : base(message) { }
    // }

    public class LoanApplicationService
    {
        private readonly ApplicationDbContext _context;

    public LoanApplicationService(ApplicationDbContext context)
        {
            _context = context;
        }

    public async Task<IEnumerable<LoanApplication>> GetAllLoanApplications()
        {
            return await _context.LoanApplications.ToListAsync();
        }

    public async Task<IEnumerable<LoanApplication>> GetLoanApplicationsByUserId(int userId)
        {
            return await _context.LoanApplications
                .Where(la => la.UserId == userId)
                .ToListAsync();
        }

    public async Task<bool> AddLoanApplication(LoanApplication loanApplication)
        {
            // a. Check if the user already applied for this loan (LoanId + UserId)
            var exists = await _context.LoanApplications
                .AnyAsync(la => la.LoanId == loanApplication.LoanId && la.UserId == loanApplication.UserId);

    if (exists)
            {
                // b. Throw LoanException if already applied
                throw new LoanException("User already applied for this loan");
            }

    // c. Add the new application
            _context.LoanApplications.Add(loanApplication);

    // d. Save changes asynchronously
            await _context.SaveChangesAsync();

    // e. Return true for success
            return true;
        }

    public async Task<bool> UpdateLoanApplication(int loanApplicationId, LoanApplication loanApplication)
        {
            // a. Retrieve existing loan application
            var existing = await _context.LoanApplications.FindAsync(loanApplicationId);

    // b. If not found, return false
            if (existing == null)
                return false;

    // c. Update fields from provided object (copy necessary fields)
            existing.LoanId = loanApplication.LoanId;
            existing.UserId = loanApplication.UserId;
            existing.FarmLocation = loanApplication.FarmLocation;
            existing.FarmerAddress = loanApplication.FarmerAddress;
            existing.FarmSizeInAcres = loanApplication.FarmSizeInAcres;
            existing.FarmPurpose = loanApplication.FarmPurpose;
            existing.LoanStatus = loanApplication.LoanStatus;
            existing.SubmissionDate = loanApplication.SubmissionDate;
            existing.File = loanApplication.File;

    // d. Save changes
            await _context.SaveChangesAsync();

    // e. Return true for success
            return true;
        }

    public async Task<bool> DeleteLoanApplication(int loanApplicationId)
        {
            // a. Retrieve existing application
            var application = await _context.LoanApplications.FindAsync(loanApplicationId);

    // b. If not found, return false
            if (application == null)
                return false;

    // c. If found, delete
            _context.LoanApplications.Remove(application);

    // d. Save changes
            await _context.SaveChangesAsync();

    // e. Return true for success
            return true;
        }
    }
}
