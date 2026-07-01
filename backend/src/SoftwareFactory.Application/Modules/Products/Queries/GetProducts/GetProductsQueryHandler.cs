using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Common.Models;
using SoftwareFactory.Application.Modules.Products.Dtos;

namespace SoftwareFactory.Application.Modules.Products.Queries.GetProducts;

public sealed class GetProductsQueryHandler
    : IRequestHandler<GetProductsQuery, PagedResult<ProductDto>>
{
    private readonly IAppDbContext _db;

    public GetProductsQueryHandler(IAppDbContext db) => _db = db;

    public async Task<PagedResult<ProductDto>> Handle(GetProductsQuery request, CancellationToken ct)
    {
        // EF Core LINQ only — parameterized queries, no string concatenation.
        var query = _db.Products.AsNoTracking().Where(p => p.IsActive);

        if (!string.IsNullOrWhiteSpace(request.CategorySlug))
        {
            var categoryId = await _db.Categories
                .Where(c => c.Slug == request.CategorySlug)
                .Select(c => (Guid?)c.Id)
                .FirstOrDefaultAsync(ct);
            query = query.Where(p => p.CategoryId == categoryId);
        }

        if (!string.IsNullOrWhiteSpace(request.Search))
        {
            var term = request.Search.Trim().ToLower();
            // Portable case-insensitive match: translates to LOWER(...) LIKE on
            // Postgres and works with the InMemory provider used in unit tests.
            query = query.Where(p => p.Name.ToLower().Contains(term));
        }

        var totalCount = await query.CountAsync(ct);

        var page = Math.Max(1, request.Page);
        var pageSize = Math.Clamp(request.PageSize, 1, 100);

        var products = await query
            .OrderByDescending(p => p.CreatedAtUtc)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync(ct);

        // Resolve category slugs in one round-trip.
        var categoryIds = products.Select(p => p.CategoryId).Distinct().ToList();
        var slugs = await _db.Categories
            .Where(c => categoryIds.Contains(c.Id))
            .ToDictionaryAsync(c => c.Id, c => c.Slug, ct);

        var items = products
            .Select(p => ProductDto.From(p, slugs.GetValueOrDefault(p.CategoryId, string.Empty)))
            .ToList();

        return new PagedResult<ProductDto>(items, page, pageSize, totalCount);
    }
}
