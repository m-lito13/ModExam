using ProductsApi.Application.Dtos;

namespace ProductsApi.Application.Interfaces;

public interface ICategoryService
{
    Task<IEnumerable<CategoryDto>> GetCategoriesAsync();
    Task<CategoryDto?> GetCategoryByIdAsync(int id);
    Task<IEnumerable<ProductDto>?> GetProductsByCategoryAsync(int id);
}
