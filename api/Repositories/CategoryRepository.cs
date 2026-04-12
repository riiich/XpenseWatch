using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.Data;
using api.DTOs.CategoryDTOs;
using api.Interfaces.CategoryInterface;
using api.Models;
using Microsoft.EntityFrameworkCore;

namespace api.Repositories
{
    public class CategoryRepository : ICategoryRepositoryInterface
    {
        private readonly ApplicationDBContext _context;

        public CategoryRepository(ApplicationDBContext context)
        {
            _context = context;
        }

        public async Task<List<Category>> GetCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task CreateCategoryAsync(Category newCategory)
        {
            await _context.Categories.AddAsync(newCategory);
            await _context.SaveChangesAsync();
        }

        public async Task<Category?> DeleteCategoryAsync(int id)
        {
            var categoryToBeDeleted = await _context.Categories.FirstOrDefaultAsync(c => c.Id == id);

            if (categoryToBeDeleted == null) return null;

            _context.Categories.Remove(categoryToBeDeleted);
            await _context.SaveChangesAsync();

            return categoryToBeDeleted;
        }
    }
}