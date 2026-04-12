using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.GoalDTOs;
using api.Models;

namespace api.Interfaces.GoalInterface
{
    public interface IGoalRepositoryInterface
    {
        Task<List<Goal>> GetGoalsAsync(User user, int accountId);
        // Task<Goal> GetGoalByIdAsync(int id);
        // Task<Goal> UpdateGoalAsync(GoalUpdateDTO goalUpdate);
    }
}