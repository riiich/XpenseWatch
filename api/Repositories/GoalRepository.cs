using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.GoalDTOs;
using api.Interfaces.GoalInterface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class GoalRepository : IGoalRepositoryInterface
    {
        ApplicationDBContext _context;

        public GoalRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Goal>> GetGoalsAsync(User user, int accountId)
        {
            return await _context.Goals.Where(g => g.AccountId == accountId && g.Account.UserId == user.Id).ToListAsync();
        }
        
    }
}