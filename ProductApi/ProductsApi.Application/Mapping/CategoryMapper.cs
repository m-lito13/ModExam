using ProductsApi.Application.Dtos;
using ProductsApi.Domain.Entities;

namespace ProductsApi.Application.Mapping;

public static class CategoryMapper
{
    public static CategoryDto ToDto(this Category category) => new()
    {
        Id = category.Id,
        Name = category.Name
    };
}
