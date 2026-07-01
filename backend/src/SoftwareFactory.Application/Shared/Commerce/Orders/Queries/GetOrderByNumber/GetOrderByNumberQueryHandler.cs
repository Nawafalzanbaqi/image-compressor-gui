using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Shared.Commerce.Orders.Dtos;

namespace SoftwareFactory.Application.Shared.Commerce.Orders.Queries.GetOrderByNumber;

public sealed class GetOrderByNumberQueryHandler : IRequestHandler<GetOrderByNumberQuery, OrderDto>
{
    private readonly IAppDbContext _db;

    public GetOrderByNumberQueryHandler(IAppDbContext db) => _db = db;

    public async Task<OrderDto> Handle(GetOrderByNumberQuery request, CancellationToken ct)
    {
        var order = await _db.Orders.AsNoTracking()
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.OrderNumber == request.OrderNumber, ct)
            ?? throw new NotFoundException("Order", request.OrderNumber);

        return OrderDto.From(order);
    }
}
