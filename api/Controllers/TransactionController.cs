using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using System.Transactions;
using api.DTOs.AccountDTOs;
using api.DTOs.TransactionDTOs;
using api.Helpers;
using api.Interfaces;
using api.Interfaces.AccountInterface;
using api.Interfaces.ITransactionInterface;
using api.Mappers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Client;

namespace api.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionServiceInterface _service;
        private readonly IAccountServiceInterface _accountService;

        public TransactionController(ITransactionServiceInterface service, IAccountServiceInterface accountService)
        {
            _service = service;
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await _service.GetTransactions();

            if(transactions.Count() == 0) return NotFound("There are currently no transactions made.");

            return Ok(transactions);
        }

        // get transactions based on account id
        [HttpGet("{accId}/transactions")]
        [Authorize]
        public async Task<IActionResult> GetTransactionsByAccountId([FromRoute] int accId)
        {
            var transactionsForAccount = await _service.GetTransactionsByAccountId(accId);

            return Ok(transactionsForAccount);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> GetTransactionById([FromRoute] int id)
        {
            var transaction = await _service.GetTransactionById(id);

            if(transaction == null) return NotFound("This transaction does not exist...");

            return Ok(transaction);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionCreateDTO createTransaction)
        {
            var newTransaction = await _service.CreateTransaction(createTransaction);

            var updateAccount = await _accountService.UpdateAccountBalance(createTransaction.AccountId, createTransaction.Amount, createTransaction.IsIncome);

            if(updateAccount == null) return NotFound("Account does not exist...");
            
            return Ok(newTransaction);
        }

        [HttpPost("upload")]
        [Authorize]
        public async Task<IActionResult> CreateUploadTransaction([FromForm] TransactionUploadDTO statement)
        {
            if(statement == null || statement.StatementFile.ContentType != "text/csv")
                return StatusCode(415, "Unsupported file type... Please upload a CSV file.");

            var extension = Path.GetExtension(statement.StatementFile.FileName);
            if(extension.ToLower() != ".csv")
                return StatusCode(415, "Unsupported file type... Please upload a CSV file.");

            // call service
            var uploadedTransactions = await _service.CreateTransactionUpload(statement);

            return Ok(uploadedTransactions);
        }

        [HttpPut("{id}")]
        [Authorize]
        public async Task<IActionResult> UpdateTransaction([FromRoute] int id, [FromBody] TransactionUpdateDTO updatedTransaction)
        {
            var transactionUpdate = await _service.UpdateTransaction(id, updatedTransaction);

            if (transactionUpdate == null) NotFound("Transaction does not exist...");

            return Ok(transactionUpdate);
        }

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTransaction([FromRoute] int id)
        {
            var transactionDelete = await _service.DeleteTransaction(id);

            if(transactionDelete == null) return NotFound("Cannot delete a transaction that does not exist...");

            return Ok(transactionDelete);
        }
    }
}