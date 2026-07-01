using MediatR;
using SoftwareFactory.Application.Modules.Reviews.GetProductReviews;

namespace SoftwareFactory.Web.Endpoints;

/// <summary>
/// SCAFFOLD module — only mapped in Program.cs when <c>features.reviews</c> is true.
/// Demonstrates the config-driven endpoint registration pattern: a disabled feature's
/// endpoints never exist in the routing table.
/// </summary>
public static class ReviewsEndpoints
{
    public static IEndpointRouteBuilder MapReviewsEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/reviews").WithTags("Reviews");

        group.MapGet("/{productId:guid}", async (Guid productId, ISender sender) =>
            Results.Ok(await sender.Send(new GetProductReviewsQuery(productId))));

        return app;
    }
}
