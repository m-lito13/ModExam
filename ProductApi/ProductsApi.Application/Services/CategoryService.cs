using Microsoft.Extensions.Logging;
using ProductsApi.Application.Dtos;
using ProductsApi.Application.Interfaces;
using ProductsApi.Application.Mapping;
using ProductsApi.Domain.Common;
using ProductsApi.Domain.Interfaces;

namespace ProductsApi.Application.Services;

public class CategoryService(ICategoryRepository categoryRepository, IProductRepository productRepository, ILogger<CategoryService> logger) : ICategoryService
{
    public async Task<PagedResult<CategoryDto>> GetCategoriesAsync(int pageNumber, int pageSize)
    {
        (pageNumber, pageSize) = PagingParams.Normalize(pageNumber, pageSize);
        logger.LogDebug("Retrieving categories page {PageNumber} (size {PageSize})", pageNumber, pageSize);
        var categories = await categoryRepository.GetAllAsync(pageNumber, pageSize);
        logger.LogDebug("Retrieved {Count} categories of {TotalCount} total", categories.Items.Count, categories.TotalCount);
        return ToPagedDto(categories, CategoryMapper.ToDto);
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        if (category is null)
        {
            logger.LogDebug("Category {CategoryId} does not exist", id);
        }

        return category?.ToDto();
    }

    public async Task<PagedResult<ProductDto>?> GetProductsByCategoryAsync(int id, int pageNumber, int pageSize)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        if (category is null)
        {
            logger.LogDebug("Category {CategoryId} does not exist, cannot fetch products", id);
            return null;
        }

        (pageNumber, pageSize) = PagingParams.Normalize(pageNumber, pageSize);
        var products = await productRepository.GetByCategoryIdAsync(id, pageNumber, pageSize);
        logger.LogDebug("Retrieved {Count} products of {TotalCount} total for category {CategoryId}", products.Items.Count, products.TotalCount, id);
        return ToPagedDto(products, ProductMapper.ToDto);
    }

    private static PagedResult<TDto> ToPagedDto<TEntity, TDto>(PagedResult<TEntity> source, Func<TEntity, TDto> map) =>
        new()
        {
            Items = source.Items.Select(map).ToList(),
            PageNumber = source.PageNumber,
            PageSize = source.PageSize,
            TotalCount = source.TotalCount
        };
}
