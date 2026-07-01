using FluentAssertions;
using SoftwareFactory.Application.Shared.Commerce.Orders.Commands.PlaceOrder;
using SoftwareFactory.Application.UnitTests.TestSupport;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Categories;
using SoftwareFactory.Domain.Modules.Products;
using CartAggregate = SoftwareFactory.Domain.Shared.Commerce.Cart.Cart;
using Xunit;

namespace SoftwareFactory.Application.UnitTests.Modules.Orders;

public class PlaceOrderTests
{
    [Fact]
    public async Task Handle_creates_order_from_cart_and_clears_it()
    {
        await using var db = TestDb.CreateContext();
        var category = new Category("Electronics", 1);
        db.Categories.Add(category);
        var product = new Product("Speaker", Money.Of(200m), category.Id);
        db.Products.Add(product);

        var cart = new CartAggregate(Guid.NewGuid());
        cart.AddItem(product.Id, product.Name, product.Price, 2);
        db.Carts.Add(cart);
        await db.SaveChangesAsync();

        var handler = new PlaceOrderCommandHandler(db);
        var command = new PlaceOrderCommand(cart.Id, "Ahmed", "ahmed@example.com", "0500000000",
            "123 King Fahd Rd, Riyadh", "tamara");

        var order = await handler.Handle(command, CancellationToken.None);

        order.OrderNumber.Should().StartWith("SF-");
        order.Status.Should().Be("Pending");
        order.Total.Amount.Should().Be(400m);
        order.Items.Should().ContainSingle();

        var refreshed = await db.Carts.FindAsync(cart.Id);
        refreshed!.Items.Should().BeEmpty();
    }

    [Fact]
    public async Task Handle_throws_on_empty_cart()
    {
        await using var db = TestDb.CreateContext();
        var cart = new CartAggregate(Guid.NewGuid());
        db.Carts.Add(cart);
        await db.SaveChangesAsync();

        var handler = new PlaceOrderCommandHandler(db);
        var command = new PlaceOrderCommand(cart.Id, "Ahmed", "ahmed@example.com", null,
            "123 King Fahd Rd", "tamara");

        var act = () => handler.Handle(command, CancellationToken.None);

        await act.Should().ThrowAsync<InvalidOperationException>();
    }
}
