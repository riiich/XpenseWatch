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
            return await _context.Transactions.Include(t => t.Account).Include(t => t.Category).ToListAsync();
        }

        public async Task<List<Transaction>> GetTransactionsByAccountIdAsync(int accountId)
        {
            return await _context.Transactions
                                 .Include(t => t.Account)
                                 .Include(t => t.Category)
                                 .Where(t => t.AccountId == accountId)
                                 .OrderByDescending(t => t.TransactionDate)
                                 .ToListAsync();
        }

        public async Task<Transaction?> GetTransactionByIdAsync(int id)
        {
            return await _context.Transactions.Include(t => t.Account).Include(t => t.Category).FirstOrDefaultAsync(t => id == t.Id);
        }

        public async Task<Transaction> CreateTransactionAsync(Transaction transactionCreate)
        {
            var newTransaction = new Transaction
            {
                AccountId = transactionCreate.AccountId,
                CategoryId = transactionCreate.CategoryId,
                TransactionDate = transactionCreate.TransactionDate ?? DateOnly.FromDateTime(DateTime.Today),
                CreatedAt = DateTime.UtcNow,
                EditDate = DateTime.UtcNow,
                Amount = transactionCreate.IsIncome ? transactionCreate.Amount : -transactionCreate.Amount,
                Currency = transactionCreate.Currency,
                Description = transactionCreate.Description,
                Notes = transactionCreate.Notes,
                IsIncome = transactionCreate.IsIncome,
                IsCredit = transactionCreate.IsCredit,
                IsManual = transactionCreate.IsManual,
                IsDeleted = false,
            };

            await _context.Transactions.AddAsync(newTransaction);
            await _context.SaveChangesAsync();

            return newTransaction;
        }

        public async Task<Transaction[]> CreateUploadTransactionAsync(List<Transaction> transactionsFromUpload)
        {
            var transformedTransactions = new List<Transaction>();

            foreach (Transaction t in transactionsFromUpload)
            {
                transformedTransactions.Add(
                    new Transaction
                    {
                        AccountId = t.AccountId,
                        // CategoryId = t.CategoryId,
                        TransactionDate = t.TransactionDate ?? DateOnly.FromDateTime(DateTime.Today),
                        CreatedAt = DateTime.UtcNow,
                        EditDate = DateTime.UtcNow,
                        Amount = t.IsIncome ? t.Amount : -t.Amount,
                        Currency = t.Currency,
                        Description = t.Description,
                        Notes = t.Notes,
                        IsIncome = t.IsIncome,
                        IsCredit = t.IsCredit,
                        IsManual = t.IsManual,
                        IsDeleted = false,
                    }
                );
            }

            await _context.Transactions.AddRangeAsync(transformedTransactions);
            await _context.SaveChangesAsync();

            return transformedTransactions.ToArray();
        }

        // WORK ON THIS
        public async Task<Transaction?> UpdateTransactionAsync(int id, Transaction transactionUpdate)
        {
            var transaction = await _context.Transactions.FirstOrDefaultAsync(t => t.Id == id);

            if(transaction == null) return null;

            transaction.CategoryId = transactionUpdate.CategoryId;
            transaction.Amount = transactionUpdate.Amount;
            transaction.Currency = transactionUpdate.Currency;
            transaction.Description = transactionUpdate.Description;
            transaction.Notes = transactionUpdate.Notes;
            
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