using ProductsApi.Domain.Common;

namespace ProductsApi.Tests;

public class PagingParamsTests
{
    [Theory]
    [InlineData(1, 1)]
    [InlineData(0, 1)]
    [InlineData(-5, 1)]
    [InlineData(int.MinValue, 1)]
    public void Normalize_ClampsPageNumberToAtLeastOne(int input, int expected)
    {
        var (pageNumber, _) = PagingParams.Normalize(input, 10);

        Assert.Equal(expected, pageNumber);
    }

    [Theory]
    [InlineData(10, 10)]
    [InlineData(0, 1)]
    [InlineData(-1, 1)]
    [InlineData(100, 100)]
    [InlineData(101, 100)]
    [InlineData(int.MaxValue, 100)]
    public void Normalize_ClampsPageSizeBetweenOneAndMax(int input, int expected)
    {
        var (_, pageSize) = PagingParams.Normalize(1, input);

        Assert.Equal(expected, pageSize);
    }
}
