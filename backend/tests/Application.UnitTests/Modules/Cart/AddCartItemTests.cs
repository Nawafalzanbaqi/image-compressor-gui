using FluentAssertions;
using SoftwareFactory.Application.Shared.Commerce.Cart.Commands.AddCartItem;
using SoftwareFactory.Application.UnitTests.TestSupport;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Categories;
using SoftwareFactory.Domain.Modules.Products;
using SoftwareFactory.Infrastructure.Modules.Products;
using Xunit;

namespace SoftwareFactory.Application.UnitTests.Modules.Cart;

public class AddCartItemTests
{
    [Fact]
    public async Task Handle_adds_item_and_computes_subtotal()
    {
        await using var db = TestDb.CreateContext();
        var category = new Category("Electronics", 1);
        db.Categories.Add(category);
        var product = new Product("Cable", Money.Of(25m), category.Id);
        db.Products.Add(product);
        await db.SaveChangesAsync();

        var handler = new AddCartItemCommandHandler(db, new ProductCatalogService(db));
        var cartId = Guid.NewGuid();

        var cart = await handler.Handle(new AddCartItemCommand(cartId, product.Id, 3), CancellationToken.None);

        cart.Items.Should().ContainSingle();
        cart.ItemCount.Should().Be(3);
        cart.Subtotal.Amount.Should().Be(75m);
    }

    [Fact]
    public async Task Handle_merges_quantity_for_same_product()
    {
        await using var db = TestDb.CreateContext();
        var category = new Category("Electronics", 1);
        db.Categories.Add(category);
        var product = new Product("Cable", Money.Of(25m), category.Id);
        db.Products.Add(product);
        await db.SaveChangesAsync();

        var handler = new AddCartItemCommandHandler(db, new ProductCatalogService(db));
        var cartId = Guid.NewGuid();

        await handler.Handle(new AddCartItemCommand(cartId, product.Id, 1), CancellationToken.None);
        var cart = await handler.Handle(new AddCartItemCommand(cartId, product.Id, 2), CancellationToken.None);

        cart.Items.Should().ContainSingle();
        cart.ItemCount.Should().Be(3);
    }
}
