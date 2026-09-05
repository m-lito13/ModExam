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
    /// <summary>
    /// Gets a paged list of categories.
    /// </summary>
    /// <param name="pageNumber">The 1-based page number to retrieve.</param>
    /// <param name="pageSize">The number of categories per page (max 100).</param>
    [HttpGet]
    public async Task<ActionResult<PagedResult<CategoryDto>>> GetCategories([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        logger.LogInformation("Fetching categories page {PageNumber} (size {PageSize})", pageNumber, pageSize);
        return Ok(await categoryService.GetCategoriesAsync(pageNumber, pageSize));
    }

    /// <summary>
    /// Gets a single category by its id.
    /// </summary>
    /// <param name="id">The category id.</param>
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

    /// <summary>
    /// Gets a paged list of products belonging to a category.
    /// </summary>
    /// <param name="id">The category id.</param>
    /// <param name="pageNumber">The 1-based page number to retrieve.</param>
    /// <param name="pageSize">The number of products per page (max 100).</param>
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
