using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Transaction
    {
        public int Id { get; set; }
        public int? AccountId { get; set; }
        public Account? Account { get; set; }     // navigation property (objects don't get stored in DB)
        public int? CategoryId { get; set; }
        public Category? Category { get; set; } 
        public DateOnly? TransactionDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime EditDate { get; set; }
        [Column(TypeName ="decimal(18, 2)")]
        public decimal Amount { get; set; }
        public required string Currency { get; set; }
        public string? Description { get; set; }
        public string? Notes { get; set; }
        public bool IsIncome { get; set; }
        public bool IsManual { get; set; }  // true = user manual entry, false = parsed by PDF
        public bool IsDeleted { get; set; } // for soft delete purposes in case the user accidentally deletes
    }
}