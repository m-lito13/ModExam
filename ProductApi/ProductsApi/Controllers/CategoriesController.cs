using Microsoft.AspNetCore.Mvc;
using ProductsApi.Application.Dtos;
using ProductsApi.Application.Interfaces;
using ProductsApi.Domain.Common;

namespace ProductsApi.Controllers;

[ApiController]
[Route("api/categories")]
[Produces("application/json")]
public class CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger) : ControllerBase
{
    // GET /api/categories?pageNumber=1&pageSize=10
    [HttpGet]
    public async Task<ActionResult<PagedResult<CategoryDto>>> GetCategories([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        logger.LogInformation("Fetching categories page {PageNumber} (size {PageSize})", pageNumber, pageSize);
        return Ok(await categoryService.GetCategoriesAsync(pageNumber, pageSize));
    }

    // GET /api/categories/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> GetCategoryById(int id)
    {
        var category = await categoryService.GetCategoryByIdAsync(id);
        return category is null ? NotFound() : Ok(category);
    }

    // GET /api/categories/{id}/products?pageNumber=1&pageSize=10
    [HttpGet("{id:int}/products")]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProductsByCategory(int id, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        var products = await categoryService.GetProductsByCategoryAsync(id, pageNumber, pageSize);
        return products is null ? NotFound() : Ok(products);
    }
}
