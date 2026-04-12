using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.AccountDTOs
{
    public class AccountResponseDTO
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public required string Name { get; set; }
        public string? Type { get; set; }   // "Checkings", "Savings", "Credit", ...
        public decimal Balance { get; set; } = 0;
    }
}