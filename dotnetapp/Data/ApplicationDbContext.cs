using Microsoft.EntityFrameworkCore;
using dotnetapp.Models; 

namespace dotnetapp.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

    public DbSet<User> Users { get; set; }
        public DbSet <Loan> Loans { get; set; }
        public DbSet <LoanApplication> LoanApplications { get; set; }
        public DbSet <Feedback> Feedbacks { get; set; }
    }
}

