using MediatR;
using SoftwareFactory.Application.Modules.Orders.Dtos;

namespace SoftwareFactory.Application.Modules.Orders.Commands.PlaceOrder;

/// <summary>Matches the openapi PlaceOrderRequest schema. The checkout use case.</summary>
public sealed record PlaceOrderCommand(
    Guid CartId,
    string CustomerName,
    string CustomerEmail,
    string? CustomerPhone,
    string ShippingAddress,
    string PaymentMethod) : IRequest<OrderDto>;
