using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.CategoryDTOs;
using api.Interfaces.CategoryInterface;

namespace api.Services
{
    public class CategoryService : ICategoryServiceInterface
    {
        private readonly ICategoryRepositoryInterface _repo;

        public CategoryService(ICategoryRepositoryInterface repo)
        {
            _repo = repo;
        }

        public async Task<IEnumerable<CategoryResponseDTO>> GetCategories()
        {
            var categories = await _repo.GetCategoriesAsync();

            return categories.Select(c => Mappers.CategoryMapper.CategoryToCategoryResponseDTO(c));
        } 

        public async Task<CategoryResponseDTO> CreateCategory(CategoryCreateDTO categoryCreate)
        {
            var newCategory = Mappers.CategoryMapper.CategoryCreateDtoToCategory(categoryCreate);

            await _repo.CreateCategoryAsync(newCategory);

            return Mappers.CategoryMapper.CategoryToCategoryResponseDTO(newCategory);
        }

        public async Task<CategoryResponseDTO?> DeleteCategory(int id)
        {
            var categoryToBeDeleted = await _repo.DeleteCategoryAsync(id);

            if(categoryToBeDeleted == null) return null;

            return Mappers.CategoryMapper.CategoryToCategoryResponseDTO(categoryToBeDeleted);
        }
    }
}