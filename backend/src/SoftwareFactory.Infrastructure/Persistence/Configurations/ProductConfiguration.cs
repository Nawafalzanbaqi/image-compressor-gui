using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SoftwareFactory.Domain.Modules.Products;

namespace SoftwareFactory.Infrastructure.Persistence.Configurations;

public sealed class ProductConfiguration : IEntityTypeConfiguration<Product>
{
    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.ToTable("products");
        builder.HasKey(p => p.Id);

        builder.Property(p => p.Slug).HasMaxLength(220).IsRequired();
        builder.HasIndex(p => p.Slug).IsUnique();

        builder.Property(p => p.Name).HasMaxLength(200).IsRequired();
        builder.Property(p => p.Description).HasMaxLength(4000);

        // Money as an owned value object.
        builder.OwnsOne(p => p.Price, money =>
        {
            money.Property(m => m.Amount).HasColumnName("price_amount").HasColumnType("numeric(18,2)");
            money.Property(m => m.Currency).HasColumnName("price_currency").HasMaxLength(3);
        });
        builder.Navigation(p => p.Price).IsRequired();

        // Primitive collection (EF Core 8+) — stored as JSON/array by the provider.
        builder.Property(p => p.ImageUrls);

        builder.Property(p => p.InStock);
        builder.Property(p => p.IsActive);
        builder.HasIndex(p => p.CategoryId);
    }
}
