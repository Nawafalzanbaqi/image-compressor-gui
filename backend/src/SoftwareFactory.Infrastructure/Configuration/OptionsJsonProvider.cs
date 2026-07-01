using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace SoftwareFactory.Infrastructure.Configuration;

/// <summary>
/// Loads and parses the root <c>options.json</c>. The path comes from config key
/// <c>Factory:OptionsPath</c> (set to /app/options.json in Docker); otherwise it
/// walks up from the working directory to find the repo-root options.json.
/// </summary>
public sealed class OptionsJsonProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public FactoryOptions Load(string? configuredPath, ILogger? logger = null)
    {
        var path = ResolvePath(configuredPath);
        if (path is null || !File.Exists(path))
        {
            logger?.LogWarning("options.json not found (looked for {Path}); using defaults.", path ?? "<none>");
            return new FactoryOptions();
        }

        try
        {
            var json = File.ReadAllText(path);
            var options = JsonSerializer.Deserialize<FactoryOptions>(json, JsonOptions);
            logger?.LogInformation("Loaded factory options from {Path} (siteType={SiteType})",
                path, options?.SiteType);
            return options ?? new FactoryOptions();
        }
        catch (Exception ex) when (ex is IOException or JsonException)
        {
            logger?.LogError(ex, "Failed to read options.json at {Path}; using defaults.", path);
            return new FactoryOptions();
        }
    }

    private static string? ResolvePath(string? configuredPath)
    {
        if (!string.IsNullOrWhiteSpace(configuredPath) && File.Exists(configuredPath))
            return configuredPath;

        // Walk up from the current directory looking for options.json (dev scenario).
        var dir = new DirectoryInfo(Directory.GetCurrentDirectory());
        for (var i = 0; i < 8 && dir is not null; i++)
        {
            var candidate = Path.Combine(dir.FullName, "options.json");
            if (File.Exists(candidate))
                return candidate;
            dir = dir.Parent;
        }

        return configuredPath;
    }
}
