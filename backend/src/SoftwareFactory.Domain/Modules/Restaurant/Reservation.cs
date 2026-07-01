using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Restaurant;

public enum ReservationStatus
{
    Pending = 0,
    Confirmed = 1,
    Seated = 2,
    Cancelled = 3,
    NoShow = 4
}

/// <summary>A table reservation request. Aggregate root for the reservation module.</summary>
public class Reservation : BaseEntity
{
    public string ReferenceNumber { get; private set; } = default!;
    public Guid BranchId { get; private set; }
    public Guid? TableId { get; private set; }
    public string CustomerName { get; private set; } = default!;
    public string CustomerPhone { get; private set; } = default!;
    public string? CustomerEmail { get; private set; }
    public int PartySize { get; private set; }
    public DateTime ReservationAtUtc { get; private set; }
    public string? Notes { get; private set; }
    public ReservationStatus Status { get; private set; } = ReservationStatus.Pending;

    private Reservation() { } // EF

    public Reservation(Guid branchId, string customerName, string customerPhone, int partySize,
        DateTime reservationAtUtc, string? customerEmail = null, Guid? tableId = null, string? notes = null)
    {
        ReferenceNumber = GenerateReference();
        BranchId = branchId;
        CustomerName = customerName;
        CustomerPhone = customerPhone;
        CustomerEmail = customerEmail;
        PartySize = partySize < 1 ? 1 : partySize;
        ReservationAtUtc = reservationAtUtc;
        TableId = tableId;
        Notes = notes;
        Raise(new ReservationRequestedDomainEvent(Id, ReferenceNumber, BranchId, ReservationAtUtc));
    }

    public void Confirm() => Transition(ReservationStatus.Confirmed);
    public void Cancel() => Transition(ReservationStatus.Cancelled);

    private void Transition(ReservationStatus next)
    {
        Status = next;
        UpdatedAtUtc = DateTime.UtcNow;
    }

    public static string GenerateReference()
    {
        var stamp = DateTime.UtcNow.ToString("yyyyMMdd");
        var rand = Guid.NewGuid().ToString("N")[..6].ToUpperInvariant();
        return $"RS-{stamp}-{rand}";
    }
}

public sealed record ReservationRequestedDomainEvent(Guid ReservationId, string ReferenceNumber,
    Guid BranchId, DateTime ReservationAtUtc) : IDomainEvent
{
    public DateTime OccurredOnUtc { get; } = DateTime.UtcNow;
}
