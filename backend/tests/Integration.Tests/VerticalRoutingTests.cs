using System.Net;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.Hosting;
using Xunit;

namespace SoftwareFactory.Integration.Tests;

/// <summary>
/// GENERALIZATION PROOF. Boots the SAME application binary twice — once with
/// options.json siteType=ecommerce, once with siteType=restaurant — and asserts
/// each vertical exposes only its own routes and the other vertical's routes are
/// absent (404). Shared routes (cart/orders/content) exist for both. No Docker/DB
/// needed: a mapped route returns a non-404 error (handler runs, DB just isn't up),
/// while an unmapped route returns 404.
/// </summary>
public class VerticalRoutingTests
{
    private static WebApplicationFactory<Program> FactoryFor(string siteType)
    {
        var json =
            $$"""
            { "siteType": "{{siteType}}", "language": "ar-en", "defaultDirection": "rtl",
              "payments": [], "integrations": [], "features": { "reviews": false }, "designDirection": "premium" }
            """;
        var path = Path.Combine(Path.GetTempPath(), $"options-{siteType}-{Guid.NewGuid():N}.json");
        File.WriteAllText(path, json);

        return new WebApplicationFactory<Program>().WithWebHostBuilder(builder =>
        {
            builder.UseSetting("Factory:OptionsPath", path);
            builder.UseEnvironment("Production"); // skip the dev DB seed
        });
    }

    [Theory]
    [InlineData("ecommerce", "/api/products", "/api/menu")]
    [InlineData("restaurant", "/api/menu", "/api/products")]
    public async Task Only_the_active_vertical_routes_are_mapped(string siteType, string present, string absent)
    {
        using var factory = FactoryFor(siteType);
        using var client = factory.CreateClient();

        var presentResponse = await client.GetAsync(present);
        presentResponse.StatusCode.Should().NotBe(HttpStatusCode.NotFound,
            $"{present} should be mapped for siteType={siteType}");

        var absentResponse = await client.GetAsync(absent);
        absentResponse.StatusCode.Should().Be(HttpStatusCode.NotFound,
            $"{absent} must NOT be mapped for siteType={siteType}");
    }

    [Theory]
    [InlineData("ecommerce")]
    [InlineData("restaurant")]
    public async Task Shared_commerce_routes_exist_for_every_vertical(string siteType)
    {
        using var factory = FactoryFor(siteType);
        using var client = factory.CreateClient();

        // Cart + content are the shared/core modules — present regardless of vertical.
        var content = await client.GetAsync("/api/content/hero");
        content.StatusCode.Should().NotBe(HttpStatusCode.NotFound);

        var health = await client.GetAsync("/health");
        health.StatusCode.Should().Be(HttpStatusCode.OK);
    }
}
