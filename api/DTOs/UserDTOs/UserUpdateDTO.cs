using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.UserDTOs
{
    public class UserUpdateDTO
    {
        public string? FirstName { get; set;} = null;
        public string? LastName { get; set; } = null;
        public required string Email { get; set; }
    }
}