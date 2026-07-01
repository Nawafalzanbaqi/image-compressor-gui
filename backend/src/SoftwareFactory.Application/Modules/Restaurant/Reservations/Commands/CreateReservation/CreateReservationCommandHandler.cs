using MediatR;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Application.Modules.Restaurant.Reservations.Dtos;
using SoftwareFactory.Domain.Modules.Restaurant;

namespace SoftwareFactory.Application.Modules.Restaurant.Reservations.Commands.CreateReservation;

public sealed class CreateReservationCommandHandler
    : IRequestHandler<CreateReservationCommand, ReservationDto>
{
    private readonly IAppDbContext _db;

    public CreateReservationCommandHandler(IAppDbContext db) => _db = db;

    public async Task<ReservationDto> Handle(CreateReservationCommand request, CancellationToken ct)
    {
        var branchExists = await _db.Branches.AnyAsync(b => b.Id == request.BranchId && b.IsActive, ct);
        if (!branchExists)
            throw new NotFoundException("Branch", request.BranchId);

        var reservation = new Reservation(
            request.BranchId,
            request.CustomerName,
            request.CustomerPhone,
            request.PartySize,
            request.ReservationAtUtc,
            request.CustomerEmail,
            notes: request.Notes);

        _db.Reservations.Add(reservation);
        await _db.SaveChangesAsync(ct);

        // TODO(phase-3): send WhatsApp/email confirmation on ReservationRequestedDomainEvent.
        return ReservationDto.From(reservation);
    }
}
