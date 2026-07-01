using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Restaurant.Menu.Dtos;

namespace SoftwareFactory.Application.Modules.Restaurant.Menu.Queries.GetMenuItemBySlug;

public sealed class GetMenuItemBySlugQueryHandler : IRequestHandler<GetMenuItemBySlugQuery, MenuItemDto>
{
    private readonly IAppDbContext _db;

    public GetMenuItemBySlugQueryHandler(IAppDbContext db) => _db = db;

    public async Task<MenuItemDto> Handle(GetMenuItemBySlugQuery request, CancellationToken ct)
    {
        var item = await _db.MenuItems.AsNoTracking()
            .FirstOrDefaultAsync(m => m.Slug == request.Slug && m.IsActive, ct)
            ?? throw new NotFoundException("MenuItem", request.Slug);

        var categorySlug = await _db.MenuCategories
            .Where(c => c.Id == item.MenuCategoryId)
            .Select(c => c.Slug)
            .FirstOrDefaultAsync(ct) ?? string.Empty;

        return MenuItemDto.From(item, categorySlug);
    }
}
