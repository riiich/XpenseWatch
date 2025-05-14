using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace XpenseWatch.Models
{
    public class User
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public string ThirdPartyUserId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Email { get; set; }

        [Range(0, 99999999999.99)]
        public decimal Income { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // navigation properties
        public List<Category> Categories { get; set; } = new List<Category>();
        public List<Expense> Expenses { get; set; } = new List<Expense>();
    }
}