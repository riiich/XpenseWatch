using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TransactionDTOs
{
    public class TransactionCreateDTO
    {
        public int AccountId { get; set; }
        public int CategoryId { get; set; }
        public DateOnly? TransactionDate { get; set; }
        public decimal Amount { get; set; }
        public string? Description { get; set; }
        public string? Notes { get; set; }
        public required string Currency { get; set; }
        public bool IsManual { get; set; }
        public bool IsIncome { get; set; }
    }
}