using api.DTOs.UserDTOs;
using api.Interfaces;
using api.Interfaces.ITokenServiceInterface;
using api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServiceInterface _userService;
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenServiceInterface _tokenService;

        public UserController(IUserServiceInterface userService, UserManager<User> userManager,SignInManager<User> signInManager, ITokenServiceInterface tokenService)
        {
            _userService = userService;
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userService.GetAllUsers();

            if(users.Count() == 0) return NotFound("There are no users at the moment...");

            return Ok(users);
        }        

        [HttpGet("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetUserById([FromRoute] string id)
        {
            var user = await _userService.GetUserById(id);

            if (user == null) return NotFound("User does not exist...");

            return Ok(user);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegistrationDTO userRegister)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var newUser = new User
            {
                FirstName = userRegister.FirstName,
                LastName = userRegister.LastName,
                UserName = userRegister.Username,
                Email = userRegister.Email
            };

            var createdUser = await _userService.CreateUser(userRegister);

            if(!userRegister.Email.Contains("."))
                return BadRequest(new { errorMsg = "Email must contain a domain extension. (eg. .com, .org, ...)", code = "INVALID_EMAIL" });

            if(createdUser.errors != null) return StatusCode(500, createdUser.errors);
            
            return CreatedAtAction(nameof(GetUserById), new { id = newUser.Id }, new UserLoginResponseDTO
            {
                Email = newUser.Email,
                Username = newUser.UserName, 
                Token = await _tokenService.CreateToken(newUser)
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(UserLoginDTO userLogin)
        {
            if(!ModelState.IsValid) return BadRequest(ModelState);

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == userLogin.Username);

            if(user == null) return Unauthorized(new { errorMsg = "Either username or password is incorrect." });

            var result = await _signInManager.CheckPasswordSignInAsync(user, userLogin.Password, false);

            if(!result.Succeeded) return Unauthorized(new { errorMsg = "Either username or password is incorrect." });

            return Ok(new UserLoginResponseDTO
            {
                Email = user.Email,
                Username = user.UserName,
                Token = await _tokenService.CreateToken(user)
            });
        }
    }
}