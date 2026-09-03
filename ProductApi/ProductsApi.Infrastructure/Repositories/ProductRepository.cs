using Microsoft.EntityFrameworkCore;
using ProductsApi.Domain.Entities;
using ProductsApi.Domain.Interfaces;
using ProductsApi.Infrastructure.Persistence;

namespace ProductsApi.Infrastructure.Repositories;

public class ProductRepository(ApplicationDbContext context) : IProductRepository
{
    public async Task<IEnumerable<Product>> GetAllAsync() =>
        await context.Products.ToListAsync();

    public async Task<Product?> GetByIdAsync(int id) =>
        await context.Products.FindAsync(id);
}
