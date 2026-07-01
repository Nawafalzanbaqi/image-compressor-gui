using Microsoft.Extensions.Logging;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Domain.Common;

namespace SoftwareFactory.Infrastructure.Persistence;

/// <summary>
/// Dispatches domain events after persistence. Phase 1 logs them as the audit hook;
/// this is the single extension point where module event handlers get wired.
/// TODO(phase-2): publish to MediatR notifications / an outbox for integrations
/// (e.g. OrderPlaced -> WhatsApp confirmation, ZATCA e-invoice, loyalty points).
/// </summary>
public sealed class DomainEventDispatcher : IDomainEventDispatcher
{
    private readonly ILogger<DomainEventDispatcher> _logger;

    public DomainEventDispatcher(ILogger<DomainEventDispatcher> logger) => _logger = logger;

    public Task DispatchAsync(IReadOnlyCollection<IDomainEvent> events, CancellationToken cancellationToken = default)
    {
        foreach (var domainEvent in events)
        {
            _logger.LogInformation("Domain event raised: {EventType} at {OccurredOn}",
                domainEvent.GetType().Name, domainEvent.OccurredOnUtc);
        }

        return Task.CompletedTask;
    }
}
