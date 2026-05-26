using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TransactionDTOs;
using api.Models;

namespace api.Interfaces.ITransactionInterface
{
    public interface ITransactionServiceInterface
    {
        Task<IEnumerable<TransactionResponseDTO>> GetTransactions();
        Task<IEnumerable<TransactionResponseDTO>> GetTransactionsByAccountId(int accountId);
        Task<TransactionResponseDTO?> GetTransactionById(int id);
        Task<TransactionResponseDTO> CreateTransaction(TransactionCreateDTO transactionCreate);
        Task<TransactionResponseDTO[]?> CreateTransactionUpload(TransactionUploadDTO transactionCreateUpload);
        Task<TransactionResponseDTO?> UpdateTransaction(int id, TransactionUpdateDTO transactionUpdate);
        Task<TransactionResponseDTO?> DeleteTransaction(int id);
    }
}