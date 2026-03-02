using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace api.Models
{
    public class Goal
    {
        public int Id { get;set; }
        public string? Name { get; set; }
        public decimal CurrentBalance { get; set; }
        public decimal TargetBalance { get; set; }
        public DateOnly TargetDate { get; set; }
        public DateTime CreatedAt { get; set; }

        public int AccountId { get; set; }
        public Account? Account { get; set; }
    }
}