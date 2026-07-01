using MediatR;
using SoftwareFactory.Application.Common.Behaviours;
using SoftwareFactory.Application.Modules.Categories.Dtos;

namespace SoftwareFactory.Application.Modules.Categories.Queries.GetCategories;

public sealed record GetCategoriesQuery : IRequest<IReadOnlyList<CategoryDto>>, ICacheableQuery
{
    public string CacheKey => "categories:all";
    public TimeSpan? Ttl => TimeSpan.FromMinutes(10);
}
