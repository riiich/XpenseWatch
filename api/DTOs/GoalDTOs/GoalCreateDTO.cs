using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.GoalDTOs
{
    public class GoalCreateDTO
    {
        public string? Name { get; set; }
        public decimal CurrentBalance { get; set; }
        public decimal TargetBalance { get; set; }
        public DateOnly TargetDate { get; set; }

        public int AccountId { get; set; }
    }
}