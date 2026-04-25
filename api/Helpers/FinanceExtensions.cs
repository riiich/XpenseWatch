using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.Helpers
{
    public static class FinanceExtensions
    {
        public static decimal CalculateNewBalance(this decimal currBalance, decimal amount, bool isIncome)
        {
            return isIncome ? (currBalance + amount) : (currBalance - amount);
        }


    }
}