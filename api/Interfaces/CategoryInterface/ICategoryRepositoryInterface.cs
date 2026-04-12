using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Models;

namespace api.Interfaces.CategoryInterface
{
    public interface ICategoryRepositoryInterface
    {
        Task<List<Category>> GetCategoriesAsync();
        Task CreateCategoryAsync(Category category);
        Task<Category?> DeleteCategoryAsync(int id);
    }
}