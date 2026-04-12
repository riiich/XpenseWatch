using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.GoalDTOs;
using api.Models;

namespace api.Mappers
{
    public class GoalMapper
    {
        public static GoalResponseDTO GoalToGoalResponseDto(Goal goal)
        {
            return new GoalResponseDTO
            {
                Name = goal.Name,
                CurrentBalance = goal.CurrentBalance,
                TargetBalance = goal.TargetBalance,
                TargetDate = goal.TargetDate
            };
        }

        public static Goal GoalCreateDtoToGoal(GoalCreateDTO goalCreate)
        {
            return new Goal
            {
                Name = goalCreate.Name,
                CurrentBalance = goalCreate.CurrentBalance,
                TargetBalance = goalCreate.TargetBalance,
                TargetDate = goalCreate.TargetDate,
                CreatedAt = DateTime.UtcNow,
                EditDate = DateTime.UtcNow,
                AccountId = goalCreate.AccountId
            };
        }

        public static Goal GoalUpdateDtoToGoal(Goal goal, GoalUpdateDTO updateGoal)
        {
            goal.Name = updateGoal.Name;
            goal.CurrentBalance = updateGoal.CurrentBalance;
            goal.TargetBalance = updateGoal.TargetBalance;
            goal.TargetDate = updateGoal.TargetDate;
            goal.EditDate = DateTime.UtcNow;

            return goal;   
        }
    }
}