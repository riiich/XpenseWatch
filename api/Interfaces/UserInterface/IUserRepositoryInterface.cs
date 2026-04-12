using api.Models;
using Microsoft.AspNetCore.Identity;

namespace api.Interfaces.UserInterface
{
    public interface IUserRepositoryInterface
    {
        Task<List<User>> GetUsersAsync();
        Task<User?> GetUserByIdAsync(string id);
    }
}