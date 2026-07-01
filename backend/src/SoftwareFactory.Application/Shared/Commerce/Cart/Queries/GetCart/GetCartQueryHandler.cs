using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Shared.Commerce.Cart.Dtos;

namespace SoftwareFactory.Application.Shared.Commerce.Cart.Queries.GetCart;

public sealed class GetCartQueryHandler : IRequestHandler<GetCartQuery, CartDto>
{
    private readonly IAppDbContext _db;

    public GetCartQueryHandler(IAppDbContext db) => _db = db;

    public async Task<CartDto> Handle(GetCartQuery request, CancellationToken ct)
    {
        var cart = await _db.Carts.AsNoTracking()
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.Id == request.CartId, ct)
            ?? throw new NotFoundException("Cart", request.CartId);

        return CartDto.From(cart);
    }
}
