using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Categories;
using SoftwareFactory.Domain.Modules.Content;
using SoftwareFactory.Domain.Modules.Products;
using SoftwareFactory.Domain.Modules.Restaurant;
using SoftwareFactory.Domain.Modules.Reviews;

namespace SoftwareFactory.Infrastructure.Persistence.Seed;

/// <summary>
/// Idempotent development seed. Config-driven: only the ACTIVE siteType's data is
/// seeded (ecommerce → products, restaurant → menu/branches), and data for a disabled
/// feature is never seeded (e.g. no reviews rows when <c>features.reviews == false</c>).
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, IFeatureFlags flags, ILogger logger,
        CancellationToken ct = default)
    {
        var siteType = flags.SiteType?.ToLowerInvariant() ?? "ecommerce";

        if (siteType == "restaurant")
            await SeedRestaurantAsync(db, flags, logger, ct);
        else
            await SeedEcommerceAsync(db, flags, logger, ct);

        await SeedContentAsync(db, siteType, logger, ct);
    }

    private static async Task SeedEcommerceAsync(AppDbContext db, IFeatureFlags flags, ILogger logger,
        CancellationToken ct)
    {
        if (await db.Categories.AnyAsync(ct)) return;
        logger.LogInformation("Seeding ecommerce categories & products…");

        var electronics = new Category("Electronics", 1);
        var fashion = new Category("Fashion", 2);
        var home = new Category("Home & Kitchen", 3);
        db.Categories.AddRange(electronics, fashion, home);

        db.Products.AddRange(
            new Product("Wireless Headphones", Money.Of(499m), electronics.Id,
                "Premium over-ear wireless headphones with ANC.", new[] { "/images/products/headphones.jpg" }),
            new Product("Smart Watch", Money.Of(899m), electronics.Id,
                "Fitness and notifications on your wrist.", new[] { "/images/products/watch.jpg" }),
            new Product("Cotton T-Shirt", Money.Of(89m), fashion.Id,
                "Soft premium cotton, unisex fit.", new[] { "/images/products/tshirt.jpg" }),
            new Product("Ceramic Cookware Set", Money.Of(650m), home.Id,
                "Non-stick ceramic set, 8 pieces.", new[] { "/images/products/cookware.jpg" }));
        await db.SaveChangesAsync(ct);

        if (flags.Reviews)
        {
            var product = await db.Products.FirstAsync(ct);
            db.Reviews.Add(new Review(product.Id, "Sara", 5, "Excellent quality!"));
            await db.SaveChangesAsync(ct);
        }
    }

    private static async Task SeedRestaurantAsync(AppDbContext db, IFeatureFlags flags, ILogger logger,
        CancellationToken ct)
    {
        if (await db.MenuCategories.AnyAsync(ct)) return;
        logger.LogInformation("Seeding restaurant menu, branches & tables…");

        var starters = new MenuCategory("Starters", 1);
        var mains = new MenuCategory("Mains", 2);
        var desserts = new MenuCategory("Desserts", 3);
        db.MenuCategories.AddRange(starters, mains, desserts);

        db.MenuItems.AddRange(
            new MenuItem("Hummus", Money.Of(22m), starters.Id, "Creamy chickpea dip with olive oil.",
                new[] { "/images/menu/hummus.jpg" }, isVegetarian: true),
            new MenuItem("Grilled Kofta", Money.Of(48m), mains.Id, "Char-grilled spiced minced meat skewers.",
                new[] { "/images/menu/kofta.jpg" }, isSpicy: true),
            new MenuItem("Chicken Shawarma Plate", Money.Of(39m), mains.Id, "Marinated chicken, garlic sauce, fries.",
                new[] { "/images/menu/shawarma.jpg" }),
            new MenuItem("Kunafa", Money.Of(28m), desserts.Id, "Sweet cheese pastry with syrup.",
                new[] { "/images/menu/kunafa.jpg" }, isVegetarian: true));

        var riyadh = new Branch("Riyadh — Olaya", "Olaya St, Al Olaya", "Riyadh", 24.6908, 46.6853,
            "+966 11 000 0000", "12:00–00:00 daily");
        var jeddah = new Branch("Jeddah — Corniche", "Corniche Rd", "Jeddah", 21.5810, 39.1360,
            "+966 12 000 0000", "13:00–01:00 daily");
        db.Branches.AddRange(riyadh, jeddah);
        await db.SaveChangesAsync(ct);

        db.RestaurantTables.AddRange(
            new RestaurantTable(riyadh.Id, "R1", 2),
            new RestaurantTable(riyadh.Id, "R2", 4),
            new RestaurantTable(jeddah.Id, "J1", 6));
        await db.SaveChangesAsync(ct);

        if (flags.Reviews)
        {
            var item = await db.MenuItems.FirstAsync(ct);
            db.Reviews.Add(new Review(item.Id, "Khaled", 5, "Best kofta in town!"));
            await db.SaveChangesAsync(ct);
        }
    }

    private static async Task SeedContentAsync(AppDbContext db, string siteType, ILogger logger,
        CancellationToken ct)
    {
        if (await db.ContentBlocks.AnyAsync(ct)) return;
        logger.LogInformation("Seeding CMS content blocks for {SiteType}…", siteType);

        if (siteType == "restaurant")
        {
            db.ContentBlocks.AddRange(
                new ContentBlock("hero", "primary", "hero", 0,
                    """{"headlineEn":"Authentic flavors, made fresh","headlineAr":"نكهات أصيلة، طازجة دائماً","ctaEn":"View menu","ctaAr":"استعرض القائمة"}"""),
                new ContentBlock("about", "intro", "richtext", 0,
                    """{"en":"A family kitchen serving regional classics.","ar":"مطبخ عائلي يقدم أطباقاً كلاسيكية."}"""),
                new ContentBlock("footer", "about", "text", 0,
                    """{"en":"Dine in or order online.","ar":"تناول لدينا أو اطلب أونلاين."}"""));
        }
        else
        {
            db.ContentBlocks.AddRange(
                new ContentBlock("hero", "primary", "hero", 0,
                    """{"headlineEn":"Premium products, delivered fast","headlineAr":"منتجات فاخرة، توصيل سريع","ctaEn":"Shop now","ctaAr":"تسوق الآن"}"""),
                new ContentBlock("about", "intro", "richtext", 0,
                    """{"en":"We craft premium commerce experiences.","ar":"نصنع تجارب تسوق فاخرة."}"""),
                new ContentBlock("footer", "about", "text", 0,
                    """{"en":"Your trusted store.","ar":"متجرك الموثوق."}"""));
        }
        await db.SaveChangesAsync(ct);
    }
}
