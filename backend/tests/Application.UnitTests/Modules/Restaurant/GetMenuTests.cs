using FluentAssertions;
using SoftwareFactory.Application.Modules.Restaurant.Menu.Queries.GetMenu;
using SoftwareFactory.Application.UnitTests.TestSupport;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Restaurant;
using Xunit;

namespace SoftwareFactory.Application.UnitTests.Modules.Restaurant;

public class GetMenuTests
{
    [Fact]
    public async Task Handle_groups_items_under_ordered_categories()
    {
        await using var db = TestDb.CreateContext();
        var starters = new MenuCategory("Starters", 1);
        var mains = new MenuCategory("Mains", 2);
        db.MenuCategories.AddRange(starters, mains);
        db.MenuItems.AddRange(
            new MenuItem("Hummus", Money.Of(22m), starters.Id, isVegetarian: true),
            new MenuItem("Kofta", Money.Of(48m), mains.Id, isSpicy: true),
            new MenuItem("Shawarma", Money.Of(39m), mains.Id));
        await db.SaveChangesAsync();

        var handler = new GetMenuQueryHandler(db);
        var menu = await handler.Handle(new GetMenuQuery(), CancellationToken.None);

        menu.Categories.Should().HaveCount(2);
        menu.Categories[0].Name.Should().Be("Starters");
        menu.Categories[0].Items.Should().ContainSingle(i => i.Name == "Hummus" && i.IsVegetarian);
        menu.Categories[1].Items.Should().HaveCount(2);
    }
}
