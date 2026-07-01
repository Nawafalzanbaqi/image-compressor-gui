namespace SoftwareFactory.Application.Common.Interfaces;

/// <summary>
/// Strongly-typed view over the root <c>options.json</c>. Drives config-driven
/// module registration, endpoint mapping and DB seeding.
/// </summary>
public interface IFeatureFlags
{
    string SiteType { get; }
    string Language { get; }
    string DefaultDirection { get; }
    IReadOnlyList<string> Payments { get; }
    IReadOnlyList<string> Integrations { get; }
    string DesignDirection { get; }

    bool IsEnabled(string feature);

    bool ClientDashboard { get; }
    bool Cms { get; }
    bool Reviews { get; }
    bool Loyalty { get; }
    bool Analytics { get; }
}
