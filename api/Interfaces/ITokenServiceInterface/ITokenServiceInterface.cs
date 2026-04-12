using api.Models;

namespace api.Interfaces.ITokenServiceInterface
{
    public interface ITokenServiceInterface
    {
        public Task<string> CreateToken(User user);
    }
}