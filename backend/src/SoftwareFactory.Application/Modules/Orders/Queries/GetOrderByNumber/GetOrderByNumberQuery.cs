using MediatR;
using SoftwareFactory.Application.Modules.Orders.Dtos;

namespace SoftwareFactory.Application.Modules.Orders.Queries.GetOrderByNumber;

/// <summary>Order tracking use case.</summary>
public sealed record GetOrderByNumberQuery(string OrderNumber) : IRequest<OrderDto>;
