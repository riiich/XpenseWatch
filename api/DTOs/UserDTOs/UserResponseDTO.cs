using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.AccountDTOs;
using api.Models;
using api.Services;

namespace api.DTOs.UserDTOs
{
    public class UserResponseDTO
    {
        public string Id { get; set; }
        public string? FirstName { get; set;} = null;
        public string? LastName { get; set; } = null;
        public string UserName { get; set; }
        public string Email { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<AccountResponseDTO> Accounts { get; set; } = new List<AccountResponseDTO>();
    }
}