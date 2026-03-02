using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.Interfaces.ITransactionInterface;
using api.Models;
using iText.Commons.Bouncycastle.Asn1;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace api.Repositories
{
    public class TransactionRepository : ITransactionRepositoryInterface
    {
        private readonly ApplicationDBContext _context;

        public TransactionRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Transaction>> GetTransactionsAsync()
        {
            return await _context.Transactions.Include(a => a.Account).Include(c => c.Category).ToListAsync();
        }

        public async Task<Transaction?> GetTransactionByIdAsync(int id)
        {
            return await _context.Transactions.Include(a => a.Account).Include(c => c.Category).FirstOrDefaultAsync(t => id == t.Id);
        }

        public async Task<Transaction> CreateTransactionAsync(Transaction transactionCreate)
        {
            var newTransaction = new Transaction
            {
                Id = transactionCreate.Id,
                AccountId = transactionCreate.AccountId,
                CategoryId = transactionCreate.CategoryId,
                TransactionDate = transactionCreate.TransactionDate ?? DateOnly.FromDateTime(DateTime.Today),
                CreatedAt = DateTime.UtcNow,
                EditDate = DateTime.UtcNow,
                Amount = transactionCreate.Amount,
                Currency = transactionCreate.Currency,
                Description = transactionCreate.Description,
                Notes = transactionCreate.Notes,
                IsManual = transactionCreate.IsManual,
                IsDeleted = false,
            };

            await _context.Transactions.AddAsync(newTransaction);
            await _context.SaveChangesAsync();

            return newTransaction;
        }

        public async Task<Transaction?> UpdateTransactionAsync(int id, Transaction transactionUpdate)
        {
            transactionUpdate.EditDate = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return transactionUpdate;
        }

        public async Task<Transaction?> DeleteTransactionAsync(int id)
        {
            var transactionToBeDeleted = await _context.Transactions.FindAsync(id);

            if (transactionToBeDeleted == null) return null;

            _context.Transactions.Remove(transactionToBeDeleted);
            await _context.SaveChangesAsync();

            return transactionToBeDeleted;
        }
    }
}