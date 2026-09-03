using ProductsApi.Domain.Common;
using ProductsApi.Domain.Entities;

namespace ProductsApi.Domain.Interfaces;

public interface ICategoryRepository
{
    Task<PagedResult<Category>> GetAllAsync(int pageNumber, int pageSize);
    Task<Category?> GetByIdAsync(int id);
}
