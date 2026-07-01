namespace SoftwareFactory.Application.Common.Behaviours;

/// <summary>
/// Marker for queries whose result should be cached (hot reads). The
/// <see cref="CachingBehaviour{TRequest,TResponse}"/> transparently caches them in Redis.
/// </summary>
public interface ICacheableQuery
{
    string CacheKey { get; }
    TimeSpan? Ttl => TimeSpan.FromMinutes(5);
}
