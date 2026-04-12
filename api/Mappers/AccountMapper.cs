using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.AccountDTOs;
using api.Models;

namespace api.Mappers
{
    static public class AccountMapper
    {
        static public AccountResponseDTO AccountToAccountResponseDto(Account acc)
        {
            return new AccountResponseDTO
            {
                Id = acc.Id,
                UserId = acc.UserId,
                Name = acc.Name,
                Type = acc.Type,
                Balance = acc.Balance
            };
        }

        static public Account AccountCreateDtoToAccount(string userId, AccountCreateDTO acc)
        {
            return new Account
            {
                UserId = userId,
                Name = acc.Name,
                Type = acc.Type,
                Currency = acc.Currency,
                Balance = acc.Balance,
                CreatedAt = DateTime.Now,
            };
        }

        static public Account AccountUpdateDtoToAccount(Account currAccount, AccountUpdateDTO accountUpdate)
        {
            currAccount.Type = accountUpdate.Type;
            currAccount.Name = accountUpdate.Name;

            return currAccount;
        }
    }
}