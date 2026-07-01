using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Categories;

/// <summary>Product category (optionally nested via ParentId).</summary>
public class Category : BaseEntity
{
    public string Slug { get; private set; } = default!;
    public string Name { get; private set; } = default!;
    public Guid? ParentId { get; private set; }
    public int DisplayOrder { get; private set; }

    private Category() { } // EF

    public Category(string name, int displayOrder = 0, Guid? parentId = null, string? slug = null)
    {
        Name = name;
        DisplayOrder = displayOrder;
        ParentId = parentId;
        Slug = (slug is null ? Common.Slug.From(name) : Common.Slug.From(slug)).Value;
    }
}
