using MediatR;
using SoftwareFactory.Application.Common.Behaviours;
using SoftwareFactory.Application.Modules.Restaurant.Menu.Dtos;

namespace SoftwareFactory.Application.Modules.Restaurant.Menu.Queries.GetMenu;

/// <summary>Full menu grouped by category. Cached (hot read).</summary>
public sealed record GetMenuQuery : IRequest<MenuDto>, ICacheableQuery
{
    public string CacheKey => "menu:all";
    public TimeSpan? Ttl => TimeSpan.FromMinutes(5);
}
