using Microsoft.EntityFrameworkCore;
using ProductsApi.Domain.Entities;

namespace ProductsApi.Infrastructure.Persistence;

public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : DbContext(options)
{
    public DbSet<Category> Categories => Set<Category>();
    public DbSet<Product> Products => Set<Product>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Category>()
            .Property(c => c.Name)
            .HasMaxLength(Category.NameMaxLength);

        modelBuilder.Entity<Product>()
            .Property(p => p.Name)
            .HasMaxLength(Product.NameMaxLength);

        modelBuilder.Entity<Product>()
            .Property(p => p.Price)
            .HasPrecision(18, 2);
    }
}
