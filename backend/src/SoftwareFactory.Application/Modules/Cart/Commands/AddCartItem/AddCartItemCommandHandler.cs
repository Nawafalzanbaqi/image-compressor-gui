using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Cart.Dtos;
using CartAggregate = SoftwareFactory.Domain.Modules.Cart.Cart;

namespace SoftwareFactory.Application.Modules.Cart.Commands.AddCartItem;

public sealed class AddCartItemCommandHandler : IRequestHandler<AddCartItemCommand, CartDto>
{
    private readonly IAppDbContext _db;

    public AddCartItemCommandHandler(IAppDbContext db) => _db = db;

    public async Task<CartDto> Handle(AddCartItemCommand request, CancellationToken ct)
    {
        var product = await _db.Products
            .FirstOrDefaultAsync(p => p.Id == request.ProductId && p.IsActive, ct)
            ?? throw new NotFoundException("Product", request.ProductId);

        if (!product.InStock)
            throw new InvalidOperationException("Product is out of stock.");

        var cart = await _db.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == request.CartId, ct);

        if (cart is null)
        {
            cart = new CartAggregate(request.CartId);
            _db.Carts.Add(cart);
        }

        cart.AddItem(product.Id, product.Name, product.Price, request.Quantity);
        await _db.SaveChangesAsync(ct);

        return CartDto.From(cart);
    }
}
