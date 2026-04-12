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
        public required string UserId { get; set; }
        [MaxLength(100)]
        public required string Name { get; set; }
        public string? Type { get; set; } = "other";  // "Checkings", "Savings", "Credit", ...
        public decimal Balance { get; set; }
        public string? Currency { get; set; } = "N/A";  // "USD", ...
        public DateTime CreatedAt { get; set; }
        public List<Transaction> Transactions { get; set; } = new List<Transaction>();
    }
}