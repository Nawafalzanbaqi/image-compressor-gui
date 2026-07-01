using MediatR;
using SoftwareFactory.Application.Shared.Commerce.Cart.Commands.AddCartItem;
using SoftwareFactory.Application.Shared.Commerce.Cart.Queries.GetCart;

namespace SoftwareFactory.Web.Endpoints;

public static class CartEndpoints
{
    public sealed record AddCartItemRequest(Guid ProductId, int Quantity = 1);

    public static IEndpointRouteBuilder MapCartEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/cart").WithTags("Cart");

        group.MapGet("/{cartId:guid}", async (Guid cartId, ISender sender) =>
            Results.Ok(await sender.Send(new GetCartQuery(cartId))));

        group.MapPost("/{cartId:guid}/items", async (Guid cartId, AddCartItemRequest body, ISender sender) =>
        {
            var cart = await sender.Send(new AddCartItemCommand(cartId, body.ProductId, body.Quantity));
            return Results.Ok(cart);
        });

        return app;
    }
}
