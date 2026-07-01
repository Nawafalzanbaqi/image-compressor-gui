using MediatR;
using SoftwareFactory.Application.Shared.Commerce.Orders.Dtos;

namespace SoftwareFactory.Application.Shared.Commerce.Orders.Queries.GetOrderByNumber;

/// <summary>Order tracking use case.</summary>
public sealed record GetOrderByNumberQuery(string OrderNumber) : IRequest<OrderDto>;
