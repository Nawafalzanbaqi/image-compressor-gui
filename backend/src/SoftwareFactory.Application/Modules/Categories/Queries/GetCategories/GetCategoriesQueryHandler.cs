using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Categories.Dtos;

namespace SoftwareFactory.Application.Modules.Categories.Queries.GetCategories;

public sealed class GetCategoriesQueryHandler
    : IRequestHandler<GetCategoriesQuery, IReadOnlyList<CategoryDto>>
{
    private readonly IAppDbContext _db;

    public GetCategoriesQueryHandler(IAppDbContext db) => _db = db;

    public async Task<IReadOnlyList<CategoryDto>> Handle(GetCategoriesQuery request, CancellationToken ct)
    {
        var categories = await _db.Categories.AsNoTracking()
            .OrderBy(c => c.DisplayOrder).ThenBy(c => c.Name)
            .ToListAsync(ct);

        var byId = categories.ToDictionary(c => c.Id, c => c.Slug);

        return categories
            .Select(c => CategoryDto.From(c, c.ParentId is { } pid ? byId.GetValueOrDefault(pid) : null))
            .ToList();
    }
}
