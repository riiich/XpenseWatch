using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.AccountDTOs;
using api.DTOs.UserDTOs;
using api.Interfaces;
using api.Interfaces.AccountInterface;
using api.Interfaces.UserInterface;
using api.Mappers;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace api.Services
{
    public class UserService : IUserServiceInterface
    {
        private readonly IUserRepositoryInterface _repo;
        private readonly IAccountServiceInterface _accountService;  // an account (checkings) gets created by default when a user creates an account
        private readonly UserManager<User> _userManager;

        public UserService(IUserRepositoryInterface repo, UserManager<User> userManager, IAccountServiceInterface accountService)
        {
            _repo = repo;
            _userManager = userManager;
            _accountService = accountService;
        }

        public async Task<IEnumerable<UserResponseDTO>> GetAllUsers()
        {
            var users = await _repo.GetUsersAsync();

            return users.Select(user => UserMapper.UserToUserResponseDto(user));
        }

        public async Task<UserResponseDTO?> GetUserById(string id)
        {
            var user = await _repo.GetUserByIdAsync(id);

            if(user == null) return null;

            return UserMapper.UserToUserResponseDto(user);
        }

        public async Task<(UserResponseDTO?, IEnumerable<string>? errors)> CreateUser(UserRegistrationDTO userRegistered)
        {
            var newUser = UserMapper.FromRegistrationDtoToUser(userRegistered);

            newUser.CreatedAt = DateTime.UtcNow;

            var createdUser = await _userManager.CreateAsync(newUser, userRegistered.Password);

            if(!createdUser.Succeeded)
            {
                return (null, createdUser.Errors.Select(e => e.Description));
            }

            var roleResult = await _userManager.AddToRoleAsync(newUser, "User");

            if(!roleResult.Succeeded)
            {
                return (null, roleResult.Errors.Select(e => e.Description));
            }

            // create default checkings account
            var defaultCheckingsAccount = new AccountCreateDTO 
            {
                Name = "My Checking Account",
                Type = "Checking",
                Balance = 0,
                Currency = "USD",
            };

            var newAccount = await _accountService.CreateAccount(newUser.Id, defaultCheckingsAccount);


            return (UserMapper.UserToUserResponseDto(newUser), null);
        }
    }
}