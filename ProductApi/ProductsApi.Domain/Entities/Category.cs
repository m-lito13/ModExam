namespace ProductsApi.Domain.Entities;

public class Category
{
    public const int NameMaxLength = 80;

    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;

    public ICollection<Product> Products { get; set; } = new List<Product>();
}
