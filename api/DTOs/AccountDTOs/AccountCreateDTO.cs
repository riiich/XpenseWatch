using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.AccountDTOs
{
    public class AccountCreateDTO
    {
        [Required]
        [MaxLength(100)]
        public string? Name { get; set; }
        public string? Type { get; set; }   // "Checkings", "Savings", "Credit", ...
        public string? Currency { get; set; } = "N/A";  // "USD", ...
        public decimal Balance { get; set; } = 0;
    }
}