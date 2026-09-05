using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using Moq;
using ProductsApi.Application.Dtos;
using ProductsApi.Application.Interfaces;
using ProductsApi.Controllers;
using ProductsApi.Domain.Common;

namespace ProductsApi.Tests.Controllers;

public class CategoriesControllerTests
{
    private readonly Mock<ICategoryService> _categoryService = new();
    private readonly CategoriesController _sut;

    public CategoriesControllerTests()
    {
        _sut = new CategoriesController(_categoryService.Object, NullLogger<CategoriesController>.Instance);
    }

    [Fact]
    public async Task GetCategories_ReturnsOkWithPagedResult()
    {
        var paged = new PagedResult<CategoryDto>
        {
            Items = [new CategoryDto { Id = 1, Name = "Books" }],
            PageNumber = 1,
            PageSize = 10,
            TotalCount = 1
        };
        _categoryService.Setup(s => s.GetCategoriesAsync(1, 10)).ReturnsAsync(paged);

        var result = await _sut.GetCategories(1, 10);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(paged, okResult.Value);
    }

    [Fact]
    public async Task GetCategoryById_ReturnsNotFound_WhenServiceReturnsNull()
    {
        _categoryService.Setup(s => s.GetCategoryByIdAsync(99)).ReturnsAsync((CategoryDto?)null);

        var result = await _sut.GetCategoryById(99);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetCategoryById_ReturnsOkWithDto_WhenServiceReturnsCategory()
    {
        var dto = new CategoryDto { Id = 1, Name = "Books" };
        _categoryService.Setup(s => s.GetCategoryByIdAsync(1)).ReturnsAsync(dto);

        var result = await _sut.GetCategoryById(1);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(dto, okResult.Value);
    }

    [Fact]
    public async Task GetProductsByCategory_ReturnsNotFound_WhenServiceReturnsNull()
    {
        _categoryService.Setup(s => s.GetProductsByCategoryAsync(99, 1, 10)).ReturnsAsync((PagedResult<ProductDto>?)null);

        var result = await _sut.GetProductsByCategory(99, 1, 10);

        Assert.IsType<NotFoundResult>(result.Result);
    }

    [Fact]
    public async Task GetProductsByCategory_ReturnsOkWithPagedResult_WhenServiceReturnsProducts()
    {
        var paged = new PagedResult<ProductDto>
        {
            Items = [new ProductDto { Id = 1, Name = "Widget", Price = 9.99m, StockQuantity = 3, CategoryId = 1 }],
            PageNumber = 1,
            PageSize = 10,
            TotalCount = 1
        };
        _categoryService.Setup(s => s.GetProductsByCategoryAsync(1, 1, 10)).ReturnsAsync(paged);

        var result = await _sut.GetProductsByCategory(1, 1, 10);

        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.Same(paged, okResult.Value);
    }
}
