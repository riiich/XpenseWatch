using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Account
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        [MaxLength(100)]
        public required string Name { get; set; }
        public string? Type { get; set; }   // "Checkings", "Savings", "Credit", ...
        public decimal Balance { get; set; }
        public string? Currency { get; set; } = "N/A";  // "USD", ...
        public DateTime CreatedAt { get; set; }
        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}