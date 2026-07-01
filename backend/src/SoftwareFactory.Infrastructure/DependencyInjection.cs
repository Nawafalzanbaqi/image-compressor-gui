using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using StackExchange.Redis;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Infrastructure.Caching;
using SoftwareFactory.Infrastructure.Configuration;
using SoftwareFactory.Infrastructure.Persistence;
using SoftwareFactory.Infrastructure.Persistence.Repositories;

namespace SoftwareFactory.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration config)
    {
        // ── Config-driven build: load options.json and expose feature flags ──────
        var optionsProvider = new OptionsJsonProvider();
        var factoryOptions = optionsProvider.Load(config["Factory:OptionsPath"]);
        services.AddSingleton(factoryOptions);
        services.AddSingleton<IFeatureFlags>(new FeatureFlags(factoryOptions));

        // ── EF Core / PostgreSQL (parameterized queries only) ────────────────────
        var connectionString = config.GetConnectionString("Postgres")
            ?? "Host=localhost;Port=5432;Database=factory;Username=factory;Password=factory";
        services.AddDbContext<AppDbContext>(o => o.UseNpgsql(connectionString));
        services.AddScoped<IAppDbContext>(sp => sp.GetRequiredService<AppDbContext>());
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        services.AddScoped<IDomainEventDispatcher, DomainEventDispatcher>();

        // ── Redis (optional; cache degrades gracefully if unavailable) ───────────
        var redisConnection = config.GetConnectionString("Redis") ?? config["ConnectionStrings:Redis"];
        if (!string.IsNullOrWhiteSpace(redisConnection))
        {
            try
            {
                var configOptions = ConfigurationOptions.Parse(redisConnection);
                configOptions.AbortOnConnectFail = false;
                var mux = ConnectionMultiplexer.Connect(configOptions);
                services.AddSingleton<IConnectionMultiplexer>(mux);
            }
            catch (RedisException)
            {
                // Leave IConnectionMultiplexer unregistered — cache falls back to no-op.
            }
        }
        services.AddSingleton<ICacheService, RedisCacheService>();

        // ── Config-driven module registration ────────────────────────────────────
        // Reference modules are always on for the ecommerce vertical. Optional
        // modules are only wired when their flag is enabled — adding a module here
        // never requires editing existing modules.
        RegisterOptionalModules(services, new FeatureFlags(factoryOptions));

        return services;
    }

    private static void RegisterOptionalModules(IServiceCollection services, IFeatureFlags flags)
    {
        // Example extension point: register a module's services only when enabled.
        // if (flags.Reviews) services.AddScoped<IReviewModerationService, ReviewModerationService>();
        // if (flags.Loyalty) services.AddScoped<ILoyaltyService, LoyaltyService>();
        // TODO(phase-2): analytics sink, WhatsApp/ZATCA integration clients gated by
        // flags.Analytics / options.Integrations.
        _ = services;
        _ = flags;
    }
}
