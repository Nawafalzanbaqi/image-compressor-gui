using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Categories;
using SoftwareFactory.Domain.Modules.Products;
using Xunit;

namespace SoftwareFactory.Integration.Tests;

/// <summary>
/// Integration test against real Postgres: verifies the EF model (owned Money value
/// object, primitive image collection, unique slug index) round-trips correctly.
/// </summary>
public class ProductPersistenceTests : IClassFixture<PostgresContainerFixture>
{
    private readonly PostgresContainerFixture _fixture;

    public ProductPersistenceTests(PostgresContainerFixture fixture) => _fixture = fixture;

    [Fact]
    public async Task Product_round_trips_through_postgres()
    {
        var categoryId = Guid.NewGuid();

        await using (var db = _fixture.CreateContext())
        {
            var category = new Category("Electronics", 1);
            db.Categories.Add(category);
            categoryId = category.Id;

            db.Products.Add(new Product("Mechanical Keyboard", Money.Of(349m, "SAR"), category.Id,
                "Hot-swappable switches.", new[] { "/img/kb-1.jpg", "/img/kb-2.jpg" }));
            await db.SaveChangesAsync();
        }

        await using (var db = _fixture.CreateContext())
        {
            var product = await db.Products.AsNoTracking()
                .FirstOrDefaultAsync(p => p.Slug == "mechanical-keyboard");

            product.Should().NotBeNull();
            product!.Price.Amount.Should().Be(349m);
            product.Price.Currency.Should().Be("SAR");
            product.ImageUrls.Should().HaveCount(2);
            product.CategoryId.Should().Be(categoryId);
        }
    }
}
