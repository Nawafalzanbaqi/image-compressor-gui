using System.Text.Json;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using SoftwareFactory.Application.Common.Interfaces;

namespace SoftwareFactory.Infrastructure.Caching;

/// <summary>
/// Redis-backed <see cref="ICacheService"/> for hot reads. Degrades gracefully:
/// if Redis is unavailable it simply runs the factory (no caching), so the app
/// still works in local dev without Redis.
/// </summary>
public sealed class RedisCacheService : ICacheService
{
    private static readonly TimeSpan DefaultTtl = TimeSpan.FromMinutes(5);
    private readonly IConnectionMultiplexer? _redis;
    private readonly ILogger<RedisCacheService> _logger;

    public RedisCacheService(ILogger<RedisCacheService> logger, IConnectionMultiplexer? redis = null)
    {
        _logger = logger;
        _redis = redis;
    }

    public async Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? ttl = null,
        CancellationToken cancellationToken = default)
    {
        var db = TryGetDatabase();
        if (db is null)
            return await factory();

        try
        {
            var cached = await db.StringGetAsync(key);
            if (cached.HasValue)
            {
                var value = JsonSerializer.Deserialize<T>((string)cached!);
                if (value is not null)
                    return value;
            }

            var fresh = await factory();
            var serialized = JsonSerializer.Serialize(fresh);
            await db.StringSetAsync(key, serialized, ttl ?? DefaultTtl);
            return fresh;
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis unavailable for key {Key}; bypassing cache.", key);
            return await factory();
        }
    }

    public async Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        var db = TryGetDatabase();
        if (db is null)
            return;

        try
        {
            // Support simple "prefix:*" invalidation used by write handlers.
            if (key.EndsWith('*') && _redis is not null)
            {
                var pattern = key;
                foreach (var endpoint in _redis.GetEndPoints())
                {
                    var server = _redis.GetServer(endpoint);
                    foreach (var redisKey in server.Keys(pattern: pattern))
                        await db.KeyDeleteAsync(redisKey);
                }
                return;
            }

            await db.KeyDeleteAsync(key);
        }
        catch (RedisException ex)
        {
            _logger.LogWarning(ex, "Redis unavailable while removing key {Key}.", key);
        }
    }

    private IDatabase? TryGetDatabase()
    {
        if (_redis is null || !_redis.IsConnected)
            return null;
        try { return _redis.GetDatabase(); }
        catch (RedisException) { return null; }
    }
}
