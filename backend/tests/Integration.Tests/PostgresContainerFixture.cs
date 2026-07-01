using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Infrastructure.Persistence;
using Testcontainers.PostgreSql;
using Xunit;

namespace SoftwareFactory.Integration.Tests;

/// <summary>
/// Spins up a real PostgreSQL container once per test class and applies the EF Core
/// schema. Requires Docker (available on CI runners).
/// </summary>
public sealed class PostgresContainerFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container = new PostgreSqlBuilder()
        .WithImage("postgres:16-alpine")
        .WithDatabase("factory")
        .WithUsername("factory")
        .WithPassword("factory")
        .Build();

    public string ConnectionString => _container.GetConnectionString();

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
        await using var db = CreateContext();
        await db.Database.EnsureCreatedAsync();
    }

    public AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(ConnectionString)
            .Options;
        return new AppDbContext(options);
    }

    public Task DisposeAsync() => _container.DisposeAsync().AsTask();
}
