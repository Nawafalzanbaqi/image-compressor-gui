using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using CartAggregate = SoftwareFactory.Domain.Modules.Cart.Cart;
using CartItemEntity = SoftwareFactory.Domain.Modules.Cart.CartItem;

namespace SoftwareFactory.Infrastructure.Persistence.Configurations;

public sealed class CartConfiguration : IEntityTypeConfiguration<CartAggregate>
{
    public void Configure(EntityTypeBuilder<CartAggregate> builder)
    {
        builder.ToTable("carts");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Currency).HasMaxLength(3);
        builder.Ignore(c => c.Subtotal);
        builder.Ignore(c => c.ItemCount);

        // Aggregate owns its items through the private _items backing field.
        builder.HasMany(c => c.Items)
            .WithOne()
            .HasForeignKey(i => i.CartId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Metadata.FindNavigation(nameof(CartAggregate.Items))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}

public sealed class CartItemConfiguration : IEntityTypeConfiguration<CartItemEntity>
{
    public void Configure(EntityTypeBuilder<CartItemEntity> builder)
    {
        builder.ToTable("cart_items");
        builder.HasKey(i => i.Id);
        builder.Property(i => i.ProductName).HasMaxLength(200);
        builder.Ignore(i => i.LineTotal);

        builder.OwnsOne(i => i.UnitPrice, money =>
        {
            money.Property(m => m.Amount).HasColumnName("unit_price_amount").HasColumnType("numeric(18,2)");
            money.Property(m => m.Currency).HasColumnName("unit_price_currency").HasMaxLength(3);
        });
        builder.Navigation(i => i.UnitPrice).IsRequired();
    }
}
