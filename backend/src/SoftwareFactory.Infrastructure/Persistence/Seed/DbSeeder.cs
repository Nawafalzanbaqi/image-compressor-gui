using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using SoftwareFactory.Application.Common.Interfaces;
using SoftwareFactory.Domain.Common;
using SoftwareFactory.Domain.Modules.Categories;
using SoftwareFactory.Domain.Modules.Content;
using SoftwareFactory.Domain.Modules.Products;
using SoftwareFactory.Domain.Modules.Reviews;

namespace SoftwareFactory.Infrastructure.Persistence.Seed;

/// <summary>
/// Idempotent development seed. Respects options.json: data for a disabled feature
/// is never seeded (e.g. no reviews rows when <c>features.reviews == false</c>).
/// </summary>
public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext db, IFeatureFlags flags, ILogger logger,
        CancellationToken ct = default)
    {
        if (!await db.Categories.AnyAsync(ct))
        {
            logger.LogInformation("Seeding categories & products…");

            var electronics = new Category("Electronics", 1);
            var fashion = new Category("Fashion", 2);
            var home = new Category("Home & Kitchen", 3);
            db.Categories.AddRange(electronics, fashion, home);

            db.Products.AddRange(
                new Product("Wireless Headphones", Money.Of(499m), electronics.Id,
                    "Premium over-ear wireless headphones with ANC.",
                    new[] { "/images/products/headphones.jpg" }),
                new Product("Smart Watch", Money.Of(899m), electronics.Id,
                    "Fitness and notifications on your wrist.",
                    new[] { "/images/products/watch.jpg" }),
                new Product("Cotton T-Shirt", Money.Of(89m), fashion.Id,
                    "Soft premium cotton, unisex fit.",
                    new[] { "/images/products/tshirt.jpg" }),
                new Product("Ceramic Cookware Set", Money.Of(650m), home.Id,
                    "Non-stick ceramic set, 8 pieces.",
                    new[] { "/images/products/cookware.jpg" }));

            await db.SaveChangesAsync(ct);

            // Reviews are gated: only seed when the feature is on.
            if (flags.Reviews)
            {
                var product = await db.Products.FirstAsync(ct);
                db.Reviews.Add(new Review(product.Id, "Sara", 5, "Excellent quality!"));
                await db.SaveChangesAsync(ct);
            }
            else
            {
                logger.LogInformation("features.reviews is off — skipping review seed.");
            }
        }

        if (!await db.ContentBlocks.AnyAsync(ct))
        {
            logger.LogInformation("Seeding CMS content blocks…");
            db.ContentBlocks.AddRange(
                new ContentBlock("hero", "primary", "hero", 0,
                    """{"headlineEn":"Premium products, delivered fast","headlineAr":"منتجات فاخرة، توصيل سريع","ctaEn":"Shop now","ctaAr":"تسوق الآن"}"""),
                new ContentBlock("footer", "about", "text", 0,
                    """{"en":"Your trusted store.","ar":"متجرك الموثوق."}"""),
                new ContentBlock("about", "intro", "richtext", 0,
                    """{"en":"We craft premium commerce experiences.","ar":"نصنع تجارب تسوق فاخرة."}"""));
            await db.SaveChangesAsync(ct);
        }
    }
}
