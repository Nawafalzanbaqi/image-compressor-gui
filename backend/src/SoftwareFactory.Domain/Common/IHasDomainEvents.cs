namespace SoftwareFactory.Domain.Common;

/// <summary>Exposes and clears the domain events raised by an aggregate.</summary>
public interface IHasDomainEvents
{
    IReadOnlyCollection<IDomainEvent> DomainEvents { get; }
    void ClearDomainEvents();
}
