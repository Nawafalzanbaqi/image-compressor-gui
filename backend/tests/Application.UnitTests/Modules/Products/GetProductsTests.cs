using FluentAssertions;
using SoftwareFactory.Application.Modules.Products.Queries.GetProducts;
using SoftwareFactory.Application.UnitTests.TestSupport;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Categories;
using SoftwareFactory.Domain.Modules.Products;
using Xunit;

namespace SoftwareFactory.Application.UnitTests.Modules.Products;

public class GetProductsTests
{
    [Fact]
    public async Task Handle_returns_paged_active_products()
    {
        await using var db = TestDb.CreateContext();
        var category = new Category("Electronics", 1);
        db.Categories.Add(category);
        for (var i = 0; i < 25; i++)
            db.Products.Add(new Product($"Item {i:D2}", Money.Of(10m + i), category.Id));
        await db.SaveChangesAsync();

        var handler = new GetProductsQueryHandler(db);
        var page1 = await handler.Handle(new GetProductsQuery(Page: 1, PageSize: 20), CancellationToken.None);

        page1.TotalCount.Should().Be(25);
        page1.Items.Should().HaveCount(20);
        page1.Page.Should().Be(1);
        page1.TotalPages.Should().Be(2);
        page1.Items.Should().OnlyContain(p => p.CategorySlug == category.Slug);
    }

    [Fact]
    public async Task Handle_filters_by_search_term()
    {
        await using var db = TestDb.CreateContext();
        var category = new Category("Fashion", 1);
        db.Categories.Add(category);
        db.Products.Add(new Product("Blue Shirt", Money.Of(50m), category.Id));
        db.Products.Add(new Product("Red Shoes", Money.Of(80m), category.Id));
        await db.SaveChangesAsync();

        var handler = new GetProductsQueryHandler(db);
        var result = await handler.Handle(new GetProductsQuery(Search: "shirt"), CancellationToken.None);

        result.Items.Should().ContainSingle().Which.Name.Should().Be("Blue Shirt");
    }
}
