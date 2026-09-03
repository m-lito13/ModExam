using Microsoft.EntityFrameworkCore;
using ProductsApi.Domain.Common;
using ProductsApi.Domain.Entities;
using ProductsApi.Domain.Interfaces;
using ProductsApi.Infrastructure.Persistence;

namespace ProductsApi.Infrastructure.Repositories;

public class CategoryRepository(ApplicationDbContext context) : ICategoryRepository
{
    public async Task<PagedResult<Category>> GetAllAsync(int pageNumber, int pageSize)
    {
        var query = context.Categories.AsNoTracking();

        var totalCount = await query.CountAsync();
        var items = await query
            .OrderBy(c => c.Id)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return new PagedResult<Category>
        {
            Items = items,
            PageNumber = pageNumber,
            PageSize = pageSize,
            TotalCount = totalCount
        };
    }

    public async Task<Category?> GetByIdAsync(int id) =>
        await context.Categories.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
}
