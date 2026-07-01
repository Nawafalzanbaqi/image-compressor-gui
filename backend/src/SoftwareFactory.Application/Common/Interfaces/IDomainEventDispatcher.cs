using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Application.Common.Interfaces;

/// <summary>Dispatches domain events after they are persisted. Implemented in Infrastructure.</summary>
public interface IDomainEventDispatcher
{
    Task DispatchAsync(IReadOnlyCollection<IDomainEvent> events, CancellationToken cancellationToken = default);
}
