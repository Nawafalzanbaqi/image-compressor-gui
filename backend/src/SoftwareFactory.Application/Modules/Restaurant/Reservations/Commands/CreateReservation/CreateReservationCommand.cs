using MediatR;
using SoftwareFactory.Application.Modules.Restaurant.Reservations.Dtos;

namespace SoftwareFactory.Application.Modules.Restaurant.Reservations.Commands.CreateReservation;

public sealed record CreateReservationCommand(
    Guid BranchId,
    string CustomerName,
    string CustomerPhone,
    string? CustomerEmail,
    int PartySize,
    DateTime ReservationAtUtc,
    string? Notes) : IRequest<ReservationDto>;
