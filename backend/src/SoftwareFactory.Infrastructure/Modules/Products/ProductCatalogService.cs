using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Shared.Commerce.Catalog;
using SoftwareFactory.Infrastructure.Persistence;

namespace SoftwareFactory.Infrastructure.Modules.Products;

/// <summary>
/// Ecommerce catalog adapter — resolves cart items from the Products table.
/// Registered as <see cref="ICatalogService"/> when options.json siteType == "ecommerce".
/// </summary>
public sealed class ProductCatalogService : ICatalogService
{
    private readonly AppDbContext _db;

    public ProductCatalogService(AppDbContext db) => _db = db;

    public async Task<CatalogItem?> GetItemAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var product = await _db.Products.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Id == id && p.IsActive, cancellationToken);

        return product is null
            ? null
            : new CatalogItem(product.Id, product.Name, product.Price, product.InStock);
    }
}
