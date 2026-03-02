using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.TransactionDTOs;
using api.Interfaces;
using api.Interfaces.ITransactionInterface;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/transactions")]
    public class TransactionController : ControllerBase
    {
        private readonly ITransactionServiceInterface _service;

        public TransactionController(ITransactionServiceInterface service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllTransactions()
        {
            var transactions = await _service.GetTransactions();

            if(transactions.Count() == 0) return NotFound("There are currently no transactions made.");

            return Ok(transactions);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTransactionById([FromRoute] int id)
        {
            var transaction = await _service.GetTransactionById(id);

            if(transaction == null) return NotFound("This transaction does not exist...");

            return Ok(transaction);
        }

        [HttpPost]
        public async Task<IActionResult> CreateTransaction([FromBody] TransactionCreateDTO createTransaction)
        {
            var newTransaction = await _service.CreateTransaction(createTransaction);

            return Ok(newTransaction);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTransaction([FromRoute] int id, [FromBody] TransactionUpdateDTO updatedTransaction)
        {
            var transactionUpdate = await _service.UpdateTransaction(id, updatedTransaction);

            if (transactionUpdate == null) NotFound("Transaction does not exist...");

            return Ok(transactionUpdate);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTransaction([FromRoute] int id)
        {
            var transactionDelete = await _service.DeleteTransaction(id);

            if(transactionDelete == null) return NotFound("Cannot delete a transaction that does not exist...");

            return Ok(transactionDelete);
        }
    }
}