using MediatR;
using SoftwareFactory.Application.Shared.Commerce.Orders.Dtos;

namespace SoftwareFactory.Application.Shared.Commerce.Orders.Commands.PlaceOrder;

/// <summary>Matches the openapi PlaceOrderRequest schema. The checkout use case.</summary>
public sealed record PlaceOrderCommand(
    Guid CartId,
    string CustomerName,
    string CustomerEmail,
    string? CustomerPhone,
    string ShippingAddress,
    string PaymentMethod) : IRequest<OrderDto>;
