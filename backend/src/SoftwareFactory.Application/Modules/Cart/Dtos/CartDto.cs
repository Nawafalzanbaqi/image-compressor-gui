using SoftwareFactory.Application.Common.Models;
using CartAggregate = SoftwareFactory.Domain.Modules.Cart.Cart;

namespace SoftwareFactory.Application.Modules.Cart.Dtos;

public sealed record CartItemDto(
    Guid ProductId, string ProductName, MoneyDto UnitPrice, int Quantity, MoneyDto LineTotal);

public sealed record CartDto(Guid Id, IReadOnlyList<CartItemDto> Items, MoneyDto Subtotal, int ItemCount)
{
    public static CartDto From(CartAggregate cart) => new(
        cart.Id,
        cart.Items.Select(i => new CartItemDto(
            i.ProductId, i.ProductName, MoneyDto.From(i.UnitPrice), i.Quantity, MoneyDto.From(i.LineTotal)))
            .ToList(),
        MoneyDto.From(cart.Subtotal),
        cart.ItemCount);
}
