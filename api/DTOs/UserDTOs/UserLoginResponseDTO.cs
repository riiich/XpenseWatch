using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace api.DTOs.UserDTOs
{
    public class UserLoginResponseDTO
    {
        public string Email { get; set; }
        public string Username { get; set; }
        public string Token { get; set; }
    }
}