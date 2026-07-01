using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Restaurant;

/// <summary>A dish on the menu. Feeds the shared cart via the MenuCatalogService.</summary>
public class MenuItem : BaseEntity
{
    public string Slug { get; private set; } = default!;
    public string Name { get; private set; } = default!;
    public string? Description { get; private set; }
    public Money Price { get; private set; } = Money.Zero();
    public Guid MenuCategoryId { get; private set; }
    public List<string> ImageUrls { get; private set; } = new();
    public bool IsVegetarian { get; private set; }
    public bool IsSpicy { get; private set; }
    public bool IsAvailable { get; private set; } = true;
    public bool IsActive { get; private set; } = true;

    private MenuItem() { } // EF

    public MenuItem(string name, Money price, Guid menuCategoryId, string? description = null,
        IEnumerable<string>? imageUrls = null, bool isVegetarian = false, bool isSpicy = false,
        string? slug = null)
    {
        Name = name;
        Price = price;
        MenuCategoryId = menuCategoryId;
        Description = description;
        ImageUrls = imageUrls?.ToList() ?? new List<string>();
        IsVegetarian = isVegetarian;
        IsSpicy = isSpicy;
        Slug = (slug is null ? Common.Slug.From(name) : Common.Slug.From(slug)).Value;
    }

    public void SetAvailability(bool available) { IsAvailable = available; UpdatedAtUtc = DateTime.UtcNow; }
}
