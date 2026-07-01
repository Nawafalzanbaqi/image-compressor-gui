using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Shared.Commerce.Catalog;
using SoftwareFactory.Application.Shared.Commerce.Cart.Dtos;
using CartAggregate = SoftwareFactory.Domain.Shared.Commerce.Cart.Cart;

namespace SoftwareFactory.Application.Shared.Commerce.Cart.Commands.AddCartItem;

/// <summary>
/// SHARED/CORE use case. Resolves the priced item via <see cref="ICatalogService"/>
/// (vertical-agnostic) rather than querying a specific catalog entity, so both the
/// ecommerce (Products) and restaurant (MenuItems) verticals reuse it unchanged.
/// </summary>
public sealed class AddCartItemCommandHandler : IRequestHandler<AddCartItemCommand, CartDto>
{
    private readonly IAppDbContext _db;
    private readonly ICatalogService _catalog;

    public AddCartItemCommandHandler(IAppDbContext db, ICatalogService catalog)
    {
        _db = db;
        _catalog = catalog;
    }

    public async Task<CartDto> Handle(AddCartItemCommand request, CancellationToken ct)
    {
        var item = await _catalog.GetItemAsync(request.ProductId, ct)
            ?? throw new NotFoundException("CatalogItem", request.ProductId);

        if (!item.Available)
            throw new InvalidOperationException("Item is unavailable.");

        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == request.CartId, ct);

        if (cart is null)
        {
            cart = new CartAggregate(request.CartId);
            _db.Carts.Add(cart);
        }

        cart.AddItem(item.Id, item.Name, item.Price, request.Quantity);
        await _db.SaveChangesAsync(ct);

        return CartDto.From(cart);
    }
}
