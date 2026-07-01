using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using SoftwareFactory.Infrastructure.Persistence;

namespace SoftwareFactory.Web;

/// <summary>
/// Design-time factory so `dotnet ef migrations add &lt;Name&gt;` works from the Web
/// project without a running app. Runtime uses the DI-configured context instead.
/// </summary>
public sealed class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
{
    public AppDbContext CreateDbContext(string[] args)
    {
        var connectionString = Environment.GetEnvironmentVariable("ConnectionStrings__Postgres")
            ?? "Host=localhost;Port=5432;Database=factory;Username=factory;Password=factory";

        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseNpgsql(connectionString)
            .Options;

        return new AppDbContext(options);
    }
}
