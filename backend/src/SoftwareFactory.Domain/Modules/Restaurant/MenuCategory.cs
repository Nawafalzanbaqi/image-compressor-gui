using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Restaurant;

/// <summary>A section of the menu (e.g. Starters, Mains, Desserts).</summary>
public class MenuCategory : BaseEntity
{
    public string Slug { get; private set; } = default!;
    public string Name { get; private set; } = default!;
    public int DisplayOrder { get; private set; }

    private MenuCategory() { } // EF

    public MenuCategory(string name, int displayOrder = 0, string? slug = null)
    {
        Name = name;
        DisplayOrder = displayOrder;
        Slug = (slug is null ? Common.Slug.From(name) : Common.Slug.From(slug)).Value;
    }
}
