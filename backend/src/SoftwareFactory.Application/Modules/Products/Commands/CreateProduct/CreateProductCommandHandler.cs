using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Products.Dtos;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Products;

namespace SoftwareFactory.Application.Modules.Products.Commands.CreateProduct;

public sealed class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, ProductDto>
{
    private readonly IAppDbContext _db;
    private readonly ICacheService _cache;

    public CreateProductCommandHandler(IAppDbContext db, ICacheService cache)
    {
        _db = db;
        _cache = cache;
    }

    public async Task<ProductDto> Handle(CreateProductCommand request, CancellationToken ct)
    {
        var category = await _db.Categories
            .FirstOrDefaultAsync(c => c.Slug == request.CategorySlug, ct)
            ?? throw new NotFoundException("Category", request.CategorySlug);

        var product = new Product(
            request.Name,
            Money.Of(request.PriceAmount, request.Currency),
            category.Id,
            request.Description,
            request.ImageUrls);

        _db.Products.Add(product);
        await _db.SaveChangesAsync(ct);

        // Invalidate hot-read listing cache so the new product shows up.
        await _cache.RemoveAsync("products:*", ct);

        return ProductDto.From(product, category.Slug);
    }
}
