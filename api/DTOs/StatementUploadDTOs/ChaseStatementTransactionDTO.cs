using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.StatementUploadDTOs
{
    public class ChaseStatementTransactionDTO
    {
        public int AccountId { get; set; }
        public DateOnly? TransactionDate { get; set; }
        public string Description { get; set; }
        public string? Category { get; set; } = String.Empty;
        public string Type { get; set; }
        public decimal Amount { get; set; }
    }
}