using MediatR;
using SoftwareFactory.Application.Modules.Restaurant.Reservations.Dtos;

namespace SoftwareFactory.Application.Modules.Restaurant.Reservations.Queries.GetReservationByReference;

public sealed record GetReservationByReferenceQuery(string ReferenceNumber) : IRequest<ReservationDto>;
