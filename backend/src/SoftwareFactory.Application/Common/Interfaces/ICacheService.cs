namespace SoftwareFactory.Application.Common.Interfaces;

/// <summary>Abstraction over the distributed cache (Redis in Infrastructure).</summary>
public interface ICacheService
{
    /// <summary>Returns the cached value or invokes <paramref name="factory"/>, caching its result.</summary>
    Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? ttl = null,
        CancellationToken cancellationToken = default);

    Task RemoveAsync(string key, CancellationToken cancellationToken = default);
}
