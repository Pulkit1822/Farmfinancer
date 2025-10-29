using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace dotnetapp.Exceptions
{
    public class LoanException:Exception
    {
        public LoanException(string message):base(message){
            
        }
        
    }
}