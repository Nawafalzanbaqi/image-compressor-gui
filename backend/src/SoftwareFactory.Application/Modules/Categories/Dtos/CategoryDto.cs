using SoftwareFactory.Domain.Modules.Categories;

namespace SoftwareFactory.Application.Modules.Categories.Dtos;

public sealed record CategoryDto(Guid Id, string Slug, string Name, string? ParentSlug, int DisplayOrder)
{
    public static CategoryDto From(Category c, string? parentSlug) =>
        new(c.Id, c.Slug, c.Name, parentSlug, c.DisplayOrder);
}
