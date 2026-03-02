using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.AccountDTOs
{
    public class AccountUpdateDTO
    {
        [MaxLength(100)]
        public required string Name { get; set; }
        public string? Type { get; set; }   // "Checkings", "Savings", "Credit", ...
    }
}
