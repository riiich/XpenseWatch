using api.Data;
using api.Interfaces.AccountInterface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class AccountRepository : IAccountRepositoryInterface
    {
        private readonly ApplicationDBContext _context;

        public AccountRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Account>> GetAccountsAsync(string userId)
        {
            return await _context.Accounts.Where(a => a.UserId == userId).ToListAsync();
        }

        public async Task<Account?> GetAccountByIdAsync(int id)
        {
            var account = await _context.Accounts.FindAsync(id);

            if (account == null) return null;

            return account;
        }

        public async Task CreateAccountAsync(Account newAccount)
        {
            await _context.Accounts.AddAsync(newAccount);
            await _context.SaveChangesAsync();
        }

        public async Task<Account?> UpdateAccountAsync(int id)
        {
            var accountToBeUpdated = await _context.Accounts.FindAsync(id);

            if (accountToBeUpdated == null) return null;

            await _context.SaveChangesAsync();

            return accountToBeUpdated;
        }
    }
}