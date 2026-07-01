using SoftwareFactory.Domain.Modules.Restaurant;

namespace SoftwareFactory.Application.Modules.Restaurant.Reservations.Dtos;

public sealed record ReservationDto(
    Guid Id,
    string ReferenceNumber,
    Guid BranchId,
    string CustomerName,
    string CustomerPhone,
    int PartySize,
    DateTime ReservationAtUtc,
    string Status,
    string? Notes)
{
    public static ReservationDto From(Reservation r) => new(
        r.Id, r.ReferenceNumber, r.BranchId, r.CustomerName, r.CustomerPhone,
        r.PartySize, r.ReservationAtUtc, r.Status.ToString(), r.Notes);
}
