using ProductsApi.Application.Mapping;
using ProductsApi.Domain.Entities;

namespace ProductsApi.Tests.Mapping;

public class CategoryMapperTests
{
    [Fact]
    public void ToDto_MapsAllFields()
    {
        var category = new Category { Id = 7, Name = "Electronics" };

        var dto = category.ToDto();

        Assert.Equal(category.Id, dto.Id);
        Assert.Equal(category.Name, dto.Name);
    }
}
