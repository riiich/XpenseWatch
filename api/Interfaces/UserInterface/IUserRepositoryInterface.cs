using api.Models;

namespace api.Interfaces.UserInterface
{
    public interface IUserRepositoryInterface
    {
        Task<List<User>> GetUsersAsync();
        Task<User?> GetUserByIdAsync(string id);
        Task CreateUserAsync(User user);
    }
}