namespace SoftwareFactory.Domain.Common;

/// <summary>
/// Base for all entities. Carries identity, audit timestamps and a domain-event
/// buffer that Infrastructure dispatches on SaveChanges.
/// </summary>
public abstract class BaseEntity : IHasDomainEvents
{
    private readonly List<IDomainEvent> _domainEvents = new();

    public Guid Id { get; protected set; } = Guid.NewGuid();
    public DateTime CreatedAtUtc { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAtUtc { get; set; }

    public IReadOnlyCollection<IDomainEvent> DomainEvents => _domainEvents.AsReadOnly();

    protected void Raise(IDomainEvent domainEvent) => _domainEvents.Add(domainEvent);

    public void ClearDomainEvents() => _domainEvents.Clear();
}
