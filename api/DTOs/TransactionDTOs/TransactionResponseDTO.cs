using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.TransactionDTOs
{
    public class TransactionResponseDTO
    {
        public int Id { get; set; }
        public DateOnly TransactionDate { get; set; }
        public DateTime EditDate { get; set; }
        public required string AccountName { get; set; }
        public required string CategoryName { get; set; }
        public int? CategoryId { get; set; }
        public decimal Amount { get; set; }
        public required string Currency { get; set; }
        public string? Description { get; set; }
        public string? Notes { get; set; }
        public bool IsIncome { get; set; }
        public bool IsCredit { get; set; }
        public bool IsManual { get; set; }
        public bool IsDeleted { get; set; }
    }
}