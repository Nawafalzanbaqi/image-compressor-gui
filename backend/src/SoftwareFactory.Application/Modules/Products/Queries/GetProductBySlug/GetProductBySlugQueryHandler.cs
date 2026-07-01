using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Products.Dtos;

namespace SoftwareFactory.Application.Modules.Products.Queries.GetProductBySlug;

public sealed class GetProductBySlugQueryHandler : IRequestHandler<GetProductBySlugQuery, ProductDto>
{
    private readonly IAppDbContext _db;

    public GetProductBySlugQueryHandler(IAppDbContext db) => _db = db;

    public async Task<ProductDto> Handle(GetProductBySlugQuery request, CancellationToken ct)
    {
        var product = await _db.Products.AsNoTracking()
            .FirstOrDefaultAsync(p => p.Slug == request.Slug && p.IsActive, ct)
            ?? throw new NotFoundException("Product", request.Slug);

        var categorySlug = await _db.Categories
            .Where(c => c.Id == product.CategoryId)
            .Select(c => c.Slug)
            .FirstOrDefaultAsync(ct) ?? string.Empty;

        return ProductDto.From(product, categorySlug);
    }
}
