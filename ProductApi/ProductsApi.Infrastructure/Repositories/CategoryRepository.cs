using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using ProductsApi.Domain.Common;
using ProductsApi.Domain.Entities;
using ProductsApi.Domain.Interfaces;
using ProductsApi.Infrastructure.Persistence;

namespace ProductsApi.Infrastructure.Repositories;

public class CategoryRepository(ApplicationDbContext context, ILogger<CategoryRepository> logger) : ICategoryRepository
{
    public async Task<PagedResult<Category>> GetAllAsync(int pageNumber, int pageSize)
    {
        logger.LogTrace("Querying categories page {PageNumber} (size {PageSize})", pageNumber, pageSize);
        var query = context.Categories.AsNoTracking();

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(c => c.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        logger.LogTrace("Query returned {Count} categories of {TotalCount} total", items.Count, totalCount);
        return new PagedResult<Category>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<Category?> GetByIdAsync(int id)
    {
        logger.LogTrace("Querying category {CategoryId}", id);
        var category = await context.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
        logger.LogTrace("Query for category {CategoryId} returned {Found}", id, category is not null);
        return category;
    }
}
