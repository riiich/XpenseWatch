using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TransactionDTOs;
using api.Interfaces.AccountInterface;
using api.Interfaces.CategoryInterface;
using api.Interfaces.ITransactionInterface;
using api.Mappers;
using api.Models;
using Microsoft.AspNetCore.Http.HttpResults;

namespace api.Services
{
    public class TransactionService : ITransactionServiceInterface

    {
        ITransactionRepositoryInterface _transactionRepo;
        IAccountServiceInterface _accountService;
        ICategoryServiceInterface _categoryService;

        public TransactionService(ITransactionRepositoryInterface repo, 
                                  IAccountServiceInterface accountService, 
                                  ICategoryServiceInterface categoryService)
        {
            _transactionRepo = repo;
            _accountService = accountService;
            _categoryService = categoryService;
        }

        public async Task<IEnumerable<TransactionResponseDTO>> GetTransactions()
        {
            var transactions = await _transactionRepo.GetTransactionsAsync();

            return transactions.Select(t => TransactionMapper.TransactionToTransactionResponseDto(t));
        }

        public async Task<IEnumerable<TransactionResponseDTO>> GetTransactionsByAccountId(int accountId)
        {
            var transactionsByAccount = await _transactionRepo.GetTransactionsByAccountIdAsync(accountId);
            return transactionsByAccount.Select(t => Mappers.TransactionMapper.TransactionToTransactionResponseDto(t));
        }

        public async Task<TransactionResponseDTO?> GetTransactionById(int id)
        {
            var transaction = await _transactionRepo.GetTransactionByIdAsync(id);

            if (transaction == null) return null;

            return TransactionMapper.TransactionToTransactionResponseDto(transaction);   
        }

        public async Task<TransactionResponseDTO> CreateTransaction(TransactionCreateDTO transactionCreate)
        {
            var newTransaction = await _transactionRepo
                                            .CreateTransactionAsync(TransactionMapper
                                                                        .TransactionCreateDtoToTransaction(transactionCreate));
            
            return TransactionMapper.TransactionToTransactionResponseDto(newTransaction);
        }

        public async Task<TransactionResponseDTO?> UpdateTransaction(int id, TransactionUpdateDTO transactionUpdate)
        {
            var transactionToBeUpdated = await _transactionRepo.GetTransactionByIdAsync(id);

            if (transactionToBeUpdated == null) return null;

            TransactionMapper.TransactionUpdateDTOToTransaction(transactionToBeUpdated, transactionUpdate);

            await _transactionRepo.UpdateTransactionAsync(id, transactionToBeUpdated);

            return TransactionMapper.TransactionToTransactionResponseDto(transactionToBeUpdated);
        }

        public async Task<TransactionResponseDTO?> DeleteTransaction(int id)
        {
            var deletedTransaction = await _transactionRepo.DeleteTransactionAsync(id);

            if(deletedTransaction == null) return null;

            return TransactionMapper.TransactionToTransactionResponseDto(deletedTransaction);
        }
    }
}