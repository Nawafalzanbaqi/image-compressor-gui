using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Infrastructure.Persistence;

namespace SoftwareFactory.Application.UnitTests.TestSupport;

/// <summary>Spins up an EF Core InMemory <see cref="AppDbContext"/> per test.</summary>
public static class TestDb
{
    public static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase($"factory-tests-{Guid.NewGuid()}")
            .EnableSensitiveDataLogging()
            .Options;
        return new AppDbContext(options);
    }
}

/// <summary>No-op cache — always runs the factory. Keeps handler tests deterministic.</summary>
public sealed class PassthroughCache : ICacheService
{
    public Task<T> GetOrSetAsync<T>(string key, Func<Task<T>> factory, TimeSpan? ttl = null,
        CancellationToken cancellationToken = default) => factory();

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default) => Task.CompletedTask;
}
