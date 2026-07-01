using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Shared.Commerce.Catalog;
using SoftwareFactory.Infrastructure.Persistence;

namespace SoftwareFactory.Infrastructure.Modules.Restaurant;

/// <summary>
/// Restaurant catalog adapter — resolves cart items from the MenuItems table.
/// Registered as <see cref="ICatalogService"/> when options.json siteType == "restaurant".
/// Proves the shared cart/checkout is genuinely vertical-agnostic.
/// </summary>
public sealed class MenuCatalogService : ICatalogService
{
    private readonly AppDbContext _db;

    public MenuCatalogService(AppDbContext db) => _db = db;

    public async Task<CatalogItem?> GetItemAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var item = await _db.MenuItems.AsNoTracking()
            .FirstOrDefaultAsync(m => m.Id == id && m.IsActive, cancellationToken);

        return item is null
            ? null
            : new CatalogItem(item.Id, item.Name, item.Price, item.IsAvailable);
    }
}
