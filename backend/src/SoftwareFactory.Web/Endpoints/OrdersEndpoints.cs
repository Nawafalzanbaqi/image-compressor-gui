using MediatR;
using SoftwareFactory.Application.Modules.Orders.Commands.PlaceOrder;
using SoftwareFactory.Application.Modules.Orders.Queries.GetOrderByNumber;

namespace SoftwareFactory.Web.Endpoints;

public static class OrdersEndpoints
{
    public static IEndpointRouteBuilder MapOrdersEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/api/orders").WithTags("Orders");

        group.MapPost("/", async (PlaceOrderCommand command, ISender sender) =>
        {
            var order = await sender.Send(command);
            return Results.Created($"/api/orders/{order.OrderNumber}", order);
        });

        group.MapGet("/{orderNumber}", async (string orderNumber, ISender sender) =>
            Results.Ok(await sender.Send(new GetOrderByNumberQuery(orderNumber))));

        return app;
    }
}
