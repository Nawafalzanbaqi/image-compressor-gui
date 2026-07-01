using MediatR;
using SoftwareFactory.Application.Common.Behaviours;
using SoftwareFactory.Application.Common.Models;
using SoftwareFactory.Application.Modules.Products.Dtos;

namespace SoftwareFactory.Application.Modules.Products.Queries.GetProducts;

/// <summary>Paged, filterable product listing. Cached in Redis via <see cref="ICacheableQuery"/>.</summary>
public sealed record GetProductsQuery(
    int Page = 1,
    int PageSize = 20,
    string? CategorySlug = null,
    string? Search = null) : IRequest<PagedResult<ProductDto>>, ICacheableQuery
{
    public string CacheKey => $"products:p{Page}:s{PageSize}:c{CategorySlug}:q{Search}";
    public TimeSpan? Ttl => TimeSpan.FromMinutes(5);
}
