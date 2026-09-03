using ProductsApi.Application.Dtos;
using ProductsApi.Application.Interfaces;
using ProductsApi.Domain.Common;
using ProductsApi.Domain.Interfaces;

namespace ProductsApi.Application.Services;

public class CategoryService(ICategoryRepository categoryRepository, IProductRepository productRepository) : ICategoryService
{
    private const int MaxPageSize = 100;

    public async Task<PagedResult<CategoryDto>> GetCategoriesAsync(int pageNumber, int pageSize)
    {
        (pageNumber, pageSize) = NormalizePaging(pageNumber, pageSize);
        var categories = await categoryRepository.GetAllAsync(pageNumber, pageSize);
        return ToPagedDto(categories, ToCategoryDto);
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        return category is null ? null : ToCategoryDto(category);
    }

    public async Task<PagedResult<ProductDto>?> GetProductsByCategoryAsync(int id, int pageNumber, int pageSize)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        if (category is null)
        {
            return null;
        }

        (pageNumber, pageSize) = NormalizePaging(pageNumber, pageSize);
        var products = await productRepository.GetByCategoryIdAsync(id, pageNumber, pageSize);
        return ToPagedDto(products, ToProductDto);
    }

    private static (int PageNumber, int PageSize) NormalizePaging(int pageNumber, int pageSize) =>
        (Math.Max(1, pageNumber), Math.Clamp(pageSize, 1, MaxPageSize));

    private static PagedResult<TDto> ToPagedDto<TEntity, TDto>(PagedResult<TEntity> source, Func<TEntity, TDto> map) =>
        new()
        {
            Items = source.Items.Select(map).ToList(),
            PageNumber = source.PageNumber,
            PageSize = source.PageSize,
            TotalCount = source.TotalCount
        };

    private static CategoryDto ToCategoryDto(Domain.Entities.Category category) => new()
    {
        Id = category.Id,
        Name = category.Name
    };

    private static ProductDto ToProductDto(Domain.Entities.Product product) => new()
    {
        Id = product.Id,
        Name = product.Name,
        Price = product.Price,
        CategoryId = product.CategoryId
    };
}
