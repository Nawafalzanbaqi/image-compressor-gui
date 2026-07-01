using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Restaurant.Reservations.Dtos;

namespace SoftwareFactory.Application.Modules.Restaurant.Reservations.Queries.GetReservationByReference;

public sealed class GetReservationByReferenceQueryHandler
    : IRequestHandler<GetReservationByReferenceQuery, ReservationDto>
{
    private readonly IAppDbContext _db;

    public GetReservationByReferenceQueryHandler(IAppDbContext db) => _db = db;

    public async Task<ReservationDto> Handle(GetReservationByReferenceQuery request, CancellationToken ct)
    {
        var reservation = await _db.Reservations.AsNoTracking()
            .FirstOrDefaultAsync(r => r.ReferenceNumber == request.ReferenceNumber, ct)
            ?? throw new NotFoundException("Reservation", request.ReferenceNumber);

        return ReservationDto.From(reservation);
    }
}
