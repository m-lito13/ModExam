namespace ProductsApi.Domain.Entities;

public class Product
{
    public const int NameMaxLength = 150;

    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }

    public int CategoryId { get; set; }
    public Category? Category { get; set; }
}
