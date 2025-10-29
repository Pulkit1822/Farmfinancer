using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace dotnetapp.Models
{
    public class Loan
    {
        public int LoanId{get;set;}
        public string LoanType{get;set;}
        public string Description {get;set;}
        public decimal InterestRate {get;set;}
        public decimal MaximumAmount {get;set;}
        public int RepaymentTenure {get;set;}
        public string Eligibility {get;set;}
        public string DocumentsRequired {get;set;}
    }
}