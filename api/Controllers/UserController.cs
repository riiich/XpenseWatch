using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.AccountDTOs;
using api.DTOs.UserDTOs;
using api.Interfaces;
using api.Interfaces.AccountInterface;
using api.Mappers;
using api.Models;
using api.Services;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;

namespace api.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly IUserServiceInterface _userService;
        private readonly IAccountServiceInterface _accountService;  // an account (checkings) gets created by default when a user creates an account

        public UserController(IUserServiceInterface userService, IAccountServiceInterface accountService)
        {
            _userService = userService;
            _accountService = accountService;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsers();

            if(users.Count() == 0) return NotFound("There are no users at the moment...");

            return Ok(users);
        }        

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById([FromRoute] string id)
        {
            var user = await _userService.GetUserById(id);

            if (user == null) return NotFound("User does not exist...");

            return Ok(user);
        }

        [HttpPost]
        public async Task<IActionResult> CreateUser(UserRegistrationDTO userRegister)
        {
            if (userRegister.Email == "") return BadRequest("Not an email.");   // FIX THIS (not valid to just check that it's empty)

            var newUser = await _userService.CreateUser(userRegister);

            // create default checkings account
            var defaultCheckingsAccount = new AccountCreateDTO
            {
                Name = "My Checking Account",
                Type = "Checking",
                Balance = 0,
                Currency = "USD",
            };

            var defaultUserAccount = await _accountService.CreateAccount(newUser.Id, defaultCheckingsAccount);

            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, newUser);
        }
    }
}