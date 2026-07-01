using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Application.Shared.Commerce.Catalog;

/// <summary>
/// Vertical-agnostic view of a purchasable item, resolved from whichever catalog
/// the active siteType provides (Products for ecommerce, MenuItems for restaurant).
/// </summary>
public sealed record CatalogItem(Guid Id, string Name, Money Price, bool Available);

/// <summary>
/// SHARED/CORE abstraction. The shared Cart/Checkout use cases depend on this
/// instead of any vertical's catalog entity, so they generalize across verticals.
/// Each vertical registers its own implementation (selected by options.json siteType).
/// </summary>
public interface ICatalogService
{
    Task<CatalogItem?> GetItemAsync(Guid id, CancellationToken cancellationToken = default);
}
