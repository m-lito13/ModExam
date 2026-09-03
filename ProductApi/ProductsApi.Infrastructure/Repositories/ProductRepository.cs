using Microsoft.EntityFrameworkCore;
using ProductsApi.Domain.Common;
using ProductsApi.Domain.Entities;
using ProductsApi.Domain.Interfaces;
using ProductsApi.Infrastructure.Persistence;

namespace ProductsApi.Infrastructure.Repositories;

public class ProductRepository(ApplicationDbContext context) : IProductRepository
{
    public async Task<PagedResult<Product>> GetAllAsync(int pageNumber, int pageSize) =>
        await PageAsync(context.Products.AsNoTracking(), pageNumber, pageSize);

    public async Task<Product?> GetByIdAsync(int id) =>
        await context.Products.FindAsync(id);

    public async Task<PagedResult<Product>> GetByCategoryIdAsync(int categoryId, int pageNumber, int pageSize) =>
        await PageAsync(context.Products.AsNoTracking().Where(p => p.CategoryId == categoryId), pageNumber, pageSize);

    private static async Task<PagedResult<Product>> PageAsync(IQueryable<Product> query, int pageNumber, int pageSize)
    {
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(p => p.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Product>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }
}
