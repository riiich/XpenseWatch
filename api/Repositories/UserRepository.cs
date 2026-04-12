using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.UserDTOs;
using api.Interfaces;
using api.Interfaces.UserInterface;
using api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class UserRepository : IUserRepositoryInterface
    {
        private readonly UserManager<User> _userManager;    // mainly use userManager
        private readonly ApplicationDBContext _context;     // use for complex joins and such

        public UserRepository(ApplicationDBContext context, UserManager<User> userManager)
        {
            _userManager = userManager;
            _context = context;
        }

        public async Task<List<User>> GetUsersAsync()
        {
            return await _userManager.Users.ToListAsync();
        }

        public async Task<User?> GetUserByIdAsync(string id)
        {
            return await _userManager.Users.Include(a => a.Accounts).FirstOrDefaultAsync(u => id == u.Id);
        }

    }
}