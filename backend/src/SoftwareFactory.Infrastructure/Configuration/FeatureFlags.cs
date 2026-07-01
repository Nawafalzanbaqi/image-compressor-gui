using SoftwareFactory.Application.Common.Interfaces;

namespace SoftwareFactory.Infrastructure.Configuration;

/// <summary>Wraps <see cref="FactoryOptions"/> as the app-wide <see cref="IFeatureFlags"/>.</summary>
public sealed class FeatureFlags : IFeatureFlags
{
    private readonly FactoryOptions _options;

    public FeatureFlags(FactoryOptions options) => _options = options;

    public string SiteType => _options.SiteType;
    public string Language => _options.Language;
    public string DefaultDirection => _options.DefaultDirection;
    public IReadOnlyList<string> Payments => _options.Payments;
    public IReadOnlyList<string> Integrations => _options.Integrations;
    public string DesignDirection => _options.DesignDirection;

    public bool IsEnabled(string feature) =>
        _options.Features.TryGetValue(feature, out var value) && value;

    public bool ClientDashboard => IsEnabled("clientDashboard");
    public bool Cms => IsEnabled("cms");
    public bool Reviews => IsEnabled("reviews");
    public bool Loyalty => IsEnabled("loyalty");
    public bool Analytics => IsEnabled("analytics");
}
