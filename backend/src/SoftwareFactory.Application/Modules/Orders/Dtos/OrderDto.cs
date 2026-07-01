using SoftwareFactory.Application.Common.Models;
using SoftwareFactory.Domain.Modules.Orders;

namespace SoftwareFactory.Application.Modules.Orders.Dtos;

public sealed record OrderItemDto(Guid ProductId, string ProductName, MoneyDto UnitPrice, int Quantity);

public sealed record OrderDto(
    Guid Id,
    string OrderNumber,
    string Status,
    IReadOnlyList<OrderItemDto> Items,
    MoneyDto Total,
    DateTime PlacedAt)
{
    public static OrderDto From(Order o) => new(
        o.Id,
        o.OrderNumber,
        o.Status.ToString(),
        o.Items.Select(i => new OrderItemDto(
            i.ProductId, i.ProductName, MoneyDto.From(i.UnitPrice), i.Quantity)).ToList(),
        MoneyDto.From(o.Total),
        o.PlacedAtUtc);
}
