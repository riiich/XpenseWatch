using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces.ITransactionInterface
{
    public interface ITransactionRepositoryInterface
    {
        Task<List<Transaction>> GetTransactionsAsync();
        Task<Transaction?> GetTransactionByIdAsync(int id);
        Task<Transaction> CreateTransactionAsync(Transaction transactionCreate);
        Task<Transaction?> UpdateTransactionAsync(int id, Transaction transactionUpdate);
        Task<Transaction?> DeleteTransactionAsync(int id);
    }
}