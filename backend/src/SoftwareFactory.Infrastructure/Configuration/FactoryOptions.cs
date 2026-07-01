using System.Text.Json.Serialization;

namespace SoftwareFactory.Infrastructure.Configuration;

/// <summary>Strongly-typed shape of the root <c>options.json</c>.</summary>
public sealed class FactoryOptions
{
    [JsonPropertyName("siteType")] public string SiteType { get; set; } = "ecommerce";
    [JsonPropertyName("language")] public string Language { get; set; } = "ar-en";
    [JsonPropertyName("defaultDirection")] public string DefaultDirection { get; set; } = "rtl";
    [JsonPropertyName("payments")] public List<string> Payments { get; set; } = new();
    [JsonPropertyName("integrations")] public List<string> Integrations { get; set; } = new();
    [JsonPropertyName("features")] public Dictionary<string, bool> Features { get; set; } = new();
    [JsonPropertyName("designDirection")] public string DesignDirection { get; set; } = "premium";
}
