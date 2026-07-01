using MediatR;
using SoftwareFactory.Application.Modules.Products.Dtos;

namespace SoftwareFactory.Application.Modules.Products.Commands.CreateProduct;

/// <summary>Matches the openapi CreateProductRequest schema.</summary>
public sealed record CreateProductCommand(
    string Name,
    string? Description,
    decimal PriceAmount,
    string Currency,
    string CategorySlug,
    IReadOnlyList<string>? ImageUrls) : IRequest<ProductDto>;
