using FluentAssertions;
using SoftwareFactory.Application.Shared.Commerce.Cart.Commands.AddCartItem;
using SoftwareFactory.Application.UnitTests.TestSupport;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Restaurant;
using SoftwareFactory.Infrastructure.Modules.Restaurant;
using Xunit;

namespace SoftwareFactory.Application.UnitTests.Modules.Restaurant;

/// <summary>
/// Proves the SHARED cart/checkout core generalizes: the exact same AddCartItem use
/// case that serves ecommerce Products also serves restaurant MenuItems, purely by
/// swapping the ICatalogService implementation (MenuCatalogService here).
/// </summary>
public class SharedCartWithMenuCatalogTests
{
    [Fact]
    public async Task Shared_cart_accepts_menu_items_via_menu_catalog()
    {
        await using var db = TestDb.CreateContext();
        var mains = new MenuCategory("Mains", 1);
        db.MenuCategories.Add(mains);
        var kofta = new MenuItem("Grilled Kofta", Money.Of(48m), mains.Id);
        db.MenuItems.Add(kofta);
        await db.SaveChangesAsync();

        // Same shared handler as ecommerce — only the catalog adapter differs.
        var handler = new AddCartItemCommandHandler(db, new MenuCatalogService(db));
        var cartId = Guid.NewGuid();

        var cart = await handler.Handle(new AddCartItemCommand(cartId, kofta.Id, 2), CancellationToken.None);

        cart.Items.Should().ContainSingle();
        cart.Items[0].ProductName.Should().Be("Grilled Kofta");
        cart.Subtotal.Amount.Should().Be(96m);
    }
}
