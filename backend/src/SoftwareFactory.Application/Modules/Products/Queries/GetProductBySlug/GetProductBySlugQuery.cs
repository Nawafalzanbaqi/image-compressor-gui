using MediatR;
using SoftwareFactory.Application.Modules.Products.Dtos;

namespace SoftwareFactory.Application.Modules.Products.Queries.GetProductBySlug;

public sealed record GetProductBySlugQuery(string Slug) : IRequest<ProductDto>;
