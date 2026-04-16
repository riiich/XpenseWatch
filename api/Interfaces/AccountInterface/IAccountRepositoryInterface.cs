using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces.AccountInterface
{
    public interface IAccountRepositoryInterface
    {
        
        Task<List<Account>> GetAccountsAsync(string userId);
        Task<Account?> GetAccountByIdAsync(int id);
        Task CreateAccountAsync(Account account);
        Task<Account?> UpdateAccountAsync(int id);        
        Task<Account?> UpdateAccountBalanceAsync(int id, decimal amount, bool isIncome);
    }
}