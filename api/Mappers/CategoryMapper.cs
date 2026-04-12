using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using api.DTOs.CategoryDTOs;
using api.Models;

namespace api.Mappers
{
    public class CategoryMapper
    {
        public static CategoryResponseDTO CategoryToCategoryResponseDTO(Category category)
        {
            return new CategoryResponseDTO
            {
                Id = category.Id,
                Name = category.Name
            };
        }

        public static Category CategoryCreateDtoToCategory(CategoryCreateDTO categoryCreate)
        {
            return new Category
            {
                Id = categoryCreate.Id,
                Name = categoryCreate.Name
            };
        }
    }
}