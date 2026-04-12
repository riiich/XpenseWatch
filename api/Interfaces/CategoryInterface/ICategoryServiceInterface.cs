using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.CategoryDTOs;

namespace api.Interfaces.CategoryInterface
{
    public interface ICategoryServiceInterface
    {
        Task<IEnumerable<CategoryResponseDTO>> GetCategories();
        Task<CategoryResponseDTO> CreateCategory(CategoryCreateDTO categoryCreate);
        Task<CategoryResponseDTO?> DeleteCategory(int id);
    }
}