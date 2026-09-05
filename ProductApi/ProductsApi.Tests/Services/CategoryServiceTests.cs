using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using ProductsApi.Application.Services;
using ProductsApi.Domain.Common;
using ProductsApi.Domain.Entities;
using ProductsApi.Domain.Interfaces;

namespace ProductsApi.Tests.Services;

public class CategoryServiceTests
{
    private readonly Mock<ICategoryRepository> _categoryRepository = new();
    private readonly Mock<IProductRepository> _productRepository = new();
    private readonly CategoryService _sut;

    public CategoryServiceTests()
    {
        _sut = new CategoryService(_categoryRepository.Object, _productRepository.Object, NullLogger<CategoryService>.Instance);
    }

    [Fact]
    public async Task GetCategoriesAsync_NormalizesPagingBeforeCallingRepository()
    {
        _categoryRepository
            .Setup(r => r.GetAllAsync(1, 100))
            .ReturnsAsync(new PagedResult<Category>
            {
                Items = [new Category { Id = 1, Name = "Books" }],
                PageNumber = 1,
                PageSize = 100,
                TotalCount = 1
            });

        var result = await _sut.GetCategoriesAsync(pageNumber: 0, pageSize: 1000);

        _categoryRepository.Verify(r => r.GetAllAsync(1, 100), Times.Once);
        Assert.Single(result.Items);
        Assert.Equal("Books", result.Items[0].Name);
    }

    [Fact]
    public async Task GetCategoryByIdAsync_ReturnsNull_WhenCategoryDoesNotExist()
    {
        _categoryRepository.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Category?)null);

        var result = await _sut.GetCategoryByIdAsync(99);

        Assert.Null(result);
    }

    [Fact]
    public async Task GetCategoryByIdAsync_ReturnsMappedDto_WhenCategoryExists()
    {
        _categoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Category { Id = 1, Name = "Books" });

        var result = await _sut.GetCategoryByIdAsync(1);

        Assert.NotNull(result);
        Assert.Equal(1, result!.Id);
        Assert.Equal("Books", result.Name);
    }

    [Fact]
    public async Task GetProductsByCategoryAsync_ReturnsNull_WhenCategoryDoesNotExist()
    {
        _categoryRepository.Setup(r => r.GetByIdAsync(99)).ReturnsAsync((Category?)null);

        var result = await _sut.GetProductsByCategoryAsync(99, 1, 10);

        Assert.Null(result);
        _productRepository.Verify(r => r.GetByCategoryIdAsync(It.IsAny<int>(), It.IsAny<int>(), It.IsAny<int>()), Times.Never);
    }

    [Fact]
    public async Task GetProductsByCategoryAsync_NormalizesPagingAndReturnsMappedProducts_WhenCategoryExists()
    {
        _categoryRepository.Setup(r => r.GetByIdAsync(1)).ReturnsAsync(new Category { Id = 1, Name = "Books" });
        _productRepository
            .Setup(r => r.GetByCategoryIdAsync(1, 1, 100))
            .ReturnsAsync(new PagedResult<Product>
            {
                Items = [new Product { Id = 5, Name = "Widget", Price = 9.99m, StockQuantity = 3, CategoryId = 1 }],
                PageNumber = 1,
                PageSize = 100,
                TotalCount = 1
            });

        var result = await _sut.GetProductsByCategoryAsync(1, pageNumber: 0, pageSize: 1000);

        Assert.NotNull(result);
        _productRepository.Verify(r => r.GetByCategoryIdAsync(1, 1, 100), Times.Once);
        Assert.Single(result!.Items);
        Assert.Equal("Widget", result.Items[0].Name);
    }
}
