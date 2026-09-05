using ProductsApi.Application.Mapping;
using ProductsApi.Domain.Entities;

namespace ProductsApi.Tests.Mapping;

public class ProductMapperTests
{
    [Fact]
    public void ToDto_MapsAllFields()
    {
        var product = new Product
        {
            Id = 3,
            Name = "Widget",
            Price = 19.99m,
            StockQuantity = 42,
            CategoryId = 7
        };

        var dto = product.ToDto();

        Assert.Equal(product.Id, dto.Id);
        Assert.Equal(product.Name, dto.Name);
        Assert.Equal(product.Price, dto.Price);
        Assert.Equal(product.StockQuantity, dto.StockQuantity);
        Assert.Equal(product.CategoryId, dto.CategoryId);
    }
}
