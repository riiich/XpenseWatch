using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Sockets;
using System.Threading.Tasks;
using api.DTOs.AccountDTOs;
using api.Interfaces.AccountInterface;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/accounts")]
    public class AccountController : ControllerBase
    {
        private readonly IAccountServiceInterface _service;

        public AccountController(IAccountServiceInterface service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAccounts()
        {
            var accounts = await _service.GetAccounts();

            if (accounts == null) return NotFound("You have no accounts...");

            return Ok(accounts);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccountById(int id)
        {
            var account = await _service.GetAccountById(id);

            if (account == null) return NotFound("Account does not exist...");

            return Ok(account);
        }

        [HttpPost("{userId}")]
        public async Task<IActionResult> CreateAccount([FromRoute] int userId, [FromBody] AccountCreateDTO accountCreate)
        {
            var newAccount = await _service.CreateAccount(userId, accountCreate);

            if (newAccount == null) return BadRequest("Account was not created. There must've been an error.");

            return Ok(newAccount);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAccount([FromRoute] int id, [FromBody] AccountUpdateDTO accountUpdate)
        {
            var updatedAccount = await _service.UpdateAccount(id, accountUpdate);

            if (updatedAccount == null) return NotFound("Account does not exist...");

            return Ok(updatedAccount);
        }
    }   
}