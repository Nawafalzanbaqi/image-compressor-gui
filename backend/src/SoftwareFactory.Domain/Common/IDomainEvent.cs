namespace SoftwareFactory.Domain.Common;

/// <summary>Marker for something that happened in the domain worth reacting to.</summary>
public interface IDomainEvent
{
    DateTime OccurredOnUtc { get; }
}
