using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SoftwareFactory.Domain.Modules.Orders;

namespace SoftwareFactory.Infrastructure.Persistence.Configurations;

public sealed class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("orders");
        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber).HasMaxLength(40).IsRequired();
        builder.HasIndex(o => o.OrderNumber).IsUnique();

        builder.Property(o => o.Status).HasConversion<string>().HasMaxLength(20);
        builder.Property(o => o.CustomerName).HasMaxLength(200).IsRequired();
        builder.Property(o => o.CustomerEmail).HasMaxLength(256).IsRequired();
        builder.Property(o => o.CustomerPhone).HasMaxLength(40);
        builder.Property(o => o.ShippingAddress).HasMaxLength(1000).IsRequired();
        builder.Property(o => o.PaymentMethod).HasMaxLength(40).IsRequired();

        builder.OwnsOne(o => o.Total, money =>
        {
            money.Property(m => m.Amount).HasColumnName("total_amount").HasColumnType("numeric(18,2)");
            money.Property(m => m.Currency).HasColumnName("total_currency").HasMaxLength(3);
        });
        builder.Navigation(o => o.Total).IsRequired();

        builder.HasMany(o => o.Items)
            .WithOne()
            .HasForeignKey(i => i.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.Metadata.FindNavigation(nameof(Order.Items))!
            .SetPropertyAccessMode(PropertyAccessMode.Field);
    }
}

public sealed class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.ToTable("order_items");
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
