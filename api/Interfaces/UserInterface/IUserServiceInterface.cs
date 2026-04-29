using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.UserDTOs;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Interfaces
{
    public interface IUserServiceInterface
    {
        // using IEnumberable instead of list b/c it's read-only list
        Task<IEnumerable<UserResponseDTO>> GetAllUsers();
        Task<UserResponseDTO?> GetUserById(string id);
        Task<(User?, IEnumerable<string>? errors)> CreateUser(UserRegistrationDTO userRegister);
    }
}