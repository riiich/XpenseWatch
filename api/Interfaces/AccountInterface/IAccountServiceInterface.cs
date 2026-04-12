using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.AccountDTOs;
using api.Models;

namespace api.Interfaces.AccountInterface
{
    public interface IAccountServiceInterface
    {
        Task<IEnumerable<AccountResponseDTO>?> GetAccounts(string userId);
        Task<AccountResponseDTO?> GetAccountById(int id);
        Task<AccountResponseDTO> CreateAccount(string userId, AccountCreateDTO account);
        Task<AccountResponseDTO?> UpdateAccount(int id, AccountUpdateDTO accountUpdate);
    }
}