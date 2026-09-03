using ProductsApi.Application.Dtos;
using ProductsApi.Domain.Common;

namespace ProductsApi.Application.Interfaces;

public interface ICategoryService
{
    Task<PagedResult<CategoryDto>> GetCategoriesAsync(int pageNumber, int pageSize);
    Task<CategoryDto?> GetCategoryByIdAsync(int id);
    Task<PagedResult<ProductDto>?> GetProductsByCategoryAsync(int id, int pageNumber, int pageSize);
}
