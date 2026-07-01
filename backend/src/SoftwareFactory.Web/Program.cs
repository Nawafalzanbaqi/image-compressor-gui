using System.Threading.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Serilog;
using SoftwareFactory.Application;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Infrastructure;
using SoftwareFactory.Infrastructure.Persistence;
using SoftwareFactory.Infrastructure.Persistence.Seed;
using SoftwareFactory.Web.Endpoints;
using SoftwareFactory.Web.Middleware;

var builder = WebApplication.CreateBuilder(args);

// ── Logging ──────────────────────────────────────────────────────────────────
builder.Host.UseSerilog((ctx, cfg) => cfg
    .ReadFrom.Configuration(ctx.Configuration)
    .WriteTo.Console());

// ── Layers ───────────────────────────────────────────────────────────────────
builder.Services.AddApplication();
builder.Services.AddInfrastructure(builder.Configuration);

// ── OpenAPI / Swagger (contract lives in /openapi/openapi.yaml) ──────────────
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ── CORS (frontend origin only) ──────────────────────────────────────────────
var origins = (builder.Configuration["Cors:AllowedOrigins"] ?? "http://localhost:3000")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
builder.Services.AddCors(o => o.AddPolicy("frontend", p =>
    p.WithOrigins(origins).AllowAnyHeader().AllowAnyMethod()));

// ── Rate limiting (public endpoints) — fixed window per client IP ────────────
builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.GlobalLimiter = PartitionedRateLimiter.Create<HttpContext, string>(context =>
        RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: context.Connection.RemoteIpAddress?.ToString() ?? "anonymous",
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 100,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            }));
});

var app = builder.Build();

// ── Middleware pipeline ──────────────────────────────────────────────────────
app.UseMiddleware<ExceptionHandlingMiddleware>();
app.UseMiddleware<SecurityHeadersMiddleware>();
app.UseSerilogRequestLogging();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("frontend");
app.UseRateLimiter();

// ── Health ───────────────────────────────────────────────────────────────────
app.MapGet("/health", () => Results.Ok(new { status = "healthy" })).WithTags("Health");

// ── Endpoints (config-driven) ────────────────────────────────────────────────
var flags = app.Services.GetRequiredService<IFeatureFlags>();

// Reference modules — always on for the ecommerce vertical.
app.MapProductsEndpoints();
app.MapCategoriesEndpoints();
app.MapCartEndpoints();
app.MapOrdersEndpoints();
app.MapContentEndpoints();

// Optional modules — mapped only when their options.json flag is enabled.
// A disabled feature's endpoints never enter the routing table.
if (flags.Reviews)
    app.MapReviewsEndpoints();
// TODO(phase-2): if (flags.Loyalty) app.MapLoyaltyEndpoints();  (wishlist/loyalty modules)

// ── Dev database init + seed (respects feature flags) ────────────────────────
if (app.Environment.IsDevelopment())
{
    using var scope = app.Services.CreateScope();
    var sp = scope.ServiceProvider;
    var logger = sp.GetRequiredService<ILogger<Program>>();
    try
    {
        var db = sp.GetRequiredService<AppDbContext>();
        // EnsureCreated keeps local/dev onboarding one-command. For production add
        // EF migrations (`dotnet ef migrations add InitialCreate`) and call MigrateAsync.
        await db.Database.EnsureCreatedAsync();
        await DbSeeder.SeedAsync(db, flags, logger);
    }
    catch (Exception ex)
    {
        logger.LogWarning(ex, "Database initialization skipped (no database reachable).");
    }
}

app.Run();

// Exposed for WebApplicationFactory in the integration test project.
public partial class Program;
