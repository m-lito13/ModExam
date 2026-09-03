using ProductsApi.Application.Dtos;
using ProductsApi.Application.Interfaces;
using ProductsApi.Application.Mapping;
using ProductsApi.Domain.Common;
using ProductsApi.Domain.Interfaces;

namespace ProductsApi.Application.Services;

public class CategoryService(ICategoryRepository categoryRepository, IProductRepository productRepository) : ICategoryService
{
    public async Task<PagedResult<CategoryDto>> GetCategoriesAsync(int pageNumber, int pageSize)
    {
        (pageNumber, pageSize) = PagingParams.Normalize(pageNumber, pageSize);
        var categories = await categoryRepository.GetAllAsync(pageNumber, pageSize);
        return ToPagedDto(categories, CategoryMapper.ToDto);
    }

    public async Task<CategoryDto?> GetCategoryByIdAsync(int id)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        return category?.ToDto();
    }

    public async Task<PagedResult<ProductDto>?> GetProductsByCategoryAsync(int id, int pageNumber, int pageSize)
    {
        var category = await categoryRepository.GetByIdAsync(id);
        if (category is null)
        {
            return null;
        }

        (pageNumber, pageSize) = PagingParams.Normalize(pageNumber, pageSize);
        var products = await productRepository.GetByCategoryIdAsync(id, pageNumber, pageSize);
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
