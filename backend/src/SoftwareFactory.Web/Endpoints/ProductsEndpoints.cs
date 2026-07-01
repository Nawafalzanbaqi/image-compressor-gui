using MediatR;
using SoftwareFactory.Application.Modules.Products.Commands.CreateProduct;
using SoftwareFactory.Application.Modules.Products.Queries.GetProductBySlug;
using SoftwareFactory.Application.Modules.Products.Queries.GetProducts;
using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Web.Endpoints;

/// <summary>
/// Products module endpoints. No business logic here — each route binds input,
/// sends a MediatR request and returns the result (matches openapi.yaml).
/// </summary>
public static class ProductsEndpoints
{
    public static IEndpointRouteBuilder MapProductsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/products").WithTags("Products");

        group.MapGet("/", async (ISender sender, int page = 1, int pageSize = 20,
            string? categorySlug = null, string? search = null) =>
        {
            var result = await sender.Send(new GetProductsQuery(page, pageSize, categorySlug, search));
            return Results.Ok(result);
        });

        group.MapGet("/{slug}", async (string slug, ISender sender) =>
        {
            var product = await sender.Send(new GetProductBySlugQuery(slug));
            return Results.Ok(product);
        });

        group.MapPost("/", async (CreateProductCommand command, ISender sender) =>
        {
            var created = await sender.Send(command);
            return Results.Created($"/api/products/{created.Slug}", created);
        });

        return app;
    }
}
