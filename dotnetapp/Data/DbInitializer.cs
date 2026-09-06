using dotnetapp.Models;
using Microsoft.AspNetCore.Identity;

namespace dotnetapp.Data
{
    public static class DbInitializer
    {
        public static void SeedData(ApplicationDbContext context)
        {
            var hasher = new PasswordHasher<User>();

            // Seed Admin user if not exists
            if (!context.Users.Any(u => u.Email == "admin@farmfinancer.com"))
            {
                var admin = new User
                {
                    Email = "admin@farmfinancer.com",
                    Username = "Admin",
                    MobileNumber = "9876543210",
                    UserRole = "Admin"
                };
                admin.Password = hasher.HashPassword(admin, "Admin@123");
                context.Users.Add(admin);
            }

            // Seed Test Farmer user if not exists
            if (!context.Users.Any(u => u.Email == "farmer@farmfinancer.com"))
            {
                var farmer = new User
                {
                    Email = "farmer@farmfinancer.com",
                    Username = "Farmer",
                    MobileNumber = "9876543211",
                    UserRole = "User"
                };
                farmer.Password = hasher.HashPassword(farmer, "User@123");
                context.Users.Add(farmer);
            }

            // Seed Sample Loans if not exists
            if (!context.Loans.Any())
            {
                context.Loans.AddRange(
                    new Loan
                    {
                        LoanType = "Kisan Crop Loan",
                        Description = "Short-term financial support for seeds, fertilizers, crop maintenance, and seasonal cultivation.",
                        InterestRate = 7.00m,
                        MaximumAmount = 500000.00m,
                        RepaymentTenure = 12,
                        Eligibility = "Active farmers holding land ownership records or tenant farming contracts.",
                        DocumentsRequired = "Aadhaar Card, Land Records (7/12 extract), Bank Passbook"
                    },
                    new Loan
                    {
                        LoanType = "Tractor & Farm Machinery Loan",
                        Description = "Financing for purchasing new or certified pre-owned tractors, harvesters, and modern agricultural equipment.",
                        InterestRate = 8.50m,
                        MaximumAmount = 1200000.00m,
                        RepaymentTenure = 60,
                        Eligibility = "Minimum 2 acres of cultivable agricultural land.",
                        DocumentsRequired = "ID Proof, Quotation from Authorized Dealer, Land Registration"
                    },
                    new Loan
                    {
                        LoanType = "Drip Irrigation & Solar Pump Loan",
                        Description = "Subsidized green finance for installing micro-irrigation systems, solar water pumps, and borewells.",
                        InterestRate = 6.00m,
                        MaximumAmount = 350000.00m,
                        RepaymentTenure = 36,
                        Eligibility = "Farmers with verifiable agricultural water source and farm plot.",
                        DocumentsRequired = "Aadhaar, Electricity/Water bill, Dealer Quotation"
                    },
                    new Loan
                    {
                        LoanType = "Dairy & Livestock Development Loan",
                        Description = "Credit for purchasing cattle, constructing modern livestock sheds, and milk processing gear.",
                        InterestRate = 7.50m,
                        MaximumAmount = 400000.00m,
                        RepaymentTenure = 36,
                        Eligibility = "Experience in animal husbandry or small dairy farming.",
                        DocumentsRequired = "ID Proof, Cattle Health Certificate, Bank Statement"
                    }
                );
            }

            context.SaveChanges();
        }
    }
}
