using ProductsApi.Application.Dtos;
using ProductsApi.Domain.Entities;

namespace ProductsApi.Application.Mapping;

public static class ProductMapper
{
    public static ProductDto ToDto(this Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Price = product.Price,
        StockQuantity = product.StockQuantity,
        CategoryId = product.CategoryId
    };
}
