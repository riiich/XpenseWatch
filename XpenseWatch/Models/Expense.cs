using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using XpenseWatch.Models.User;
using XpenseWatch.Models.Category;
using XpenseWatch.Models.PaymentMethod;

namespace XpenseWatch.Models
{
    public class Expense
    {
        [Key]
        public int Id { get; set; }

        public string UserId { get; set; }
        [ForeignKey("UserId")]
        public User User { get; set; }

        [Required]
        public decimal Amount { get; set; }

        [Required]
        [MaxLength(255)]
        public string Description { get; set; }

        public int CategoryId { get; set; }
        [ForeignKey("CategoryId")]
        public Category Category { get; set; }

        [DataType(DataType.Date)]

        [Required]
        public Date CreatedAt { get; set; }
    }
}
