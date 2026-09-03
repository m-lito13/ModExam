using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductsApi.Domain.Common;
using ProductsApi.Domain.Entities;
using ProductsApi.Domain.Interfaces;
using ProductsApi.Infrastructure.Persistence;

namespace ProductsApi.Infrastructure.Repositories;

public class ProductRepository(ApplicationDbContext context, ILogger<ProductRepository> logger) : IProductRepository
{
    public async Task<PagedResult<Product>> GetAllAsync(int pageNumber, int pageSize)
    {
        logger.LogTrace("Querying products page {PageNumber} (size {PageSize})", pageNumber, pageSize);
        return await PageAsync(context.Products.AsNoTracking(), pageNumber, pageSize);
    }

    public async Task<Product?> GetByIdAsync(int id)
    {
        logger.LogTrace("Querying product {ProductId}", id);
        var product = await context.Products.FindAsync(id);
        logger.LogTrace("Query for product {ProductId} returned {Found}", id, product is not null);
        return product;
    }

    public async Task<PagedResult<Product>> GetByCategoryIdAsync(int categoryId, int pageNumber, int pageSize)
    {
        logger.LogTrace("Querying products for category {CategoryId} page {PageNumber} (size {PageSize})", categoryId, pageNumber, pageSize);
        return await PageAsync(context.Products.AsNoTracking().Where(p => p.CategoryId == categoryId), pageNumber, pageSize);
    }

    private async Task<PagedResult<Product>> PageAsync(IQueryable<Product> query, int pageNumber, int pageSize)
    {
        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(p => p.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        logger.LogTrace("Query returned {Count} products of {TotalCount} total", items.Count, totalCount);
        return new PagedResult<Product>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }
}
