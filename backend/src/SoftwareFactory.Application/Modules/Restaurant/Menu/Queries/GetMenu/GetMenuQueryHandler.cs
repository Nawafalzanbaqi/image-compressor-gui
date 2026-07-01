using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Restaurant.Menu.Dtos;

namespace SoftwareFactory.Application.Modules.Restaurant.Menu.Queries.GetMenu;

public sealed class GetMenuQueryHandler : IRequestHandler<GetMenuQuery, MenuDto>
{
    private readonly IAppDbContext _db;

    public GetMenuQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MenuDto> Handle(GetMenuQuery request, CancellationToken ct)
    {
        var categories = await _db.MenuCategories.AsNoTracking()
            .OrderBy(c => c.DisplayOrder).ThenBy(c => c.Name)
            .ToListAsync(ct);

        var items = await _db.MenuItems.AsNoTracking()
            .Where(m => m.IsActive)
            .ToListAsync(ct);

        var slugById = categories.ToDictionary(c => c.Id, c => c.Slug);

        var categoryDtos = categories.Select(c => new MenuCategoryDto(
            c.Id, c.Slug, c.Name, c.DisplayOrder,
            items.Where(m => m.MenuCategoryId == c.Id)
                .OrderBy(m => m.Name)
                .Select(m => MenuItemDto.From(m, slugById.GetValueOrDefault(m.MenuCategoryId, string.Empty)))
                .ToList()))
            .ToList();

        return new MenuDto(categoryDtos);
    }
}
