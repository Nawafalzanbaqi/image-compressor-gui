using MediatR;
using SoftwareFactory.Application.Common.Behaviours;
using SoftwareFactory.Domain.Modules.Restaurant;

namespace SoftwareFactory.Application.Modules.Restaurant.Branches.Queries.GetBranches;

public sealed record BranchDto(
    Guid Id, string Slug, string Name, string Address, string City,
    double Latitude, double Longitude, string? Phone, string? OpeningHours)
{
    public static BranchDto From(Branch b) => new(
        b.Id, b.Slug, b.Name, b.Address, b.City, b.Latitude, b.Longitude, b.Phone, b.OpeningHours);
}

/// <summary>Active branches for the locator + map. Cached.</summary>
public sealed record GetBranchesQuery : IRequest<IReadOnlyList<BranchDto>>, ICacheableQuery
{
    public string CacheKey => "branches:all";
    public TimeSpan? Ttl => TimeSpan.FromMinutes(10);
}
