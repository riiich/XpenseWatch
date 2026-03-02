using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TransactionDTOs;
using api.Migrations;
using api.Models;

namespace api.Interfaces.ITransactionInterface
{
    public interface ITransactionServiceInterface
    {
        Task<IEnumerable<TransactionResponseDTO>> GetTransactions();
        Task<TransactionResponseDTO?> GetTransactionById(int id);
        Task<TransactionResponseDTO> CreateTransaction(TransactionCreateDTO transactionCreate);
        Task<TransactionResponseDTO?> UpdateTransaction(int id, TransactionUpdateDTO transactionUpdate);
        Task<TransactionResponseDTO?> DeleteTransaction(int id);
    }
}