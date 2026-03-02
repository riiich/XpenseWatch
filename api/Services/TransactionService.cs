using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TransactionDTOs;
using api.Interfaces.ITransactionInterface;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.Services
{
    public class TransactionService : ITransactionServiceInterface

    {
        ITransactionRepositoryInterface _repo;

        public TransactionService(ITransactionRepositoryInterface repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<TransactionResponseDTO>> GetTransactions()
        {
            var transactions = await _repo.GetTransactionsAsync();

            return transactions.Select(t => TransactionMapper.TransactionToTransactionResponseDto(t));
        }

        public async Task<TransactionResponseDTO?> GetTransactionById(int id)
        {
            var transaction = await _repo.GetTransactionByIdAsync(id);

            if (transaction == null) return null;

            return TransactionMapper.TransactionToTransactionResponseDto(transaction);   
        }

        public async Task<TransactionResponseDTO> CreateTransaction(TransactionCreateDTO transactionCreate)
        {
            var newTransaction = await _repo.CreateTransactionAsync(TransactionMapper.TransactionCreateDtoToTransaction(transactionCreate));

            return TransactionMapper.TransactionToTransactionResponseDto(newTransaction);
        }

        public async Task<TransactionResponseDTO?> UpdateTransaction(int id, TransactionUpdateDTO transactionUpdate)
        {
            var transactionToBeUpdated = await _repo.GetTransactionByIdAsync(id);

            if (transactionToBeUpdated == null) return null;

            TransactionMapper.TransactionUpdateDTOToTransaction(transactionToBeUpdated, transactionUpdate);

            await _repo.UpdateTransactionAsync(id, transactionToBeUpdated);

            return TransactionMapper.TransactionToTransactionResponseDto(transactionToBeUpdated);
        }

        public async Task<TransactionResponseDTO?> DeleteTransaction(int id)
        {
            var deletedTransaction = await _repo.DeleteTransactionAsync(id);

            if(deletedTransaction == null) return null;

            return TransactionMapper.TransactionToTransactionResponseDto(deletedTransaction);
        }
    }
}