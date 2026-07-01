using SoftwareFactory.Application.Common.Models;
using SoftwareFactory.Domain.Modules.Restaurant;

namespace SoftwareFactory.Application.Modules.Restaurant.Menu.Dtos;

public sealed record MenuItemDto(
    Guid Id,
    string Slug,
    string Name,
    string? Description,
    MoneyDto Price,
    string MenuCategorySlug,
    IReadOnlyList<string> ImageUrls,
    bool IsVegetarian,
    bool IsSpicy,
    bool IsAvailable)
{
    public static MenuItemDto From(MenuItem m, string categorySlug) => new(
        m.Id, m.Slug, m.Name, m.Description, MoneyDto.From(m.Price), categorySlug,
        m.ImageUrls, m.IsVegetarian, m.IsSpicy, m.IsAvailable);
}

public sealed record MenuCategoryDto(
    Guid Id, string Slug, string Name, int DisplayOrder, IReadOnlyList<MenuItemDto> Items);

public sealed record MenuDto(IReadOnlyList<MenuCategoryDto> Categories);
