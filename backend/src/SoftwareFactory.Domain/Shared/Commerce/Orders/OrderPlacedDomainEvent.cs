using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Shared.Commerce.Orders;

public sealed record OrderPlacedDomainEvent(Guid OrderId, string OrderNumber, decimal Total, string Currency)
    : IDomainEvent
{
    public DateTime OccurredOnUtc { get; } = DateTime.UtcNow;
}
