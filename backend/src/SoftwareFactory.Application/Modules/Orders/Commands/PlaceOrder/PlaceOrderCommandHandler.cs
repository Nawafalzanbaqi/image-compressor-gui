using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Orders.Dtos;
using SoftwareFactory.Domain.Modules.Orders;

namespace SoftwareFactory.Application.Modules.Orders.Commands.PlaceOrder;

/// <summary>
/// Checkout: snapshots the cart into an order, computes the total, generates an
/// order number, raises OrderPlacedDomainEvent and empties the cart.
/// </summary>
public sealed class PlaceOrderCommandHandler : IRequestHandler<PlaceOrderCommand, OrderDto>
{
    private readonly IAppDbContext _db;

    public PlaceOrderCommandHandler(IAppDbContext db) => _db = db;

    public async Task<OrderDto> Handle(PlaceOrderCommand request, CancellationToken ct)
    {
        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == request.CartId, ct)
            ?? throw new NotFoundException("Cart", request.CartId);

        if (cart.Items.Count == 0)
            throw new InvalidOperationException("Cannot check out an empty cart.");

        var order = new Order(
            request.CustomerName,
            request.CustomerEmail,
            request.ShippingAddress,
            request.PaymentMethod,
            request.CustomerPhone);

        foreach (var item in cart.Items)
            order.AddItem(item.ProductId, item.ProductName, item.UnitPrice, item.Quantity);

        order.Place(); // raises OrderPlacedDomainEvent

        _db.Orders.Add(order);
        cart.Clear();
        await _db.SaveChangesAsync(ct);

        // TODO(phase-2): hand off to payment provider (tamara/tabi) and ZATCA e-invoice.
        return OrderDto.From(order);
    }
}
