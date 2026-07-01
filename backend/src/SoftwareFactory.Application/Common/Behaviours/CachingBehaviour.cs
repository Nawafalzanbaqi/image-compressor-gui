using MediatR;
using SoftwareFactory.Application.Common.Interfaces;

namespace SoftwareFactory.Application.Common.Behaviours;

/// <summary>
/// Transparently caches responses for queries implementing <see cref="ICacheableQuery"/>
/// (e.g. product listings, category trees) — the "Redis caching for hot reads" requirement.
/// </summary>
public sealed class CachingBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ICacheService _cache;

    public CachingBehaviour(ICacheService cache) => _cache = cache;

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (request is not ICacheableQuery cacheable)
            return await next();

        return await _cache.GetOrSetAsync(
            cacheable.CacheKey,
            async () => await next(),
            cacheable.Ttl,
            cancellationToken);
    }
}
