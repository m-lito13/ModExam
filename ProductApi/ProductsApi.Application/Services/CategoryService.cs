using ProductsApi.Application.Dtos;
using ProductsApi.Application.Interfaces;
using ProductsApi.Domain.Interfaces;

namespace ProductsApi.Application.Services;

public class CategoryService(ICategoryRepository categoryRepository) : ICategoryService
{
    public async Task<IEnumerable<CategoryDto>> GetCategoriesAsync()
    {
        var categories = await categoryRepository.GetAllAsync();
        return categories.Select(ToCategoryDto);
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        return category is null ? null : ToCategoryDto(category);
    }

    public async Task<IEnumerable<ProductDto>?> GetProductsByCategoryAsync(int id)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        return category?.Products.Select(ToProductDto);
    }

    private static CategoryDto ToCategoryDto(Domain.Entities.Category category) => new()
    {
        Id = category.Id,
        Name = category.Name
    };

    private static ProductDto ToProductDto(Domain.Entities.Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Price = product.Price,
        CategoryId = product.CategoryId
    };
}
