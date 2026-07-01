using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Domain.Modules.Products;

public sealed record ProductCreatedDomainEvent(Guid ProductId, string Name) : IDomainEvent
{
    public DateTime OccurredOnUtc { get; } = DateTime.UtcNow;
}
