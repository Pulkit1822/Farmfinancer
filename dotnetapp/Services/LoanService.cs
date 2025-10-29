using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using dotnetapp.Data;
using dotnetapp.Models;
using dotnetapp.Exceptions;

namespace dotnetapp.Services
{
    public class LoanService
    {
        private readonly ApplicationDbContext _context;

        public LoanService(ApplicationDbContext context){
            _context = context;
        }

        public async Task<IEnumerable<Loan>> GetAllLoans(){
            return await _context.Loans.ToListAsync();
        }

        public async Task<Loan> GetLoanById(int loanId){
            return await _context.Loans.FindAsync(loanId);
        }

        public async Task<bool> AddLoan(Loan loan){
            // if (await _context.Loans.AnyAsync(l => l.LoanType == loan.LoanType))
            // {
            //     throw new LoanException("Loan with the same type already exists");
            // }

            _context.Loans.Add(loan);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateLoan(int loanId, Loan loan)
        {
            var existingLoan = await _context.Loans.FindAsync(loanId);
            if (existingLoan == null)
                return false;

            // if (await _context.Loans.AnyAsync(l => l.LoanType == loan.LoanType && l.LoanId != loanId))
            // {
            //     throw new LoanException("Loan of same type already exists");
            // }

            existingLoan.LoanType = loan.LoanType;
            existingLoan.MaximumAmount = loan.MaximumAmount;
            existingLoan.InterestRate = loan.InterestRate;
            existingLoan.Description = loan.Description;
            existingLoan.RepaymentTenure = loan.RepaymentTenure;
            existingLoan.Eligibility = loan.Eligibility;
            existingLoan.DocumentsRequired = loan.DocumentsRequired;

            

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteLoan(int loanId)
        {
            var loan = await _context.Loans.FindAsync(loanId);
            if (loan == null)
                return false;

            bool isReferenced = await _context.LoanApplications.AnyAsync(app => app.LoanId == loanId);
            if (isReferenced)
            {
                throw new LoanException("Loan cannot be deleted as it is referenced in LoanApplication");
            }

            _context.Loans.Remove(loan);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}