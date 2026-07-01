using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Products;

/// <summary>Catalog product aggregate root.</summary>
public class Product : BaseEntity
{
    public string Slug { get; private set; } = default!;
    public string Name { get; private set; } = default!;
    public string? Description { get; private set; }
    public Money Price { get; private set; } = Money.Zero();
    public Guid CategoryId { get; private set; }
    public List<string> ImageUrls { get; private set; } = new();
    public bool InStock { get; private set; } = true;
    public bool IsActive { get; private set; } = true;

    private Product() { } // EF

    public Product(string name, Money price, Guid categoryId, string? description = null,
        IEnumerable<string>? imageUrls = null, string? slug = null)
    {
        Name = name;
        Price = price;
        CategoryId = categoryId;
        Description = description;
        ImageUrls = imageUrls?.ToList() ?? new List<string>();
        Slug = (slug is null ? Common.Slug.From(name) : Common.Slug.From(slug)).Value;
        Raise(new ProductCreatedDomainEvent(Id, Name));
    }

    public void SetStock(bool inStock) { InStock = inStock; Touch(); }
    public void Activate(bool isActive) { IsActive = isActive; Touch(); }

    public void UpdateDetails(string name, string? description, Money price)
    {
        Name = name;
        Description = description;
        Price = price;
        Touch();
    }

    private void Touch() => UpdatedAtUtc = DateTime.UtcNow;
}
