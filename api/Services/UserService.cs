using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.UserDTOs;
using api.Interfaces;
using api.Interfaces.UserInterface;
using api.Mappers;
using api.Models;
using api.Repositories;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace api.Services
{
    public class UserService : IUserServiceInterface
    {
        private readonly IUserRepositoryInterface _repo;

        public UserService(IUserRepositoryInterface repo)
        {
            _repo = repo;
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

        public async Task<UserResponseDTO> CreateUser(UserRegistrationDTO userRegistered)
        {
            var user = UserMapper.FromRegistrationDtoToUser(userRegistered);
            await _repo.CreateUserAsync(user);

            return UserMapper.UserToUserResponseDto(user);
        }
    }
}