using SoftwareFactory.Application.Common.Models;
using SoftwareFactory.Domain.Modules.Products;

namespace SoftwareFactory.Application.Modules.Products.Dtos;

/// <summary>Matches the openapi ProductDto schema.</summary>
public sealed record ProductDto(
    Guid Id,
    string Slug,
    string Name,
    string? Description,
    MoneyDto Price,
    string CategorySlug,
    IReadOnlyList<string> ImageUrls,
    bool InStock,
    bool IsActive)
{
    public static ProductDto From(Product p, string categorySlug) => new(
        p.Id, p.Slug, p.Name, p.Description, MoneyDto.From(p.Price),
        categorySlug, p.ImageUrls, p.InStock, p.IsActive);
}
