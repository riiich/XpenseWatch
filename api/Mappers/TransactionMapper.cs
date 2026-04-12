using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TransactionDTOs;
using api.Models;

namespace api.Mappers
{
    public class TransactionMapper
    {
        public static TransactionResponseDTO TransactionToTransactionResponseDto(Models.Transaction transaction)
        {
            return new TransactionResponseDTO
            {
                Id = transaction.Id,
                TransactionDate = transaction.TransactionDate ?? DateOnly.FromDateTime(DateTime.Today),
                EditDate = transaction.EditDate,
                AccountName = transaction.Account?.Name ?? "Other",
                CategoryName = transaction.Category?.Name ?? "Uncategorized",
                Amount = transaction.Amount,
                Currency = transaction.Currency,
                Description = transaction.Description,
                Notes = transaction.Notes,
                IsIncome = transaction.IsIncome,
                IsManual = transaction.IsManual,
                IsDeleted = transaction.IsDeleted
            };
        }

        public static Transaction TransactionCreateDtoToTransaction(TransactionCreateDTO createDto)
        {
            return new Transaction
            { 

                Amount = createDto.Amount,
                AccountId = createDto.AccountId,
                CategoryId = createDto.CategoryId,
                Currency = createDto.Currency,
                Description = createDto.Description,
                Notes = createDto.Notes,
                TransactionDate = createDto.TransactionDate ?? DateOnly.FromDateTime(DateTime.Today),
                EditDate = DateTime.Now,
                CreatedAt = DateTime.Now,
                IsIncome = createDto.IsIncome,
                IsManual = createDto.IsManual,
                IsDeleted = false
            };
        }

        // not really a mapper, just updates existing transaction with the user's transaction updates
        public static Transaction TransactionUpdateDTOToTransaction(Transaction transactionToBeUpdated, TransactionUpdateDTO updateDto)
        {
            transactionToBeUpdated.AccountId = updateDto.AccountId;
            transactionToBeUpdated.CategoryId = updateDto.CategoryId;
            transactionToBeUpdated.Amount = updateDto.Amount;
            transactionToBeUpdated.Currency = updateDto.Currency;
            transactionToBeUpdated.Description = updateDto.Description;
            transactionToBeUpdated.Notes = updateDto.Notes;
            transactionToBeUpdated.EditDate = DateTime.Now; // local time (PST)

            return transactionToBeUpdated;
            
        }

        // public static Transaction TransactionUploadDtoToTransaction(IFormFile transactionFileUpload)
        // {
        //     return new Transaction
        //     {
                
        //     };
        // }
    }
}