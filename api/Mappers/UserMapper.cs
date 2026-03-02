using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.UserDTOs;
using api.Models;

namespace api.Mappers
{
    public class UserMapper
    {
        public static User FromRegistrationDtoToUser(UserRegistrationDTO userRegistrationDto)
        {
            return new User
            {
                FirstName = userRegistrationDto.FirstName,
                LastName = userRegistrationDto.LastName,
                Email = userRegistrationDto.Email
            };
        }

        public static User FromUserUpdateDtoToUser(UserUpdateDTO updatedUser)
        {
            return new User
            {
                FirstName = updatedUser.FirstName,
                LastName = updatedUser.LastName,
                Email = updatedUser.Email
            };
        }

        public static UserResponseDTO UserToUserResponseDto(User user)
        {
            return new UserResponseDTO
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                CreatedAt = user.CreatedAt,
                Accounts = user.Accounts.Select(a => AccountMapper.AccountToAccountResponseDto(a)).ToList()
            };
        }
    }
}