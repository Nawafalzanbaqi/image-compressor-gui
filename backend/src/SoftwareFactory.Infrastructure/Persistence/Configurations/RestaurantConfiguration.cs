using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using SoftwareFactory.Domain.Modules.Restaurant;

namespace SoftwareFactory.Infrastructure.Persistence.Configurations;

public sealed class MenuCategoryConfiguration : IEntityTypeConfiguration<MenuCategory>
{
    public void Configure(EntityTypeBuilder<MenuCategory> builder)
    {
        builder.ToTable("menu_categories");
        builder.HasKey(c => c.Id);
        builder.Property(c => c.Slug).HasMaxLength(220).IsRequired();
        builder.HasIndex(c => c.Slug).IsUnique();
        builder.Property(c => c.Name).HasMaxLength(200).IsRequired();
    }
}

public sealed class MenuItemConfiguration : IEntityTypeConfiguration<MenuItem>
{
    public void Configure(EntityTypeBuilder<MenuItem> builder)
    {
        builder.ToTable("menu_items");
        builder.HasKey(m => m.Id);
        builder.Property(m => m.Slug).HasMaxLength(220).IsRequired();
        builder.HasIndex(m => m.Slug).IsUnique();
        builder.Property(m => m.Name).HasMaxLength(200).IsRequired();
        builder.Property(m => m.Description).HasMaxLength(4000);

        builder.OwnsOne(m => m.Price, money =>
        {
            money.Property(p => p.Amount).HasColumnName("price_amount").HasColumnType("numeric(18,2)");
            money.Property(p => p.Currency).HasColumnName("price_currency").HasMaxLength(3);
        });
        builder.Navigation(m => m.Price).IsRequired();

        builder.Property(m => m.ImageUrls);
        builder.HasIndex(m => m.MenuCategoryId);
    }
}

public sealed class BranchConfiguration : IEntityTypeConfiguration<Branch>
{
    public void Configure(EntityTypeBuilder<Branch> builder)
    {
        builder.ToTable("branches");
        builder.HasKey(b => b.Id);
        builder.Property(b => b.Slug).HasMaxLength(220).IsRequired();
        builder.HasIndex(b => b.Slug).IsUnique();
        builder.Property(b => b.Name).HasMaxLength(200).IsRequired();
        builder.Property(b => b.Address).HasMaxLength(500).IsRequired();
        builder.Property(b => b.City).HasMaxLength(120).IsRequired();
        builder.Property(b => b.Phone).HasMaxLength(40);
        builder.Property(b => b.OpeningHours).HasMaxLength(500);
    }
}

public sealed class RestaurantTableConfiguration : IEntityTypeConfiguration<RestaurantTable>
{
    public void Configure(EntityTypeBuilder<RestaurantTable> builder)
    {
        builder.ToTable("restaurant_tables");
        builder.HasKey(t => t.Id);
        builder.Property(t => t.Label).HasMaxLength(60).IsRequired();
        builder.HasIndex(t => t.BranchId);
    }
}

public sealed class ReservationConfiguration : IEntityTypeConfiguration<Reservation>
{
    public void Configure(EntityTypeBuilder<Reservation> builder)
    {
        builder.ToTable("reservations");
        builder.HasKey(r => r.Id);
        builder.Property(r => r.ReferenceNumber).HasMaxLength(40).IsRequired();
        builder.HasIndex(r => r.ReferenceNumber).IsUnique();
        builder.Property(r => r.CustomerName).HasMaxLength(200).IsRequired();
        builder.Property(r => r.CustomerPhone).HasMaxLength(40).IsRequired();
        builder.Property(r => r.CustomerEmail).HasMaxLength(256);
        builder.Property(r => r.Notes).HasMaxLength(1000);
        builder.Property(r => r.Status).HasConversion<string>().HasMaxLength(20);
        builder.HasIndex(r => r.BranchId);
    }
}
