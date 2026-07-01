using FluentAssertions;
using SoftwareFactory.Application.Common.Exceptions;
using SoftwareFactory.Application.Modules.Products.Commands.CreateProduct;
using SoftwareFactory.Application.UnitTests.TestSupport;
using SoftwareFactory.Domain.Modules.Categories;
using Xunit;

namespace SoftwareFactory.Application.UnitTests.Modules.Products;

public class CreateProductTests
{
    [Fact]
    public async Task Handle_creates_product_under_existing_category()
    {
        await using var db = TestDb.CreateContext();
        var category = new Category("Electronics", 1);
        db.Categories.Add(category);
        await db.SaveChangesAsync();

        var handler = new CreateProductCommandHandler(db, new PassthroughCache());
        var command = new CreateProductCommand("Wireless Mouse", "Ergonomic", 129m, "SAR",
            category.Slug, new[] { "/img/mouse.jpg" });

        var result = await handler.Handle(command, CancellationToken.None);

        result.Name.Should().Be("Wireless Mouse");
        result.Slug.Should().Be("wireless-mouse");
        result.Price.Amount.Should().Be(129m);
        result.CategorySlug.Should().Be(category.Slug);
        db.Products.Should().ContainSingle();
    }

    [Fact]
    public async Task Handle_throws_when_category_missing()
    {
        await using var db = TestDb.CreateContext();
        var handler = new CreateProductCommandHandler(db, new PassthroughCache());
        var command = new CreateProductCommand("Orphan", null, 10m, "SAR", "nope", null);

        var act = () => handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<NotFoundException>();
    }

    [Theory]
    [InlineData("", 10)]     // empty name
    [InlineData("A", 10)]    // too short
    [InlineData("Valid", -5)] // negative price
    public void Validator_rejects_invalid_input(string name, decimal price)
    {
        var validator = new CreateProductCommandValidator();
        var result = validator.Validate(
            new CreateProductCommand(name, null, price, "SAR", "electronics", null));
        result.IsValid.Should().BeFalse();
    }
}
