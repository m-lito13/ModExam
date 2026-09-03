using Microsoft.EntityFrameworkCore;
using ProductsApi.Domain.Entities;

namespace ProductsApi.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();
}
