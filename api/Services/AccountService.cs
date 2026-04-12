using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.AccountDTOs;
using api.Interfaces.AccountInterface;
using api.Mappers;
using api.Models;

namespace api.Services
{
    public class AccountService : IAccountServiceInterface
    {
        private readonly IAccountRepositoryInterface _repo;

        public AccountService(IAccountRepositoryInterface repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<AccountResponseDTO>?> GetAccounts(string userId)
        {
            var accounts = await _repo.GetAccountsAsync(userId);

            if (accounts == null) return null;

            return accounts.Select(x => AccountMapper.AccountToAccountResponseDto(x));
        }

        public async Task<AccountResponseDTO?> GetAccountById(int id)
        {
            var account = await _repo.GetAccountByIdAsync(id);

            if (account == null) return null;

            return AccountMapper.AccountToAccountResponseDto(account);
        }

        public async Task<AccountResponseDTO> CreateAccount(string userId, AccountCreateDTO accountCreate)
        {
            var newAccount = AccountMapper.AccountCreateDtoToAccount(userId, accountCreate);

            await _repo.CreateAccountAsync(newAccount);

            return AccountMapper.AccountToAccountResponseDto(newAccount);
        }

        public async Task<AccountResponseDTO?> UpdateAccount(int id, AccountUpdateDTO accountUpdate)
        {
            var accountToBeUpdated = await _repo.GetAccountByIdAsync(id);

            if (accountToBeUpdated == null) return null;

            accountToBeUpdated = AccountMapper.AccountUpdateDtoToAccount(accountToBeUpdated, accountUpdate);

            await _repo.UpdateAccountAsync(id);

            return AccountMapper.AccountToAccountResponseDto(accountToBeUpdated);
        }
    }
}

/*
{
  "accountId": 1,
  "categoryId": "",
  "transactionDate": 02/23/26,
  "amount": 12.64,
  "description": "Went to Smart & Final",
  "notes": "Went to the store to buy bread and cheese.",
  "currency": "USD",
  "isManual": true
}
*/