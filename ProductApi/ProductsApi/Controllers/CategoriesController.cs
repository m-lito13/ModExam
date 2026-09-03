using Microsoft.AspNetCore.Mvc;
using ProductsApi.Application.Dtos;
using ProductsApi.Application.Interfaces;

namespace ProductsApi.Controllers;

[ApiController]
[Route("api/categories")]
[Produces("application/json")]
public class CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger) : ControllerBase
{
    // GET /api/categories
    [HttpGet]
    public async Task<ActionResult<IEnumerable<CategoryDto>>> GetCategories()
    {
        logger.LogInformation("Fetching all categories with products");
        return Ok(await categoryService.GetCategoriesAsync());
    }

    // GET /api/categories/{id}
    [HttpGet("{id:int}")]
    public async Task<ActionResult<CategoryDto>> GetCategoryById(int id)
    {
        var category = await categoryService.GetCategoryByIdAsync(id);
        return category is null ? NotFound() : Ok(category);
    }

    // GET /api/categories/{id}/products
    [HttpGet("{id:int}/products")]
    public async Task<ActionResult<IEnumerable<ProductDto>>> GetProductsByCategory(int id)
    {
        var products = await categoryService.GetProductsByCategoryAsync(id);
        return products is null ? NotFound() : Ok(products);
    }
}
