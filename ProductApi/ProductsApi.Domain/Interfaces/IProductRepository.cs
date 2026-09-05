using ProductsApi.Domain.Common;
using ProductsApi.Domain.Entities;

namespace ProductsApi.Domain.Interfaces;

public interface IProductRepository
{
    Task<PagedResult<Product>> GetAllAsync(int pageNumber, int pageSize);
    Task<Product?> GetByIdAsync(int id);
    Task<PagedResult<Product>> GetByCategoryIdAsync(int categoryId, int pageNumber, int pageSize);
}
