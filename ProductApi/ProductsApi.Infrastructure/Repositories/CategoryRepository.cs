using Microsoft.EntityFrameworkCore;
using ProductsApi.Domain.Entities;
using ProductsApi.Domain.Interfaces;
using ProductsApi.Infrastructure.Persistence;

namespace ProductsApi.Infrastructure.Repositories;

public class CategoryRepository(ApplicationDbContext context) : ICategoryRepository
{
    public async Task<IEnumerable<Category>> GetAllAsync() =>
        await context.Categories.ToListAsync();

    public async Task<Category?> GetByIdAsync(int id) =>
        await context.Categories
            .Include(c => c.Products)
            .FirstOrDefaultAsync(c => c.Id == id);
}
