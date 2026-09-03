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
        logger.LogInformation("Fetching category {CategoryId}", id);
        var category = await categoryService.GetCategoryByIdAsync(id);
        if (category is null)
        {
            logger.LogWarning("Category {CategoryId} not found", id);
            return NotFound();
        }

        return Ok(category);
    }

    // GET /api/categories/{id}/products?pageNumber=1&pageSize=10
    [HttpGet("{id:int}/products")]
    public async Task<ActionResult<PagedResult<ProductDto>>> GetProductsByCategory(int id, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        logger.LogInformation("Fetching products for category {CategoryId} page {PageNumber} (size {PageSize})", id, pageNumber, pageSize);
        var products = await categoryService.GetProductsByCategoryAsync(id, pageNumber, pageSize);
        if (products is null)
        {
            logger.LogWarning("Category {CategoryId} not found when fetching products", id);
            return NotFound();
        }

        return Ok(products);
    }
}
